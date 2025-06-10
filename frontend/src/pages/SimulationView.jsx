// src/pages/SimulationView.jsx
import { useState, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import Earth from '../components/Earth'
import SpaceObjects from '../components/SpaceObjects'
import TimeTicker from '../components/TimeTicker' // ✅ New component for smooth animation

function SimulationView() {
  const [loading, setLoading] = useState(false)
  const [trajectoryData, setTrajectoryData] = useState({})
  const [timeIndex, setTimeIndex] = useState(0) // ✅ Float for interpolation

  const fetchTrajectoryData = useCallback(async (type) => {
    setLoading(true)
    console.log(`📡 Fetching data for type ${type}...`)
    try {
      const res = await fetch(`https://earth-debris-sim.onrender.com/precomputed_positions?type=${type}`)
      if (!res.ok) throw new Error(`Failed to fetch data for type ${type}`)

      const data = await res.json()
      const limitedData = Object.fromEntries(Object.entries(data).slice(0, 10))

      console.log(`✅ Data fetched for type ${type}:`, limitedData)
      // setTrajectoryData(limitedData)
      setTrajectoryData(data)
      setTimeIndex(0)
    } catch (err) {
      console.error('❌ Error during trajectory fetch:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <div className="simulation-canvas">
      <div className="button-panel">
        <button className="sim-button" onClick={() => fetchTrajectoryData(1)} disabled={loading}>Debris</button>
        <button className="sim-button" onClick={() => fetchTrajectoryData(2)} disabled={loading}>Payloads</button>
        <button className="sim-button" onClick={() => fetchTrajectoryData(3)} disabled={loading}>Rocket Bodies</button>
        <button className="sim-button clean-button" onClick={() => setTrajectoryData({})} disabled={loading}> 🧹 Clean </button>


      </div>

      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <span>Loading trajectory data...</span>
        </div>
      )}

      <Canvas camera={{ position: [0, 0, 3], fov: 60 }}>
        <color attach="background" args={['#000011']} />
        <ambientLight intensity={0.2} />
        <directionalLight position={[5, 3, 5]} intensity={1} />
        <Stars radius={100} depth={50} count={200} factor={0.05} saturation={0} fade />
        <Earth />
        <OrbitControls enableZoom enablePan enableRotate zoomSpeed={0.6} panSpeed={0.8} rotateSpeed={0.4} />

        <TimeTicker setTimeIndex={setTimeIndex} /> {/* ✅ Smooth frame time controller */}

        {Object.keys(trajectoryData).length > 0 && (
          <SpaceObjects trajectoryData={trajectoryData} timeIndex={timeIndex} />
        )}
      </Canvas>

      <div className="info-panel">
        <div className="time-display">
          Time: {Math.floor(timeIndex / 60).toString().padStart(2, '0')}:
          {(Math.floor(timeIndex) % 60).toString().padStart(2, '0')} UTC
        </div>
        <div className="object-count">
          Objects: {Object.keys(trajectoryData).length}
        </div>
      </div>
    </div>
  )
}

export default SimulationView


//problems: 
// 1. the objects are moving for 1 sec only and then disapear. I want them to move smoothly for infinite time
// 2. the objects are not moving smoothly, they are jumping
// 3. out of 5 objects only 4 are showing up