// src/components/TimeTicker.jsx
import { useFrame } from '@react-three/fiber'

function TimeTicker({ setTimeIndex }) {
  useFrame((_, delta) => {
    setTimeIndex(prev => (prev + delta * 0.5) % 25) // 1440 frames for 24-hour loop
  })
  return null
}

export default TimeTicker
