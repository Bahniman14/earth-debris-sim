import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TrackObjectPage.css';

const TrackObjectPage = () => {
  const [noradId, setNoradId] = useState('');
  const [objectData, setObjectData] = useState(null);
  const [positionData, setPositionData] = useState(null);
  const [error, setError] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [trackingInterval, setTrackingInterval] = useState(null);
  const host = 'https://earth-debris-sim.onrender.com'
  // Cleanup interval on component unmount
  useEffect(() => {
    return () => {
      if (trackingInterval) {
        clearInterval(trackingInterval);
      }
    };
  }, [trackingInterval]);

  const handleObjectInfo = async () => {
    if (!noradId.trim()) {
      setError('Please enter a NORAD Catalog ID');
      return;
    }

    try {
      setError('');
      const response = await axios.get(`${host}/object_data?norad_cat_id=${noradId}`);
      setObjectData(response.data);
      console.log('Object data fetched:', response.data); //debugging log
    } catch (err) {
      setError(
  err.response?.status === 404 
    ? 'Invalid NORAD Catalog ID'
    : `Invalid Input : ${err.response?.data?.message || err.message}`
    ); 
      setObjectData(null);
    }
  };

  const handleTrackPosition = async () => {
    if (!noradId.trim()) {
      setError('Please enter a NORAD Catalog ID');
      return;
    }

    // If already tracking, stop tracking
    if (isTracking) {
      if (trackingInterval) {
        clearInterval(trackingInterval);
        setTrackingInterval(null);
      }
      setIsTracking(false);
      return;
    }

    // Start tracking
    setIsTracking(true);
    setError('');

   
    // Initial position fetch
    try {
      const response = await axios.get(`${host}/object_realposition?norad_cat_id=${noradId}`);
      setPositionData(response.data);
    } catch (err) {
    setError(
  err.response?.status === 404
    ? 'Invalid NORAD Catalog ID'
    : `Error fetching position data: ${err.response?.data?.message || err.message}`
);
    //   setError(`Error fetching position data: ${err.response?.data?.message || err.message}`);
      setIsTracking(false);
      return;
    }

    // Set up polling interval
    const interval = setInterval(async () => {
      try {
        const response = await axios.get(`${host}/object_realposition?norad_cat_id=${noradId}`);
        setPositionData(response.data);
      } catch (err) {
        setError(`Error fetching position data: ${err.response?.data?.message || err.message}`);
        setIsTracking(false);
        clearInterval(interval);
        setTrackingInterval(null);
      }
    }, 1000);

    setTrackingInterval(interval);
  };

  const formatObjectData = (data) => {
    if (!data) return null;
    
   const fields = [
    { label: "Object Name", value: data.object_name },
    { label: "Country Code", value: data.country_code },
    { label: "Launch Date", value: data.launch_date },
    { label: "NORAD ID", value: data.norad_cat_id },
    { label: "Comment", value: data.comment },
    { label: "Creation Date", value: data.creation_date },
    { label: "Organization", value: data.organization },
    { label: "Site", value: data.site },
    { label: "Eccentricity", value: data.eccentricity },
    { label: "RCS Size", value: data.rcs_size },
    { label: "Object Type", value: data.object_type },
    { label: "Classification Type", value: data.classification_type },
  ];

  return (
    <div className="data-section">
      <h3 className="data-title">Object Information</h3>
      <div className="data-grid">
        {fields.map((field, index) => (
          <div className="data-item" key={index}>
            <span className="data-label">{field.label}:</span>
            <span className="data-value">{field.value ?? 'N/A'}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

 const formatPositionData = (data) => {
  if (!data) return null;

  return (
    <div className="data-section">
      <h3 className="data-title">
        Real-time Position {isTracking && <span className="tracking-indicator">● TRACKING</span>}
      </h3>
      <div className="data-grid">
        <div className="data-item">
          <span className="data-label">Latitude:</span>
          <span className="data-value">{data.latitude ? `${data.latitude.toFixed(6)}°` : 'N/A'}</span>
        </div>
        <div className="data-item">
          <span className="data-label">Longitude:</span>
          <span className="data-value">{data.longitude ? `${data.longitude.toFixed(6)}°` : 'N/A'}</span>
        </div>
        <div className="data-item">
          <span className="data-label">Altitude:</span>
          <span className="data-value">{data.altitude_km ? `${data.altitude_km.toFixed(2)} km` : 'N/A'}</span>
        </div>
      </div>

      <div className="data-grid eci-group">
        <div className="data-item">
          <span className="data-label">ECI X:</span>
          <span className="data-value">{data.eci_x ? `${data.eci_x.toFixed(2)} km` : 'N/A'}</span>
        </div>
        <div className="data-item">
          <span className="data-label">ECI Y:</span>
          <span className="data-value">{data.eci_y ? `${data.eci_y.toFixed(2)} km` : 'N/A'}</span>
        </div>
        <div className="data-item">
          <span className="data-label">ECI Z:</span>
          <span className="data-value">{data.eci_z ? `${data.eci_z.toFixed(2)} km` : 'N/A'}</span>
        </div>
      </div>
    </div>
  );
};


  return (
    <div className="track-object-page">
      <div className="page-container">
        <h1 className="page-title">Track Space Object</h1>
        
        <div className="input-section">
          <input
            type="text"
            className="norad-input"
            placeholder="Enter NORAD Catalog ID"
            value={noradId}
            onChange={(e) => setNoradId(e.target.value)}
          />
          
          <div className="button-group">
            <button 
              className="action-button"
              onClick={handleObjectInfo}
            >
              Object Info
            </button>
            <button 
              className={`action-button ${isTracking ? 'tracking' : ''}`}
              onClick={handleTrackPosition}
            >
              {isTracking ? 'Stop Tracking' : 'Track Position'}
            </button>
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="results-terminal">
          <div className="terminal-header">
            <div className="terminal-controls">
              <span className="control-dot red"></span>
              <span className="control-dot yellow"></span>
              <span className="control-dot green"></span>
            </div>
            <span className="terminal-title">ASTERIA TRACKING CONSOLE</span>
          </div>
          
          <div className="terminal-content">
            {!objectData && !positionData && !error && (
              <div className="terminal-prompt">
                &gt; Awaiting command... Enter NORAD ID and select operation
              </div>
            )}
            
            {formatObjectData(objectData)}
            {formatPositionData(positionData)}
          </div>
        </div>

        <div className="navigation">
          <a href="/" className="back-link">← Back</a>
        </div>
      </div>
    </div>
  );
};

export default TrackObjectPage;