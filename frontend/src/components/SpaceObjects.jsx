// src/components/SpaceObjects.jsx
import React, { useMemo } from 'react'
import { Instances, Instance } from '@react-three/drei'
import { Vector3, CatmullRomCurve3 } from 'three'

function createLoopingCurve(positions) {
  const vectors = positions.map(p => new Vector3(...p))
  return new CatmullRomCurve3(vectors, true) // true = closed loop
}

function SpaceObjects({ trajectoryData, timeIndex }) {
  // Convert timeIndex to a normalized t value [0, 1]
  const t = timeIndex / 24

  const instances = useMemo(() => {
    return Object.entries(trajectoryData).map(([noradId, points]) => {
      const curve = createLoopingCurve(points)
      const point = curve.getPoint(t)
      return {
        id: noradId,
        position: [point.x / 10000, point.y / 10000, point.z / 10000],
      }
    })
  }, [trajectoryData, timeIndex])

  return (
    <Instances limit={10000}>
      <sphereGeometry args={[0.01, 4, 4]} />
      <meshStandardMaterial color="white" />
      {instances.map(obj => (
        <Instance key={obj.id} position={obj.position} />
      ))}
    </Instances>
  )
}

export default React.memo(SpaceObjects)
