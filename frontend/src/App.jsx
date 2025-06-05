// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage2'
import SimulationView from './pages/SimulationView'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/simulation" element={<SimulationView />} />
      </Routes>
    </Router>
  )
}

export default App
