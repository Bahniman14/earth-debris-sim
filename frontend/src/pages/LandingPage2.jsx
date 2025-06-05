import React from 'react';
import './LandingPage2.css';
import { Link } from 'react-router-dom'

const LandingPage = () => {
  return (
    <div className="landing-container">
      {/* Animated Starfield Background */}
      <div className="starfield">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
      </div>
      
      {/* Floating Debris Elements */}
      <div className="debris debris-1"></div>
      <div className="debris debris-2"></div>
      <div className="debris debris-3"></div>
      
      {/* Main Content */}
      <div className="content">
        <div className="title-container">
          <h1 className="main-title">
            EARTH DEBRIS
            <span className="subtitle-inline">SIMULATION</span>
          </h1>
          <div className="title-glow"></div>
        </div>
        
        <p className="subtitle">
          Explore the invisible threat orbiting our planet
        </p> 
        <Link to="/simulation">
        <button className="enter-button">
          <span className="button-text">ENTER SIMULATION</span>
          <div className="button-glow"></div>
        </button>
        </Link>
        <div className="stats-container">
          <div className="stat">
            <span className="stat-number">14,000+</span>
            <span className="stat-label">Tracked Objects</span>
          </div>
          <div className="stat">
            <span className="stat-number">1200+</span>
            <span className="stat-label">Active Satellites</span>
          </div>
          <div className="stat">
            <span className="stat-number">28,000</span>
            <span className="stat-label">KM/H Velocity</span>
          </div>
        </div>
      </div>
      
      {/* Scanning Line Effect */}
      <div className="scan-line"></div>
    </div>
  );
};

export default LandingPage;