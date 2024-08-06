from flask import Flask, request, jsonify
from flask_cors import CORS
import util

app = Flask(__name__)
CORS(app)  # This enables CORS for all routes

@app.route('/')
def home():
    return "Welcome to the Bengaluru House Price Prediction API"

@app.route('/get_location_names', methods=['GET'])
def get_location_names():
    locations = util.get_location_names()
    return jsonify({
        'locations': locations
    })

@app.route('/predict_home_price', methods=['POST'])
def predict_home_price():
    data = request.json
    total_sqft = float(data['total_sqft'])
    location = data['location']
    bhk = int(data['bhk'])
    bath = int(data['bath'])

    estimated_price = util.get_estimated_price(location, total_sqft, bhk, bath)
    return jsonify({
        'estimated_price': estimated_price
    })

if __name__ == "__main__":
    print("Starting Python Flask Server For Home Price Prediction...")
    util.load_saved_artifacts()
    app.run(debug=True)