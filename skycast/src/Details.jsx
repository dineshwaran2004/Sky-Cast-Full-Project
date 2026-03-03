import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./WeatherPage.css";
// import sunlogo from "./assets/sunlogo.png"


function WeatherPage() {
  const { city } = useParams();
  const navigate = useNavigate();

  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [time, setTime] = useState("morning");


  useEffect(() => {
    const fetchWeather = async () => {
      try {
        if (!city) return;

        setLoading(true);
        setError("");

       const response = await fetch(
  `http://127.0.0.1:8000/weather/?city=${city}`
);

        const data = await response.json();

        if (response.ok) {
          setWeather(data);
        } else {
          setError(data.message || "City not found!");
          setWeather(null);
        }

        setLoading(false);
      } catch (err) {
        setError("Something went wrong!");
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

  if (loading) return <h2 className="center">Loading...</h2>;
  if (error) return <h2 className="center">{error}</h2>;
  if (!weather) return null;

  let adjustedTemp = weather.main.temp;

  if (time === "afternoon") adjustedTemp += 2;
  if (time === "evening") adjustedTemp -= 2;
  if (time === "night") adjustedTemp -= 4;

  return (
    <div className="weather-container">
      <button className="back-btn" onClick={() => navigate("/")}>
         Back
      </button>

      <h1 className="city-title">
        {city.toUpperCase()} Weather
      </h1>

      <div className="time-select">
        <label>Select Time: </label>
        <select value={time} onChange={(e) => setTime(e.target.value)}>
          <option value="morning">Morning </option>
          <option value="afternoon">Afternoon </option>
          <option value="evening">Evening </option>
          <option value="night">Night </option>
        </select>
      </div>

      <div className="main-card">
        <img
          
  
        />
        <h2>{adjustedTemp.toFixed(1)}°C</h2>
        <p style={{ textTransform: "capitalize" }}>
          {weather.weather[0].description}
        </p>
      </div>

      <div className="info-cards">
        <div className="info-card">
          <h3> Humidity</h3>
          <p>{weather.main.humidity}%</p>
        </div>

        <div className="info-card">
          <h3> Wind</h3>
          <p>{weather.wind.speed} m/s</p>
        </div>

        <div className="info-card">
          <h3> Clouds</h3>
          <p>{weather.clouds.all}%</p>
        </div>
      </div>
    </div>
  );
}

export default WeatherPage;