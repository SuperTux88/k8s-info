from flask import Flask, render_template
from flask_cors import CORS
from flask_webpack import Webpack

from api import api

app = Flask(__name__)
app.config["WEBPACK_ASSETS_URL"] = "/static/js/"
app.config["WEBPACK_MANIFEST_PATH"] = "./manifest.json"

cors = CORS(app, resources={r"/api/*": {'origins': '*'}})
app.register_blueprint(api, url_prefix='/api')

webpack = Webpack()
webpack.init_app(app)

@app.route('/', defaults={'_path': ''})
@app.route('/<path:_path>')
def index(_path):
    return render_template('index.html')


if __name__ == '__main__':
    app.run()
