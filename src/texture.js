import * as THREE from "three";

const images = [
  "/img/aniversary.webp",
  "/img/arcraft.webp",
  "/img/nenga-2024.webp",
  "/img/nenga-2026.webp",
  "/img/portfolio-2024.webp",
];

const loader = new THREE.TextureLoader();

export async function createTexture(i) {
  const path = images[i % images.length];
  const tex = await loader.loadAsync(path);
  tex.colorSpace = THREE.SRGBColorSpace;

  return tex;
}
