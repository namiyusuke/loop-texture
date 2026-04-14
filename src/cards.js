import * as THREE from "three";
import { CARD_COUNT, CARD_W, CARD_H } from "./config.js";
import { scene } from "./scene.js";
import { createTexture } from "./texture.js";

export const cards = [];

export async function initCards() {
  const textures = await Promise.all(Array.from({ length: CARD_COUNT }, (_, i) => createTexture(i)));

  for (let i = 0; i < CARD_COUNT; i++) {
    const geo = new THREE.PlaneGeometry(CARD_W, CARD_H);
    const mat = new THREE.MeshBasicMaterial({
      map: textures[i],
      side: THREE.DoubleSide,
      transparent: true,
    });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    cards.push({
      mesh,
      baseT: i / CARD_COUNT,
      currentT: 0,
      initRotZ: (Math.random() - 0.5) * 0.06,
      zBase: i * 0.025,
      // 散らばり（カードごとにランダム）
      scatterOffX: (Math.random() - 0.5) * 7,
      scatterOffY: (Math.random() - 0.5) * 4.5,
      scatterOffZ: 1.0 + Math.random() * 2.5,
      scatterRotX: (Math.random() - 0.5) * 0.25,
      scatterRotY: (Math.random() - 0.5) * 0.25,
      scatterRotZ: (Math.random() - 0.5) * 0.2,
      scatterScale: 1.2 + Math.random() * 1.5,
      // 浮遊アニメーション
      floatSpeed: 0.1 + Math.random() * 0.2,
      floatAmpX: 0.015 + Math.random() * 0.04,
      floatAmpY: 0.01 + Math.random() * 0.03,
      floatPhase: Math.random() * Math.PI * 2,
      // 状態
      popAmount: 0,
    });
  }
}
