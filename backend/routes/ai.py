from flask import Blueprint, jsonify, request, current_app, url_for
from PIL import Image
import numpy as np
import tensorflow as tf
from models import db, PatientDetails, User
from flask_jwt_extended import jwt_required, get_jwt_identity  # Add these imports
from werkzeug.utils import secure_filename
import os
import time

ai_bp = Blueprint('ai', __name__)

# Load model only once at startup
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
model_path = os.path.join(BASE_DIR, 'model.h5')
model = tf.keras.models.load_model(model_path)

@ai_bp.route('/predict', methods=['POST'])
@jwt_required()  # This should now work
def predict_image():
    if 'image' not in request.files:
        return jsonify(error="No image provided"), 400
    
    image_file = request.files['image']
    
    # Generate a new filename using a timestamp
    original_filename = secure_filename(image_file.filename)
    ext = os.path.splitext(original_filename)[1]
    new_filename = f"image_{int(time.time())}{ext}"
    
    # Save the uploaded file
    upload_folder = current_app.config.get('UPLOAD_FOLDER')
    file_path = os.path.join(upload_folder, new_filename)
    image_file.save(file_path)
    
    file_url = url_for('uploaded_file', filename=new_filename, _external=True)
    
    # Process the image for prediction
    image = Image.open(file_path)
    processed = np.array(image.resize((224, 224))) / 255.0
    processed = np.expand_dims(processed, axis=0)
    
    prediction = model.predict(processed)[0][0]
    status = "Normal" if prediction >= 0.5 else "Cataract"
    
    user_id = get_jwt_identity()
    
    new_detail = PatientDetails(
        user_id=user_id,
        image_url=file_url,
        percentage=round(prediction * 100, 2),
        status=status
    )
    db.session.add(new_detail)
    db.session.commit()
    
    return jsonify({
        'status': status,
        'percentage': round(prediction * 100, 2),
        'image_url': file_url
    })

@ai_bp.route('/history', methods=['GET'])
@jwt_required()  # This should now work
def get_history():
    user_id = get_jwt_identity()
    details = PatientDetails.query.filter_by(user_id=user_id).all()
    return jsonify([{
        'id': detail.id,
        'status': detail.status,
        'percentage': detail.percentage,
        'image_url': detail.image_url,
        'created_at': detail.created_at.isoformat() if hasattr(detail, 'created_at') else None
    } for detail in details]), 200