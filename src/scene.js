import * as THREE from 'three';

export const scene = new THREE.Scene();

export const camera = new THREE.PerspectiveCamera(
  50,
  innerWidth / innerHeight,
  0.1,
  100,
);
camera.position.set(0, 0, 12);

export const renderer = new THREE.WebGLRenderer({
  antialias: true,
  logarithmicDepthBuffer: true,
});
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setClearColor(0x0a0a0a);
document.body.appendChild(renderer.domElement);

// 背景グリッド
const grid = new THREE.GridHelper(40, 40, 0x1a1a1a, 0x141414);
grid.rotation.x = Math.PI / 2;
grid.position.z = -3;
scene.add(grid);

// リサイズ対応
window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
