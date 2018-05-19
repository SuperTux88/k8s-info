from flask import Blueprint, jsonify, abort, Response
import json
from kubernetes import client, config
from kubernetes.stream import stream
from utils import get_age

api = Blueprint('api', __name__)


@api.errorhandler(client.rest.ApiException)
def handle_api_exception(e):
    if e.body:
        error = json.loads(e.body)
        return jsonify(error), error["code"]

    return Response(str(e), mimetype='text/plain'), 400


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
                'creation_timestamp': p.metadata.creation_timestamp.isoformat(),
                'age': get_age(p.metadata.creation_timestamp)
            },
            'status': {
                'phase': p.status.phase,
                'container_statuses': list(map(lambda c: {
                    'name': c.name,
                    'ready': c.ready,
                    'restart_count': c.restart_count
                }, p.status.container_statuses))
            }
        })
    return jsonify(pods)


@api.route('/context/<string:context>/namespace/<string:namespace>/pod/<string:pod>/describe')
def describe(context, namespace, pod):
    ret = get_client(context).read_namespaced_pod(pod, namespace)

    # TODO: more info for describe
    return jsonify({
            'metadata': {
                'namespace': ret.metadata.namespace,
                'name': ret.metadata.name,
                'creation_timestamp': ret.metadata.creation_timestamp.isoformat(),
                'age': get_age(ret.metadata.creation_timestamp)
            },
            'status': {
                'phase': ret.status.phase,
                'container_statuses': list(map(lambda c: {
                    'name': c.name,
                    'ready': c.ready,
                    'restart_count': c.restart_count
                }, ret.status.container_statuses))
            }
        })


@api.route('/context/<string:context>/namespace/<string:namespace>/pod/<string:pod>/container/<string:container>/log')
def log(context, namespace, pod, container):
    ret = get_client(context).read_namespaced_pod_log(pod, namespace, container=container, tail_lines=1000)

    return Response(ret, mimetype='text/plain')


@api.route('/context/<string:context>/namespace/<string:namespace>/pod/<string:pod>/container/<string:container>/ps')
def ps(context, namespace, pod, container):
    ret = stream(get_client(context).connect_get_namespaced_pod_exec, pod, namespace, container=container,
                 command=['ps', 'axuwwwH', '-L'], stdout=True)

    return Response(ret, mimetype='text/plain')


@api.route('/context/<string:context>/namespace/<string:namespace>/pod/<string:pod>/container/<string:container>/env')
def env(context, namespace, pod, container):
    ret = stream(get_client(context).connect_get_namespaced_pod_exec, pod, namespace, container=container,
                 command=['/bin/sh', '-c', 'cat /proc/1/environ | xargs --null --max-args=1'], stdout=True)

    return Response(ret, mimetype='text/plain')


def get_client(context):
    try:
        config.load_kube_config(context=context)
        return client.CoreV1Api()
    except config.config_exception.ConfigException:
        abort(404)

