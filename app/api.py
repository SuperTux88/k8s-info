from flask import Blueprint, jsonify, abort, Response, request
import json
from kubernetes import client, config
from kubernetes.stream import stream
from utils import get_age, safe_to_iso_timestamp, safe_to_dict

api = Blueprint('api', __name__)


@api.errorhandler(client.rest.ApiException)
def handle_api_exception(e):
    if e.body:
        error = json.loads(e.body)
        return jsonify(error), error["code"]

    return Response(str(e), mimetype='text/plain'), 400


@api.route('/', defaults={'_path': ''})
@api.route('/<path:_path>')
def catch_all(_path):
    return jsonify({'message': 'Not found!'}), 404


@api.route('/contexts')
def get_contexts():
    contexts = config.list_kube_config_contexts()[0]
    return jsonify({'contexts': list(map(lambda c: c['name'], contexts))})


@api.route('/context/<string:context>/pods')
def pods(context):
    ret = get_client(context).list_pod_for_all_namespaces()

    pods = []
    for p in ret.items:
        pods.append({
            'metadata': {
                'namespace': p.metadata.namespace,
                'name': p.metadata.name,
                'creation_timestamp': safe_to_iso_timestamp(p.metadata.creation_timestamp),
                'age': get_age(p.metadata.creation_timestamp),
                'deletion_timestamp': safe_to_iso_timestamp(p.metadata.deletion_timestamp)
            },
            'status': {
                'phase': p.status.phase,
                'container_statuses': list(map(lambda c: {
                    'name': c.name,
                    'ready': c.ready,
                    'restart_count': c.restart_count,
                    'state': c.state.to_dict(),
                    'last_state': c.last_state.to_dict()
                }, p.status.container_statuses or []))
            }
        })
    return jsonify(pods)


@api.route('/context/<string:context>/namespace/<string:namespace>/pod/<string:pod>/describe')
def describe(context, namespace, pod):
    api_client = get_client(context)
    pod_ret = api_client.read_namespaced_pod(pod, namespace)

    events_ret = api_client.list_namespaced_event(namespace)
    pod_events = filter(lambda e: (e.involved_object.kind == 'Pod' and e.involved_object.name == pod), events_ret.items)

    return jsonify({
            'metadata': {
                'namespace': pod_ret.metadata.namespace,
                'name': pod_ret.metadata.name,
                'creation_timestamp': safe_to_iso_timestamp(pod_ret.metadata.creation_timestamp),
                'age': get_age(pod_ret.metadata.creation_timestamp),
                'deletion_timestamp': safe_to_iso_timestamp(pod_ret.metadata.deletion_timestamp),
                'labels': pod_ret.metadata.labels,
                'owner_references': list(map(lambda r: {
                    'kind': r.kind,
                    'name': r.name
                }, pod_ret.metadata.owner_references)) if pod_ret.metadata.owner_references else None
            },
            'spec': {
                'node_name': pod_ret.spec.node_name,
                'containers': list(map(lambda c: {
                    'name': c.name,
                    'resources': c.resources.to_dict(),
                    'liveness_probe': safe_to_dict(c.liveness_probe),
                    'readiness_probe': safe_to_dict(c.readiness_probe),
                    'env': list(map(lambda e: e.to_dict(), c.env or [])),
                    'ports': list(map(lambda p: p.to_dict(), c.ports or [])),
                    'volume_mounts': list(map(lambda v: v.to_dict(), c.volume_mounts or []))
                }, pod_ret.spec.containers)),
                'volumes': list(map(lambda v: v.to_dict(), pod_ret.spec.volumes)),
                'node_selector': pod_ret.spec.node_selector,
                'tolerations': list(
                    map(lambda v: v.to_dict(), pod_ret.spec.tolerations)
                ) if pod_ret.spec.tolerations else None
            },
            'status': {
                'conditions': list(map(lambda c: {
                    'status': c.status,
                    'type': c.type,
                    'last_transition_time': safe_to_iso_timestamp(c.last_transition_time)
                }, pod_ret.status.conditions)),
                'phase': pod_ret.status.phase,
                'container_statuses': list(map(lambda c: {
                    'name': c.name,
                    'container_id': c.container_id,
                    'image': c.image,
                    'image_id': c.image_id,
                    'state': c.state.to_dict(),
                    'last_state': c.last_state.to_dict(),
                    'ready': c.ready,
                    'restart_count': c.restart_count
                }, pod_ret.status.container_statuses or [])),
                'host_ip': pod_ret.status.host_ip,
                'pod_ip': pod_ret.status.pod_ip,
                'qos_class': pod_ret.status.qos_class
            },
            'events': list(map(lambda e: {
                'type': e.type,
                'reason': e.reason,
                'metadata': {
                    'name': pod_ret.metadata.name,
                    'creation_timestamp': safe_to_iso_timestamp(e.metadata.creation_timestamp),
                    'age': get_age(e.metadata.creation_timestamp)
                },
                'message': e.message,
                'source': e.source.to_dict()
            }, pod_events))
        })


@api.route('/context/<string:context>/namespace/<string:namespace>/pod/<string:pod>/container/<string:container>/log')
def log(context, namespace, pod, container):
    previous = request.args.get('previous') == "true"
    ret = get_client(context).read_namespaced_pod_log(pod, namespace, container=container,
                                                      tail_lines=1000, previous=previous)

    return Response(ret, mimetype='text/plain')


@api.route('/context/<string:context>/namespace/<string:namespace>/pod/<string:pod>/container/<string:container>/ps')
def ps(context, namespace, pod, container):
    ret = stream(get_client(context).connect_get_namespaced_pod_exec, pod, namespace, container=container,
                 command=['ps', 'auxwwH'], stdout=True)

    return Response(ret, mimetype='text/plain')


@api.route('/context/<string:context>/namespace/<string:namespace>/pod/<string:pod>/container/<string:container>/env')
def env(context, namespace, pod, container):
    ret = stream(get_client(context).connect_get_namespaced_pod_exec, pod, namespace, container=container,
                 command=['printenv'], stdout=True)

    if 'executable file not found' in ret:
        abort(404)

    sorted_env = dict(e.split("=", 1) for e in sorted(filter(None, ret.strip().split('\n'))))

    return jsonify(sorted_env)


def get_client(context):
    try:
        config.load_kube_config(context=context)
        return client.CoreV1Api()
    except config.config_exception.ConfigException:
        abort(404)
