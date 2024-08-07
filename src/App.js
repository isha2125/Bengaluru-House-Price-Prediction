import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
function App() {
  const [locations, setLocations] = useState([]);
  const [formData, setFormData] = useState({
    total_sqft: '',
    bath: '',
    bhk: '',
    location: '',
  });
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [showPrediction, setShowPrediction] = useState(false);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/get_location_names`);
      setLocations(response.data.locations);
    } catch (error) {
      console.error('Error fetching locations:', error);
      setError('Failed to fetch locations. Please try again later.');
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await axios.post(`${BACKEND_URL}/predict_home_price`, formData);
      setPrediction(response.data.estimated_price);
      setShowPrediction(true);
    } catch (error) {
      console.error('Error making prediction:', error);
      setError('Failed to make prediction. Please try again.');
    }
  };

  const handleReset = () => {
    setFormData({
      total_sqft: '',
      bath: '',
      bhk: '',
      location: '',
    });
    setPrediction(null);
    setShowPrediction(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>House Price Prediction</h1>
      </header>
      <div className="content">
        <div className="carousel-container">
          <Carousel>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="https://www.surfacesreporter.com/myuploads/15ambara-house-bangalore-surfaces-reporter.jpg"
                alt="House in Bangalore"
              />
              <Carousel.Caption>
                <h3>Beautiful House</h3>
                <p>Located in Bangalore</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="https://ashwinarchitects.com/3/wp-content/uploads/2020/09/pawans-30-50-house-design-residential-architects-in-bangalore-evening-front-elevation-1.png"
                alt="House in Bangalore"
              />
              <Carousel.Caption>
                <h3>Modern House</h3>
                <p>Located in Bangalore</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="https://www.ashwinarchitects.com/3/wp-content/uploads/2022/11/bangalore-architects-near-me-100x80-plot-duplex-house-design-front-view-eve.jpg.webp"
                alt="House in Bangalore"
              />
              <Carousel.Caption>
                <h3>Luxury House</h3>
                <p>Located in Bangalore</p>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </div>
        <div className="form-container">
          {!showPrediction ? (
            <form onSubmit={handleSubmit} className="form">
              {error && <p className="error">{error}</p>}
              <label>Total Square Feet</label>
              <input
                type="number"
                name="total_sqft"
                value={formData.total_sqft}
                onChange={handleInputChange}
                placeholder="Total Square Feet"
                required
              />
              <label>Number of Bathrooms</label>
              <input
                type="number"
                name="bath"
                value={formData.bath}
                onChange={handleInputChange}
                placeholder="Number of Bathrooms"
                required
              />
              <label>Number of BHK</label>
              <input
                type="number"
                name="bhk"
                value={formData.bhk}
                onChange={handleInputChange}
                placeholder="Number of BHK"
                required
              />
              <label>Location</label>
              <select
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Location</option>
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
              <button type="submit">Predict Price</button>
            </form>
          ) : (
            <div className="prediction-details">
              <p>
                For buying a house in <strong>{formData.location}</strong> of <strong>{formData.total_sqft} square feet</strong> with <strong>{formData.bhk} BHK</strong> and <strong>{formData.bath} bathrooms</strong>, the predicted price is:
              </p>
              <h2>₹{prediction ? prediction.toLocaleString() : ''} lakhs</h2>
              <button onClick={handleReset} className="reset-button">Thanks</button>
            </div>
          )}
        </div>
      </div>
      <footer className="App-footer">
        <p>Made by Aditya</p>
      </footer>
    </div>
  );
}

export default App;
