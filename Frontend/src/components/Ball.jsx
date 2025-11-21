import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const Ball = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 22; // Zoom level

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(600, 600);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // 2. Create the Dot Sphere
    const geometry = new THREE.SphereGeometry(12, 64, 64);

    const material = new THREE.PointsMaterial({
      color: 0xff8c42, // The orange color
      size: 0.35, // Dot size
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // 3. Create an Inner "Blocker" Sphere
    const blackSphereGeometry = new THREE.SphereGeometry(11.8, 64, 64);
    const blackSphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.9,
    });
    const blackSphere = new THREE.Mesh(
      blackSphereGeometry,
      blackSphereMaterial
    );
    scene.add(blackSphere);

    // 4. Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);

      points.rotation.y += 0.003;
      points.rotation.x += 0.001;

      blackSphere.rotation.y += 0.003;
      blackSphere.rotation.x += 0.001;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      if (mountRef.current && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-full h-full flex items-center justify-center scale-100 md:scale-125 transition-transform duration-700"
      style={{ mixBlendMode: "multiply" }}
    />
  );
};

export default Ball;
