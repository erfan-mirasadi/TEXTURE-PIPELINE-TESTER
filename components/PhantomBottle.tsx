"use client";

import React, { useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture, Environment, Float } from "@react-three/drei";
import * as THREE from "three";

// Defining the available modes for our texture setup
type MapMode = 1 | 2 | 3 | 4;

interface BottleMeshProps {
  mapMode: MapMode;
}

// Inner Mesh Component handling the 3D logic
const BottleMesh: React.FC<BottleMeshProps> = ({ mapMode }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  // Load all textures upfront to respect React Hook rules.
  // We will selectively apply them based on the mapMode state.
  const [colorMap, normalMap, aoMap, roughnessMap] = useTexture([
    "/images/fanta_diffuse.png",
    "/images/fanta_normal.png",
    "/images/fanta_ao.png",
    "/images/fanta_roughness.png",
  ]);

  // Interactive relighting and parallax calculation
  useFrame((state) => {
    const pointerX = state.pointer.x;
    const pointerY = state.pointer.y;

    // Smoothly animate the light position
    if (lightRef.current) {
      lightRef.current.position.x = THREE.MathUtils.lerp(
        lightRef.current.position.x,
        pointerX * 3,
        0.1,
      );
      lightRef.current.position.y = THREE.MathUtils.lerp(
        lightRef.current.position.y,
        pointerY * 3,
        0.1,
      );
    }

    // Smoothly tilt the plane
    if (meshRef.current) {
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        -pointerY * 0.2,
        0.05,
      );
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        pointerX * 0.2,
        0.05,
      );
    }
  });

  // Dynamic prop assignment based on the selected mode
  const activeNormalMap = mapMode >= 2 ? normalMap : null;
  const activeRoughnessMap = mapMode >= 3 ? roughnessMap : null;
  const activeAOMap = mapMode === 4 ? aoMap : null;

  // If we don't have a roughness map (modes 1 & 2), we use clearcoat to fake the glass reflection.
  // If we DO have a roughness map (modes 3 & 4), the map handles reflections, so we disable clearcoat.
  const shouldUseFakeGlass = mapMode === 2;

  return (
    <>
      <Environment preset="city" />
      <ambientLight intensity={0.4} />

      <pointLight
        ref={lightRef}
        position={[0, 0, 2]}
        intensity={6}
        distance={10}
        decay={2}
        color="#ffffff"
      />

      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.3}>
        <mesh ref={meshRef}>
          <planeGeometry args={[3, 4]} />
          <meshPhysicalMaterial
            map={colorMap}
            map-colorSpace={THREE.SRGBColorSpace}
            // Apply Normal Map if mode is 2 or higher
            normalMap={activeNormalMap}
            {...(activeNormalMap
              ? { "normalMap-colorSpace": THREE.NoColorSpace }
              : {})}
            normalScale={
              activeNormalMap
                ? new THREE.Vector2(1.5, 1.5)
                : new THREE.Vector2(0, 0)
            }
            // Apply Roughness Map if mode is 3 or higher
            roughnessMap={activeRoughnessMap}
            // Apply AO Map only if mode is 4
            aoMap={activeAOMap}
            transparent={true}
            // Base physical properties
            roughness={activeRoughnessMap ? 1 : 0.2}
            metalness={0.1}
            // The magic fallback for 2-map setups
            clearcoat={shouldUseFakeGlass ? 1.0 : 0.0}
            clearcoatRoughness={0.1}
          />
        </mesh>
      </Float>
    </>
  );
};

export default function PhantomBottle() {
  // State to track which texture mode is currently active
  const [mapMode, setMapMode] = useState<MapMode>(2);

  // UI Button configurations for the control panel
  const modes = [
    {
      value: 1,
      label: "Flat Diffuse (1 Map)",
      desc: "Just the image, no 3D effect.",
    },
    {
      value: 2,
      label: "2.5D Magic (2 Maps)",
      desc: "Diffuse + Normal + Fake Glass.",
    },
    {
      value: 3,
      label: "Pro Material (3 Maps)",
      desc: "Adds Roughness for label/glass separation.",
    },
    {
      value: 4,
      label: "Ultra Realism (4 Maps)",
      desc: "Adds AO for micro-shadows.",
    },
  ];

  return (
    <div className="w-full h-screen bg-[#050505] overflow-hidden relative font-sans">
      {/* --- Control Panel UI --- */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3">
        <h1 className="text-white text-xl font-bold tracking-wider opacity-80">
          TEXTURE PIPELINE TESTER
        </h1>
        <div className="flex gap-2 bg-black/50 p-2 rounded-xl backdrop-blur-md border border-white/10">
          {modes.map((mode) => (
            <button
              key={mode.value}
              onClick={() => setMapMode(mode.value as MapMode)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                mapMode === mode.value
                  ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                  : "bg-transparent text-white/60 hover:text-white hover:bg-white/10"
              }`}
              title={mode.desc}
            >
              {mode.label}
            </button>
          ))}
        </div>
        <p className="text-white/50 text-xs mt-2 text-center max-w-md">
          {modes.find((m) => m.value === mapMode)?.desc}
        </p>
      </div>

      {/* --- Three.js Canvas --- */}
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ alpha: false, antialias: true }}
      >
        <Suspense fallback={null}>
          <BottleMesh mapMode={mapMode} />
        </Suspense>
      </Canvas>
    </div>
  );
}
