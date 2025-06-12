// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage2'
import SimulationView from './pages/SimulationView'
import TrackObjectPage from './pages/TrackObjectPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/simulation" element={<SimulationView />} />
        <Route path="/track" element={<TrackObjectPage />} />
      </Routes>
    </Router>
  )
}

export default App
