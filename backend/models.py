# models.py
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='patient')
    profile = db.relationship('Profile', backref='user', uselist=False)
    patient_details = db.relationship('PatientDetails', backref='user', lazy='dynamic')

class Profile(db.Model):
    __tablename__ = 'profile'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    about = db.Column(db.Text)
    qualification = db.Column(db.String(255))
    url_picture_profile = db.Column(db.String(255))
    url_whatsapp = db.Column(db.String(255))
    url_facebook = db.Column(db.String(255))
    url_instagram = db.Column(db.String(255))
    url_website = db.Column(db.String(255))
    state = db.Column(db.String(50))

class PatientDetails(db.Model):
    __tablename__ = 'patient_details'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    image_url = db.Column(db.String(255), nullable=False)
    percentage = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())