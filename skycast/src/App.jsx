import { Routes, Route, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import Details from "./Details";
import "./App.css";



function Home() {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    state: "",
    city: "",
    description: ""
  });

  // Keep your localStorage logic
  const getRequests = () => {
    const saved = localStorage.getItem('cityRequests');
    return saved ? JSON.parse(saved) : [];
  };

  const handleChange = (e) => {
    const value = e.target.value;
    if (value) {
      navigate(`/details/${value}`);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // 🔥 FIXED HANDLE SUBMIT (localStorage + backend)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Your original localStorage logic (UNCHANGED)
    const newRequest = {
      id: Date.now(),
      state: formData.state,
      city: formData.city,
      description: formData.description,
      date: new Date().toLocaleString(),
      timestamp: new Date().getTime(),
      status: 'Pending'
    };
    
    const existingRequests = getRequests();
    const updatedRequests = [newRequest, ...existingRequests];
    localStorage.setItem('cityRequests', JSON.stringify(updatedRequests));

    // 🔥 Backend Save Added
    try {
      await fetch("http://127.0.0.1:8000/save-city/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          state: formData.state,
          city: formData.city,
          description: formData.description,
        }),
      });
    } catch (error) {
      console.error("Backend save failed:", error);
    }

    setShowSuccess(true);
    
    setFormData({
      state: "",
      city: "",
      description: ""
    });
    
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  const todayRequests = getRequests().filter(r => 
    new Date(r.date).toDateString() === new Date().toDateString()
  ).length;

  const totalRequests = getRequests().length;
  const uniqueStates = [...new Set(getRequests().map(r => r.state))].length;

  return (
    
    <div className="main-wrapper">
      <div className="sun"></div>
      <div className="cloud cloudleft"></div>
      <div className="cloud cloudright"></div>

      <nav className="navbar">
        <h1 id="site-title">Sky Cast</h1>
        <div className="nav-links">
          <button onClick={() => navigate('/')} className="nav-btn">Home</button>
          
        </div>
      </nav>

      <div className="content">
        <h2 className="title">
          Weather <br /> Forecast
        </h2>

        <p className="purpose-of-project">
          This weather forecast website helps you check real-time weather
          conditions and forecasts for places across India.
        </p>

        <div className="location-section">
          <label className="place_selection">Select Your Location</label>
          <select onChange={handleChange}>
            <option value="">-- Select --</option>
            <option value="Chennai">Chennai</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Delhi">Delhi</option>
            <option value="Kolkata">Kolkata</option>
            <option value="Bangalore">Bangalore</option>
          </select>
        </div>
      </div>

    
      <div className="request-form-container">
        <h3>Request Your City</h3>
        
        {showSuccess && (
          <div className="form-success-message">
            Thank you! Your city request has been submitted successfully.
          </div>
        )}

        <form onSubmit={handleSubmit} className="city-request-form">
          <div className="form-group">
            <label>Select State</label>
            <select 
              id="state"
              value={formData.state}
              onChange={handleInputChange}
              required
            >
              <option value="">-- Select State --</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Delhi">Delhi</option>
              <option value="West Bengal">West Bengal</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Kerala">Kerala</option>
            </select>
          </div>

          <div className="form-group">
            <label>City Name</label>
            <input 
              type="text" 
              id="city"
              value={formData.city}
              onChange={handleInputChange}
              required 
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea 
              id="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>

          <button type="submit" className="submit-btn">
            Submit Request
          </button>
        </form>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <p>Dineshwaran</p>
          <p>Weather forecasts for cities across India</p>
       
        </div>
      </footer>
    </div>
    
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/details/:city" element={<Details />} />
  
    </Routes>
    
  );
}

export default App;