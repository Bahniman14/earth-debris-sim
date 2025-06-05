// src/components/Earth.jsx
import React, { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import * as THREE from 'three';

const Earth = () => {
  const [colorMap, specularMap, cloudMap, nightMap] = useLoader(TextureLoader, [
    '/src/assets/textures/earth_day.jpg',
    '/src/assets/textures/earth_specular.jpg',
    '/src/assets/textures/earth_clouds.png',
    '/src/assets/textures/earth_nightmap.jpg'
  ]);

  const earthRef = useRef();
  const cloudRef = useRef();
  const nightRef = useRef();

  // Rotate Earth and clouds
  useFrame(() => {
    earthRef.current.rotation.y += 0.0008;
    cloudRef.current.rotation.y += 0.001;
    nightRef.current.rotation.y += 0.0008;
  });

  return (
    <group>
      {/* Base Earth with day texture + specular shine */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhongMaterial
          map={colorMap}
          specularMap={specularMap}
          specular={new THREE.Color('grey')}
          shininess={10}
        />
      </mesh>

      {/* Night side layer using additive blending */}
      <mesh ref={nightRef}>
        <sphereGeometry args={[1.001, 64, 64]} />
        <meshBasicMaterial
          map={nightMap}
          blending={THREE.AdditiveBlending}
          transparent={true}
          opacity={0.5}
          depthWrite={false}
        />
      </mesh>

      {/* Rotating Cloud Layer */}
      <mesh ref={cloudRef}>
        <sphereGeometry args={[1.005, 64, 64]} />
        <meshPhongMaterial
          map={cloudMap}
          transparent={true}
          opacity={0.4}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};

export default Earth;
