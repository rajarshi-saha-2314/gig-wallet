import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient.js";
import "./ForecastCard.css";

function formatCurrency(value) {
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

function ForecastCard() {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axiosClient
      .get("/forecast")
      .then(({ data }) => setForecast(data))
      .catch((err) => setError(err.response?.data?.error || "Failed to load forecast"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="forecast-card">Loading forecast...</div>;
  }

  if (error) {
    return (
      <div className="forecast-card">
        <p role="alert">{error}</p>
      </div>
    );
  }

  if (!forecast?.hasData) {
    return (
      <div className="forecast-card">
        <p className="forecast-card-label">Safe to spend this month</p>
        <p className="forecast-card-note">Upload at least one month of income transactions to see a forecast.</p>
      </div>
    );
  }

  const { predictedSafeSpend, incomeConfidenceInterval } = forecast.forecast;

  return (
    <div className="forecast-card">
      <p className="forecast-card-label">Safe to spend this month</p>
      <p className="forecast-card-value">{formatCurrency(predictedSafeSpend)}</p>
      <p className="forecast-card-range">
        Expected income range: {formatCurrency(incomeConfidenceInterval.low)} –{" "}
        {formatCurrency(incomeConfidenceInterval.high)}
      </p>
      {forecast.monthsOfData < 2 && (
        <p className="forecast-card-note">
          Based on {forecast.monthsOfData} month of data — the forecast will get more accurate as you add more
          history.
        </p>
      )}
    </div>
  );
}

export default ForecastCard;
