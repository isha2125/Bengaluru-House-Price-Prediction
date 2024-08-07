from flask import Flask, request, jsonify
from flask_cors import CORS
import util
import logging

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "https://bengaluru-house-price-prediction-frontend.onrender.com"}})

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load artifacts when the module is imported
util.load_saved_artifacts()

@app.route('/')
def home():
    return "Welcome to the Bengaluru House Price Prediction API"

@app.route('/get_location_names', methods=['GET'])
def get_location_names():
    try:
        locations = util.get_location_names()
        if locations is None:
            raise ValueError("Locations data is not loaded")
        logger.info(f"Returning {len(locations)} locations")
        return jsonify({
            'locations': locations
        })
    except Exception as e:
        logger.error(f"Error in get_location_names: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/predict_home_price', methods=['POST'])
def predict_home_price():
    try:
        data = request.json
        total_sqft = float(data['total_sqft'])
        location = data['location']
        bhk = int(data['bhk'])
        bath = int(data['bath'])

        estimated_price = util.get_estimated_price(location, total_sqft, bhk, bath)
        return jsonify({
            'estimated_price': estimated_price
        })
    except Exception as e:
        logger.error(f"Error in predict_home_price: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == "__main__":
    logger.info("Starting Python Flask Server For Home Price Prediction...")
    app.run(debug=True)
