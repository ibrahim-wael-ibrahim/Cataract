# doctors.py
from flask import Blueprint, jsonify, request
from models import db, User, Profile
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from werkzeug.security import generate_password_hash

doctors_bp = Blueprint('doctors', __name__)

def check_admin():
    claims = get_jwt()
    if claims.get('role') != 'admin':
        return jsonify(msg="Admin access required"), 403
    return None

def doctor_to_json(doctor):
    profile = doctor.profile  # Using relationship directly
    return {
        'id': doctor.id,
        'first_name': doctor.first_name,
        'last_name': doctor.last_name,
        'email': doctor.email,
        'profile': {
            'about': profile.about if profile else '',
            'qualification': profile.qualification if profile else '',
            'state': profile.state if profile else '',
            'url_picture_profile': profile.url_picture_profile if profile else '',
            'url_whatsapp': profile.url_whatsapp if profile else '',
            'url_facebook': profile.url_facebook if profile else '',
            'url_instagram': profile.url_instagram if profile else '',
            'url_website': profile.url_website if profile else ''
        }
    }

@doctors_bp.route('/doctors', methods=['GET', 'OPTIONS'])
def get_all_doctors():
    state = request.args.get('state', '').strip()

    query = User.query.filter_by(role='doctor')

    if state:
        # Join with Profile and filter by state
        query = query.join(Profile).filter(Profile.state.ilike(f'%{state}%'))

    doctors = query.options(db.joinedload(User.profile)).all()

    return jsonify([doctor_to_json(d) for d in doctors])

@doctors_bp.route('/doctors/<int:doctor_id>', methods=['GET'])
def get_single_doctor(doctor_id):
    doctor = User.query.options(db.joinedload(User.profile))\
        .filter_by(id=doctor_id, role='doctor').first()

    if not doctor:
        return jsonify(msg="Doctor not found"), 404

    return jsonify(doctor_to_json(doctor))

@doctors_bp.route('/doctors', methods=['POST'])
@jwt_required()
def create_doctor():
    if (admin_check := check_admin()):
        return admin_check

    data = request.get_json()

    if User.query.filter_by(email=data.get('email')).first():
        return jsonify(msg="Email already exists"), 409

    try:
        # Create user
        new_doctor = User(
            first_name=data['first_name'],
            last_name=data['last_name'],
            email=data['email'],
            password=generate_password_hash(data.get('password', 'defaultpassword')),
            role='doctor'
        )
        db.session.add(new_doctor)
        db.session.flush()  # Get the ID before commit
        profile_data = data.get('profile', {})
        # Create profile with all fields
        profile = Profile(
            user_id=new_doctor.id,
            about=profile_data.get('about', ''),
            qualification=profile_data.get('qualification', ''),
            state=profile_data.get('state', ''),
            url_picture_profile=profile_data.get('url_picture_profile', ''),
            url_whatsapp=profile_data.get('url_whatsapp', ''),
            url_facebook=profile_data.get('url_facebook', ''),
            url_instagram=profile_data.get('url_instagram', ''),
            url_website=profile_data.get('url_website', '')
        )
        db.session.add(profile)
        db.session.commit()

        return jsonify(doctor_to_json(new_doctor)), 201

    except Exception as e:
        db.session.rollback()
        return jsonify(msg=f"Error creating doctor: {str(e)}"), 500

@doctors_bp.route('/doctors/<int:doctor_id>', methods=['PUT'])
@jwt_required()
def update_doctor(doctor_id):
    if (admin_check := check_admin()):
        return admin_check

    doctor = User.query.options(db.joinedload(User.profile))\
        .filter_by(id=doctor_id, role='doctor').first()

    if not doctor:
        return jsonify(msg="Doctor not found"), 404

    data = request.get_json()

    try:
        # Update user fields
        if 'first_name' in data:
            doctor.first_name = data['first_name']
        if 'last_name' in data:
            doctor.last_name = data['last_name']
        if 'email' in data:
            doctor.email = data['email']
        if 'password' in data:
            doctor.password = generate_password_hash(data['password'])
        profile_data = data.get('profile', {})

        # Update or create profile
        profile = doctor.profile or Profile(user_id=doctor.id)
        fields = ['about', 'qualification', 'state',
                  'url_picture_profile', 'url_whatsapp',
                  'url_facebook', 'url_instagram', 'url_website']

        for field in fields:
            if field in profile_data:
                setattr(profile, field, profile_data[field])

        if not doctor.profile:
            db.session.add(profile)

        db.session.commit()
        return jsonify(doctor_to_json(doctor)), 200

    except Exception as e:
        db.session.rollback()
        return jsonify(msg=f"Error updating doctor: {str(e)}"), 500


@doctors_bp.route('/doctors/<int:doctor_id>', methods=['DELETE'])
@jwt_required()
def delete_doctor(doctor_id):
    admin_check = check_admin()
    if admin_check:
        return admin_check

    # Fetch the doctor with its profile
    doctor = User.query.filter_by(id=doctor_id, role='doctor').first()
    if not doctor:
        return jsonify(msg="Doctor not found"), 404

    try:
        # Delete the associated profile first, if it exists
        if doctor.profile:
            db.session.delete(doctor.profile)

        # Then delete the doctor
        db.session.delete(doctor)
        db.session.commit()
        return jsonify(msg="Doctor deleted successfully"), 200
    except Exception as e:
        db.session.rollback()
        return jsonify(msg=f"Error deleting doctor: {str(e)}"), 500