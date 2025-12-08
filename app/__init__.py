from flask import Flask
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///comments.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)

    from .routes.comments import comments_bp
    app.register_blueprint(comments_bp, url_prefix='/api')

    @app.route('/')
    def index():
        return "Comments API is running. Use /api/tasks"

    return app
