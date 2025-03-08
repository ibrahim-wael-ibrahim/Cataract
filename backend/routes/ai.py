# routes/ai.py
from flask import Blueprint, jsonify, request, current_app, url_for
from PIL import Image
import numpy as np
import tensorflow as tf
from models import db, PatientDetails, User
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
import os
import time
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

ai_bp = Blueprint('ai', __name__)

# Load model only once at startup
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
model_path = os.path.join(BASE_DIR, 'model.h5')
try:
    model = tf.keras.models.load_model(model_path)
    logger.info("Model loaded successfully")
except Exception as e:
    logger.error(f"Failed to load model: {str(e)}")
    raise

@ai_bp.route('/predict', methods=['POST'])
@jwt_required()
def predict_image():
    if 'image' not in request.files:
        logger.warning("No image provided in request")
        return jsonify(error="No image provided"), 400

    image_file = request.files['image']
    original_filename = secure_filename(image_file.filename)
    ext = os.path.splitext(original_filename)[1]
    new_filename = f"image_{int(time.time())}{ext}"

    # Ensure upload folder exists
    upload_folder = current_app.config.get('UPLOAD_FOLDER')
    try:
        if not os.path.exists(upload_folder):
            os.makedirs(upload_folder, exist_ok=True)
            logger.info(f"Created upload folder: {upload_folder}")
    except Exception as e:
        logger.error(f"Failed to create upload folder: {str(e)}")
        return jsonify(error=f"Failed to create upload folder: {str(e)}"), 500

    file_path = os.path.join(upload_folder, new_filename)
    try:
        image_file.save(file_path)
        logger.info(f"Image saved to {file_path}")
    except Exception as e:
        logger.error(f"Failed to save image: {str(e)}")
        return jsonify(error=f"Failed to save image: {str(e)}"), 500

    file_url = url_for('uploaded_file', filename=new_filename, _external=True)

    try:
        image = Image.open(file_path)
        processed = np.array(image.resize((224, 224))) / 255.0
        processed = np.expand_dims(processed, axis=0)
        prediction = model.predict(processed)[0][0]
        prediction = float(prediction)  # Explicitly convert float32 to Python float
        status = "Normal" if prediction >= 0.5 else "Cataract"
        percentage = round(prediction * 100, 2)
        logger.info(f"Prediction: {prediction}, Status: {status}, Percentage: {percentage}")
    except Exception as e:
        logger.error(f"Image processing or prediction failed: {str(e)}")
        return jsonify(error=f"Prediction failed: {str(e)}"), 500

    user_id = get_jwt_identity()

    try:
        new_detail = PatientDetails(
            user_id=user_id,
            image_url=file_url,
            percentage=percentage,
            status=status
        )
        db.session.add(new_detail)
        db.session.commit()
        logger.info(f"Prediction saved for user {user_id}")
    except Exception as e:
        db.session.rollback()
        logger.error(f"Database error: {str(e)}")
        return jsonify(error=f"Database error: {str(e)}"), 500

    return jsonify({
        'status': status,
        'percentage': percentage,
        'image_url': file_url
    })

@ai_bp.route('/history', methods=['GET'])
@jwt_required()
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