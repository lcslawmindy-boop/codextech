import * as THREE from "three";

export const NEON = [
  0x00ffff, 0xff00ff, 0x00ff88, 0xff6600,
  0xffff00, 0xff0088, 0x8800ff, 0x00aaff,
  0xff4400, 0x44ff00, 0x0044ff, 0xff44aa,
  0x00ffaa, 0xaa00ff, 0xffaa00, 0x00ff00,
];

export const GOLD = 0xffd700;
export const SACRED_GOLD = 0xffaa00;

export function neonMat(hex, emissive = 2.0) {
  return new THREE.MeshStandardMaterial({
    color: hex, emissive: hex, emissiveIntensity: emissive,
    roughness: 0.05, metalness: 0.9,
  });
}

export function wireframeMat(hex, opacity = 1) {
  return new THREE.MeshBasicMaterial({ color: hex, wireframe: true, transparent: opacity < 1, opacity });
}

export function glowMat(hex, opacity = 0.15) {
  return new THREE.MeshStandardMaterial({
    color: hex, emissive: hex, emissiveIntensity: 0.5,
    transparent: true, opacity, side: THREE.DoubleSide,
  });
}

export function rand(min, max) { return min + Math.random() * (max - min); }
export function randSign() { return Math.random() > 0.5 ? 1 : -1; }