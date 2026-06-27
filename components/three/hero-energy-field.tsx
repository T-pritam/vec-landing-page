"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Lightweight WebGL hero accent (per AEM handoff: tasteful, not gimmicky).
 * A slowly-rotating amber particle field — reads as "energy", on-brand, and
 * subtle behind the hero content. Raw three.js (no R3F) to stay lean; this
 * component is dynamically imported with `ssr:false` and only mounted on
 * desktop + when reduced-motion is off (see home-hero.tsx), so it never blocks
 * LCP and respects the doc's Lighthouse ≥ 90 target. Pauses when offscreen.
 */
export default function HeroEnergyField() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 14;

    // Particle field: points spread through a soft spherical volume.
    const COUNT = 1400;
    const positions = new Float32Array(COUNT * 3);
    const radii = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      // distribute on/near a sphere shell for a clean "orb" silhouette
      const r = 7 + Math.random() * 2.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.8;
      positions[i * 3 + 2] = r * Math.cos(phi);
      radii[i] = Math.random();
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // Round, soft amber sprite for each point.
    const sprite = makeDotTexture();
    // Normal blending (not additive): the hero background is light, so additive
    // amber would wash out to white. Soft amber dots read cleanly on white.
    const material = new THREE.PointsMaterial({
      size: 0.17,
      map: sprite,
      transparent: true,
      depthWrite: false,
      color: new THREE.Color(0xf4a300),
      opacity: 0.75,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // A second, sparser inner cluster in a warmer tone for depth.
    const innerGeo = new THREE.BufferGeometry();
    const innerPos = new Float32Array(260 * 3);
    for (let i = 0; i < 260; i++) {
      const r = Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      innerPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      innerPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      innerPos[i * 3 + 2] = r * Math.cos(phi);
    }
    innerGeo.setAttribute("position", new THREE.BufferAttribute(innerPos, 3));
    const innerMat = new THREE.PointsMaterial({
      size: 0.12,
      map: sprite,
      transparent: true,
      depthWrite: false,
      color: new THREE.Color(0xd98c00),
      opacity: 0.55,
    });
    const innerPoints = new THREE.Points(innerGeo, innerMat);
    scene.add(innerPoints);

    // Pointer parallax (gentle).
    let targetX = 0;
    let targetY = 0;
    const onPointerMove = (e: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 0.6;
      targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 0.6;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    // Pause rendering when offscreen.
    let visible = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) loop();
      },
      { threshold: 0 },
    );
    io.observe(mount);

    const clock = new THREE.Clock();
    let raf = 0;

    const render = () => {
      const t = clock.getElapsedTime();
      points.rotation.y = t * 0.05;
      points.rotation.x = Math.sin(t * 0.12) * 0.12;
      innerPoints.rotation.y = -t * 0.08;
      // breathe
      const s = 1 + Math.sin(t * 0.6) * 0.03;
      points.scale.setScalar(s);
      // ease camera toward pointer target
      camera.position.x += (targetX * 2 - camera.position.x) * 0.04;
      camera.position.y += (-targetY * 2 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };

    const loop = () => {
      if (!visible) return;
      render();
      raf = requestAnimationFrame(loop);
    };
    loop();

    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      geometry.dispose();
      innerGeo.dispose();
      material.dispose();
      innerMat.dispose();
      sprite.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="h-full w-full" aria-hidden />;
}

/** Soft radial dot used as the point sprite. */
function makeDotTexture(): THREE.Texture {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.4, "rgba(255,255,255,0.6)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}
