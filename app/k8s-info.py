from flask import Flask, render_template
from flask_cors import CORS
from flask_webpackext import FlaskWebpackExt, WebpackTemplateProject

from api import api

project = WebpackTemplateProject(
    __name__,
    project_folder='..',
)

app = Flask(__name__)
app.config.update(dict(
    WEBPACKEXT_PROJECT=project,
    WEBPACKEXT_MANIFEST_PATH='../manifest.json',
))

cors = CORS(app, resources={r"/api/*": {'origins': '*'}})
app.register_blueprint(api, url_prefix='/api')

FlaskWebpackExt(app)


@app.route('/', defaults={'_path': ''})
@app.route('/<path:_path>')
def index(_path):
    return render_template('index.html')


if __name__ == '__main__':
    app.run()
