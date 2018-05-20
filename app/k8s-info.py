from flask import Flask, render_template
from flask_cors import CORS

from api import api

app = Flask(__name__)

cors = CORS(app, resources={r"/api/*": {'origins': '*'}})
app.register_blueprint(api, url_prefix='/api')


@app.route('/', defaults={'_path': ''})
@app.route('/<path:_path>')
def index(_path):
    return render_template('index.html')


if __name__ == '__main__':
    app.run()
