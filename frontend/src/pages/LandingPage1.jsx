// src/pages/LandingPage.jsx
import './LandingPage1.css'
import { Link } from 'react-router-dom'

function LandingPage() {
  return (
    <div className="landing-container">
      <div className="stars" />
      <div className="stars2" />
      <div className="stars3" />
      <div className="content">
        <h1>🌍 Earth Debris Simulation</h1>
        <p>Explore satellite debris orbiting Earth in real time and 3D.</p>
        <Link to="/simulation">
          <button className="enter-btn">Enter Simulation 🚀</button>
        </Link>
      </div>
    </div>
  )
}
export default LandingPage
