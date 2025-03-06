# doctors.py
from flask import Blueprint, jsonify, request
from models import db, User, Profile
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from werkzeug.security import generate_password_hash

doctors_bp = Blueprint('doctors', __name__)

def check_admin():
    claims = get_jwt()
    print(f"JWT Claims: {claims}")
    if claims.get('role') != 'admin':
        return jsonify(msg="Admin access required"), 403
    return None

@doctors_bp.route('/search', methods=['GET'])
def search_doctors():
    state = request.args.get('state', '')
    doctors = User.query\
        .join(Profile)\
        .filter(User.role == 'doctor')\
        .filter(Profile.state.ilike(f'%{state}%'))\
        .all()
    
    return jsonify([
        {
            'id': d.id,
            'name': f"{d.first_name} {d.last_name}",
            'email': d.email,  # Add email
            'qualification': d.profile.qualification if d.profile else "",
            'state': d.profile.state if d.profile else "",  # Add state
            'contact': d.profile.url_whatsapp if d.profile else ""
        } for d in doctors
    ])

# Keep other routes (add, edit, delete) as they are
@doctors_bp.route('/add', methods=['POST'])
@jwt_required()
def add_doctor():
    admin_check = check_admin()
    if admin_check:
        return admin_check
    
    data = request.get_json()
    print(f"Received data: {data}")
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify(msg="Email already exists"), 409
    
    try:
        new_doctor = User(
            first_name=data['first_name'],
            last_name=data['last_name'],
            email=data['email'],
            password=generate_password_hash(data['password']),
            role='doctor'
        )
        db.session.add(new_doctor)
        db.session.commit()
        print(f"Added doctor with ID: {new_doctor.id}")

        profile = Profile(
            user_id=new_doctor.id,
            about=data.get('about', ''),
            qualification=data.get('qualification', ''),
            url_picture_profile=data.get('url_picture_profile', ''),
            url_whatsapp=data.get('url_whatsapp', ''),
            url_facebook=data.get('url_facebook', ''),
            url_instagram=data.get('url_instagram', ''),
            url_website=data.get('url_website', ''),
            state=data.get('state', '')
        )
        db.session.add(profile)
        db.session.commit()
        print("Profile added")
        return jsonify(msg="Doctor added"), 201
    except Exception as e:
        db.session.rollback()
        print(f"Error adding doctor: {e}")
        return jsonify(msg=f"Error adding doctor: {str(e)}"), 500

@doctors_bp.route('/edit/<int:doctor_id>', methods=['PUT'])
@jwt_required()
def edit_doctor(doctor_id):
    admin_check = check_admin()
    if admin_check:
        return admin_check
    
    doctor = User.query.filter_by(id=doctor_id, role='doctor').first()
    if not doctor:
        return jsonify(msg="Doctor not found"), 404
    
    data = request.get_json()
    try:
        doctor.first_name = data.get('first_name', doctor.first_name)
        doctor.last_name = data.get('last_name', doctor.last_name)
        if 'password' in data:
            doctor.password = generate_password_hash(data['password'])
        
        profile = doctor.profile
        if not profile:
            profile = Profile(user_id=doctor.id)
            db.session.add(profile)
        
        profile.about = data.get('about', profile.about)
        profile.qualification = data.get('qualification', profile.qualification)
        profile.url_picture_profile = data.get('url_picture_profile', profile.url_picture_profile)
        profile.url_whatsapp = data.get('url_whatsapp', profile.url_whatsapp)
        profile.url_facebook = data.get('url_facebook', profile.url_facebook)
        profile.url_instagram = data.get('url_instagram', profile.url_instagram)
        profile.url_website = data.get('url_website', profile.url_website)
        profile.state = data.get('state', profile.state)
        
        db.session.commit()
        return jsonify(msg="Doctor updated"), 200
    except Exception as e:
        db.session.rollback()
        return jsonify(msg="Error updating doctor"), 500

@doctors_bp.route('/delete/<int:doctor_id>', methods=['DELETE'])
@jwt_required()
def delete_doctor(doctor_id):
    admin_check = check_admin()
    if admin_check:
        return admin_check
    
    doctor = User.query.filter_by(id=doctor_id, role='doctor').first()
    if not doctor:
        return jsonify(msg="Doctor not found"), 404
    
    try:
        db.session.delete(doctor)
        db.session.commit()
        return jsonify(msg="Doctor deleted"), 200
    except Exception as e:
        db.session.rollback()
        return jsonify(msg="Error deleting doctor"), 500