from flask import Blueprint

api = Blueprint('api', __name__)


@api.route('/hello_world')
def hello_world():
    return 'Hello World!'
