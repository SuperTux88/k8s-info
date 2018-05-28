# k8s-info
### A kubernetes deployments info dashboard

[![license](https://img.shields.io/github/license/SuperTux88/k8s-info.svg)](https://github.com/SuperTux88/k8s-info/blob/master/LICENSE)
[![Docker Build Status](https://img.shields.io/docker/build/supertux88/k8s-info.svg)](https://hub.docker.com/r/supertux88/k8s-info)
[![Maintainability](https://api.codeclimate.com/v1/badges/6e4c0924a999c3c85b04/maintainability)](https://codeclimate.com/github/SuperTux88/k8s-info/maintainability)

[![python Requirements Status](https://requires.io/github/SuperTux88/k8s-info/requirements.svg?branch=master)](https://requires.io/github/SuperTux88/k8s-info/requirements/?branch=master)
[![npm dependencies Status](https://david-dm.org/SuperTux88/k8s-info/status.svg)](https://david-dm.org/SuperTux88/k8s-info)
[![npm dev dependencies Status](https://david-dm.org/SuperTux88/k8s-info/dev-status.svg)](https://david-dm.org/SuperTux88/k8s-info?type=dev)

## Run

Using docker:

```bash
docker run --rm -v ~/.kube:/home/k8s-info/.kube -p 8000:8000 supertux88/k8s-info
```

The mounted volume must contain a `config` file and paths to certs and keys need to be relative.

## Development

You can run this project locally with a [minikube](https://kubernetes.io/docs/getting-started-guides/minikube/) cluster.

[Install minikube](https://github.com/kubernetes/minikube/releases) and start a cluster with:
```bash
minikube start
```

Create a python virtual environment and install the dependencies:
```bash
virtualenv --python=python3 .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Install nodejs dependencies:
```bash
npm install
```

Now you can build (and auto-update) the javascript bundles with:
```bash
npm run-script watch
```

and run the python dev-server in another terminal (with activated virtual env) with:
```bash
source .venv/bin/activate
FLASK_ENV=development python app/k8s-info.py
```
