# app.py
from flask import Flask, send_from_directory
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from models import db, User
from routes.auth import auth_bp
from routes.ai import ai_bp
from routes.doctors import doctors_bp
from flask_cors import CORS
import os
from werkzeug.security import generate_password_hash
from sqlalchemy import inspect

app = Flask(__name__)
CORS(app)
app.config.from_object('config.Config')

# Initialize extensions
db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(ai_bp, url_prefix='/api/ai')
app.register_blueprint(doctors_bp, url_prefix='/api/doctors')

# Set up uploads folder
UPLOAD_FOLDER = os.path.join(app.root_path, 'upload')
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Initialize admin user on app startup
def init_admin():
    with app.app_context():
        admin_email = 'admin@eye.com'
        if not User.query.filter_by(email=admin_email).first():
            admin = User(
                first_name='Admin',
                last_name='User',
                email=admin_email,
                password=generate_password_hash('admin'),
                role='admin'
            )
            db.session.add(admin)
            db.session.commit()
            print("Admin user created.")

def init_admin_safe():
    with app.app_context():
        inspector = inspect(db.engine)
        if inspector.has_table("user"):
            init_admin()
        else:
            print("User table not found; skipping admin initialization.")


# Run init_admin when the app starts
init_admin_safe()

if __name__ == '__main__':
    app.run(debug=True)
