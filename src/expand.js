import * as THREE from 'three';
import gsap from 'gsap';
import { cards } from './cards.js';
import { camera, renderer } from './scene.js';
import { getConveyorPos } from './conveyor.js';
import { lerp } from './conveyor.js';

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

export let expandedCard = null;
export let isExpanded = false;

export function expandCard(card) {
  if (isExpanded) return;
  isExpanded = true;
  expandedCard = card;
  document.getElementById('close-btn').style.display = 'flex';

  cards.forEach((c) => {
    if (c !== card) gsap.to(c.mesh.material, { opacity: 0.08, duration: 0.8 });
  });
  gsap.to(card.mesh.position, { x: 0, y: 0, z: 4.5, duration: 1.1, ease: 'power2.out' });
  gsap.to(card.mesh.rotation, { x: 0, y: 0, z: 0, duration: 1.1, ease: 'power2.out' });
  gsap.to(card.mesh.scale, { x: 5, y: 5, z: 1, duration: 1.1, ease: 'power2.out' });
}

export function closeExpand() {
  if (!isExpanded || !expandedCard) return;
  document.getElementById('close-btn').style.display = 'none';
  cards.forEach((c) => gsap.to(c.mesh.material, { opacity: 1, duration: 0.5 }));

  const card = expandedCard;
  const cPos = getConveyorPos(card.currentT);
  const ep = card.popAmount * card.popAmount * (3 - 2 * card.popAmount);
  const tx = lerp(cPos.x, cPos.x + card.scatterOffX, ep);
  const ty = lerp(cPos.y, cPos.y + card.scatterOffY, ep);
  const tz = lerp(card.zBase, card.scatterOffZ + card.zBase, ep);

  gsap.to(card.mesh.position, { x: tx, y: ty, z: tz, duration: 0.9, ease: 'power2.inOut' });
  gsap.to(card.mesh.rotation, {
    x: lerp(0, card.scatterRotX, ep),
    y: lerp(0, card.scatterRotY, ep),
    z: lerp(card.initRotZ, card.scatterRotZ, ep),
    duration: 0.9,
    ease: 'power2.inOut',
  });
  gsap.to(card.mesh.scale, {
    x: lerp(1, card.scatterScale, ep),
    y: lerp(1, card.scatterScale, ep),
    z: 1,
    duration: 0.9,
    ease: 'power2.inOut',
    onComplete: () => {
      isExpanded = false;
      expandedCard = null;
    },
  });
}

export function initExpandListeners() {
  document.getElementById('close-btn').addEventListener('click', closeExpand);

  renderer.domElement.addEventListener('click', (e) => {
    if (isExpanded) return;
    mouse.x = (e.clientX / innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(
      cards.filter((c) => c.popAmount > 0.3).map((c) => c.mesh),
    );
    if (hits.length > 0) {
      const card = cards.find((c) => c.mesh === hits[0].object);
      if (card) expandCard(card);
    }
  });
}
