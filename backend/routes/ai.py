from flask import Blueprint, jsonify, request, current_app, url_for
from PIL import Image
import numpy as np
import tensorflow as tf
from models import db, PatientDetails
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
import os
import time
import logging
import cv2

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

# Load YOLO model
net = cv2.dnn.readNet(os.path.join(BASE_DIR, "yolo/yolov3.weights"), os.path.join(BASE_DIR, "yolo/yolov3.cfg"))
layer_names = net.getLayerNames()
unconnected_out_layers = net.getUnconnectedOutLayers()
if isinstance(unconnected_out_layers, np.ndarray):
    unconnected_out_layers = unconnected_out_layers.flatten()
output_layers = [layer_names[i - 1] for i in unconnected_out_layers]
with open(os.path.join(BASE_DIR, "yolo/coco.names"), "r") as f:
    classes = [line.strip() for line in f.readlines()]

# Load Haar Cascades for face and eye detection
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')

def preprocess_image(image_path):
    """Preprocess the image by cropping to the face region if a face is detected."""
    image = cv2.imread(image_path)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5)

    if len(faces) > 0:
        # Crop to the first detected face
        x, y, w, h = faces[0]
        face_image = image[y:y+h, x:x+w]
        height, width, channels = face_image.shape
        blob = cv2.dnn.blobFromImage(face_image, 0.00392, (416, 416), (0, 0, 0), True, crop=False)
        return face_image, blob, height, width
    else:
        # Use the original image if no face is detected
        height, width, channels = image.shape
        blob = cv2.dnn.blobFromImage(image, 0.00392, (416, 416), (0, 0, 0), True, crop=False)
        return image, blob, height, width

def detect_objects(image_path):
    """Detect eyes using YOLO, with a fallback to Haar Cascade if YOLO fails."""
    image, blob, height, width = preprocess_image(image_path)
    net.setInput(blob)
    outs = net.forward(output_layers)

    class_ids = []
    confidences = []
    boxes = []

    # YOLO detection
    for out in outs:
        for detection in out:
            scores = detection[5:]
            class_id = np.argmax(scores)
            confidence = scores[class_id]
            if confidence > 0.5 and classes[class_id] == "eye":
                center_x = int(detection[0] * width)
                center_y = int(detection[1] * height)
                w = int(detection[2] * width)
                h = int(detection[3] * height)
                x = max(0, int(center_x - w / 2))
                y = max(0, int(center_y - h / 2))
                boxes.append([x, y, w, h])
                confidences.append(float(confidence))
                class_ids.append(class_id)

    indexes = cv2.dnn.NMSBoxes(boxes, confidences, 0.5, 0.4)
    if len(indexes) > 0:
        # Use the first detected eye from YOLO
        i = indexes[0]
        x, y, w, h = boxes[i]
        eye_image = image[y:y+h, x:x+w]
        return True, eye_image
    else:
        # Fallback to Haar Cascade eye detection
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        eyes = eye_cascade.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5)
        if len(eyes) > 0:
            # Use the first detected eye
            x, y, w, h = eyes[0]
            eye_image = image[y:y+h, x:x+w]
            return True, eye_image
        return False, None

@ai_bp.route('/predict', methods=['POST'])
@jwt_required()
def predict_image():
    """Handle image upload, detect eyes, and predict cataract status."""
    if 'image' not in request.files:
        return jsonify(error="No image provided"), 400

    image_file = request.files['image']
    original_filename = secure_filename(image_file.filename)
    ext = os.path.splitext(original_filename)[1]
    new_filename = f"image_{int(time.time())}{ext}"

    upload_folder = current_app.config.get('UPLOAD_FOLDER')
    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder, exist_ok=True)

    file_path = os.path.join(upload_folder, new_filename)
    image_file.save(file_path)

    # Detect eyes and get cropped eye image
    detected, eye_image = detect_objects(file_path)
    if not detected:
        return jsonify(error="Image needs to contain eyes"), 400

    file_url = url_for('uploaded_file', filename=new_filename, _external=True)

    try:
        # Convert OpenCV image (BGR) to PIL image (RGB) for CNN
        eye_image_pil = Image.fromarray(cv2.cvtColor(eye_image, cv2.COLOR_BGR2RGB))
        # Resize to 224x224 and normalize
        processed = np.array(eye_image_pil.resize((224, 224))) / 255.0
        processed = np.expand_dims(processed, axis=0)
        prediction = model.predict(processed)[0][0]
        prediction = float(prediction)
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
    """Retrieve prediction history for the authenticated user."""
    user_id = get_jwt_identity()
    details = PatientDetails.query.filter_by(user_id=user_id).all()
    return jsonify([{
        'id': detail.id,
        'status': detail.status,
        'percentage': detail.percentage,
        'image_url': detail.image_url,
        'created_at': detail.created_at.isoformat() if hasattr(detail, 'created_at') else None
    } for detail in details]), 200