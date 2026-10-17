"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Sparkles, EyeOff, Network, Waves } from "lucide-react";

type EffectMode = "net" | "waves" | "off";

export const VantaBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<EffectMode>("net");

  useEffect(() => {
    const container = containerRef.current;
    if (!container || mode === "off") return;

    let animationFrameId: number;
    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
    camera.position.z = 260;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const particleCount = mode === "net" ? 65 : 100;
    const positions = new Float32Array(particleCount * 3);
    const velocities: { vx: number; vy: number; vz: number; baseY: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 480;
      const y = (Math.random() - 0.5) * 320;
      const z = (Math.random() - 0.5) * 220;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      velocities.push({
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        vz: (Math.random() - 0.5) * 0.16,
        baseY: y,
      });
    }

    const pointsGeometry = new THREE.BufferGeometry();
    pointsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // Aged Brass (#80643d) & Heritage Green (#526a56) from hackforge-vetymgot.manus.space
    const pointsMaterial = new THREE.PointsMaterial({
      color: mode === "net" ? 0x80643d : 0x526a56,
      size: 3.2,
      transparent: true,
      opacity: 0.35,
    });

    const pointsMesh = new THREE.Points(pointsGeometry, pointsMaterial);
    group.add(pointsMesh);

    const maxLineSegments = particleCount * particleCount;
    const linePositions = new Float32Array(maxLineSegments * 3);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      color: mode === "net" ? 0x987d50 : 0x617562,
      transparent: true,
      opacity: 0.11,
    });

    const lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
    group.add(lineSegments);

    let clock = 0;
    const maxConnectDistance = mode === "net" ? 90 : 68;

    const animate = () => {
      clock += 0.01;
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      group.rotation.y = mouse.x * 0.25 + Math.sin(clock * 0.3) * 0.06;
      group.rotation.x = mouse.y * 0.18 + Math.cos(clock * 0.25) * 0.04;

      const posAttr = pointsGeometry.getAttribute("position") as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        if (mode === "waves") {
          const x = posArray[i * 3];
          const z = posArray[i * 3 + 2];
          posArray[i * 3 + 1] =
            velocities[i].baseY +
            Math.sin(x * 0.02 + clock * 2) * 16 +
            Math.cos(z * 0.02 + clock * 1.5) * 12;
        } else {
          posArray[i * 3] += velocities[i].vx;
          posArray[i * 3 + 1] += velocities[i].vy;
          posArray[i * 3 + 2] += velocities[i].vz;

          if (Math.abs(posArray[i * 3]) > 250) velocities[i].vx *= -1;
          if (Math.abs(posArray[i * 3 + 1]) > 170) velocities[i].vy *= -1;
          if (Math.abs(posArray[i * 3 + 2]) > 120) velocities[i].vz *= -1;
        }
      }
      posAttr.needsUpdate = true;

      let vertexIndex = 0;
      for (let i = 0; i < particleCount; i++) {
        for (let j = i + 1; j < particleCount; j++) {
          const dx = posArray[i * 3] - posArray[j * 3];
          const dy = posArray[i * 3 + 1] - posArray[j * 3 + 1];
          const dz = posArray[i * 3 + 2] - posArray[j * 3 + 2];
          const distSq = dx * dx + dy * dy + dz * dz;

          if (distSq < maxConnectDistance * maxConnectDistance) {
            linePositions[vertexIndex++] = posArray[i * 3];
            linePositions[vertexIndex++] = posArray[i * 3 + 1];
            linePositions[vertexIndex++] = posArray[i * 3 + 2];
            linePositions[vertexIndex++] = posArray[j * 3];
            linePositions[vertexIndex++] = posArray[j * 3 + 1];
            linePositions[vertexIndex++] = posArray[j * 3 + 2];
          }
        }
      }

      lineGeometry.setDrawRange(0, vertexIndex / 3);
      (lineGeometry.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      pointsGeometry.dispose();
      pointsMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      renderer.dispose();
    };
  }, [mode]);

  return (
    <>
      <div
        ref={containerRef}
        className="fixed inset-0 pointer-events-none z-0 opacity-60 transition-opacity duration-700"
        aria-hidden="true"
      />

      {/* Floating Vanta 3D Scene Switcher styled in Editorial Linen & Heritage Green */}
      <div className="fixed bottom-4 right-4 z-40 hidden sm:flex items-center gap-1 p-1 rounded-full bg-[#fffdf8]/95 backdrop-blur-md border border-[#d9d0c2] shadow-lg text-[10px]">
        <span className="px-2.5 py-1 text-[#726d62] font-mono flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#80643d]" />
          Vanta 3D
        </span>
        <button
          onClick={() => setMode("net")}
          className={`px-2.5 py-1 rounded-full font-medium flex items-center gap-1 transition-all ${
            mode === "net"
              ? "bg-[#394b3f] text-[#fffdf8] shadow"
              : "text-[#625d52] hover:text-[#292720]"
          }`}
          title="Vanta 3D Neural Net"
        >
          <Network className="w-3 h-3" /> Net
        </button>
        <button
          onClick={() => setMode("waves")}
          className={`px-2.5 py-1 rounded-full font-medium flex items-center gap-1 transition-all ${
            mode === "waves"
              ? "bg-[#394b3f] text-[#fffdf8] shadow"
              : "text-[#625d52] hover:text-[#292720]"
          }`}
          title="Vanta 3D Waves"
        >
          <Waves className="w-3 h-3" /> Waves
        </button>
        <button
          onClick={() => setMode("off")}
          className={`px-2 py-1 rounded-full font-medium flex items-center gap-1 transition-all ${
            mode === "off"
              ? "bg-[#80643d] text-[#fffdf8]"
              : "text-[#726d62] hover:text-[#292720]"
          }`}
          title="Disable 3D Background"
        >
          <EyeOff className="w-3 h-3" />
        </button>
      </div>
    </>
  );
};
