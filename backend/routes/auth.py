# auth.py
from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if User.query.filter_by(email=data['email']).first():
        return jsonify(msg="Email already exists"), 409
    try:
        new_user = User(
            first_name=data['first_name'],
            last_name=data['last_name'],
            email=data['email'],
            password=generate_password_hash(data['password']),
            role='patient'
        )
        db.session.add(new_user)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify(msg="Registration error"), 500
    return jsonify(msg="User created"), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if not user or not check_password_hash(user.password, data['password']):
        return jsonify(msg="Invalid credentials"), 401
    access_token = create_access_token(identity=str(user.id), additional_claims={'role': user.role})
    return jsonify(access_token=access_token, role=user.role), 200

# @auth_bp.route('/profile', methods=['GET'])
# @jwt_required()
# def get_profile():
#     user_id = get_jwt_identity()
#     user = User.query.get(user_id)
#     if not user:
#         return jsonify(msg="User not found"), 404
#     return jsonify({
#         'first_name': user.first_name,
#         'last_name': user.last_name,
#         'email': user.email,
#         'role': user.role
#     }), 200