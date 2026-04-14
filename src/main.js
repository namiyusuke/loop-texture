import "./style.css";
import { BASE_SPEED, POP_LERP, RETURN_LERP } from "./config.js";
import { scene, camera, renderer } from "./scene.js";
import { cards, initCards } from "./cards.js";
import { getConveyorPos, getConveyorScale, computePopAmount, lerp } from "./conveyor.js";
import { scrollOffset, updateScroll, initScrollListeners } from "./scroll.js";
import { isExpanded, expandedCard, initExpandListeners } from "./expand.js";

// 初期化してからアニメーション開始
async function init() {
  await initCards();
  initScrollListeners(() => isExpanded);
  initExpandListeners();
  animate();
}

let time = 0;

function animate() {
  requestAnimationFrame(animate);
  const dt = 1 / 60;
  time += dt;

  // スクロール物理を更新
  updateScroll(dt, BASE_SPEED);

  // 展開中は浮遊アニメーションだけ
  if (isExpanded) {
    cards.forEach((card) => {
      if (card !== expandedCard && card.popAmount > 0.1) {
        card.mesh.position.x += Math.sin(time * card.floatSpeed + card.floatPhase) * card.floatAmpX * 0.003;
        card.mesh.position.y += Math.cos(time * card.floatSpeed * 0.7 + card.floatPhase) * card.floatAmpY * 0.003;
      }
    });
    renderer.render(scene, camera);
    return;
  }

  // カードを更新
  cards.forEach((card) => {
    let t = (card.baseT + scrollOffset) % 1;
    if (t < 0) t += 1;
    card.currentT = t;

    // ゾーンベースのポップ
    const rawPop = computePopAmount(t);
    const lSpeed = rawPop > card.popAmount ? POP_LERP : RETURN_LERP;
    card.popAmount += (rawPop - card.popAmount) * lSpeed;
    if (card.popAmount < 0.002) card.popAmount = 0;

    const cPos = getConveyorPos(t);
    const cScale = getConveyorScale(t);

    if (card.popAmount > 0) {
      const p = card.popAmount;
      console.log(p);
      const ep = 1 - Math.pow(1 - p, 5);

      const wobX = Math.sin(time * card.floatSpeed + card.floatPhase) * card.floatAmpX * ep;
      const wobY = Math.cos(time * card.floatSpeed * 0.7 + card.floatPhase) * card.floatAmpY * ep;
      const wobRz = Math.sin(time * 0.1 + card.floatPhase) * 0.002 * ep;

      card.mesh.position.x = lerp(cPos.x, cPos.x + card.scatterOffX, ep) + wobX;
      card.mesh.position.y = lerp(cPos.y, cPos.y + card.scatterOffY, ep) + wobY;
      card.mesh.position.z = lerp(card.zBase, card.scatterOffZ + card.zBase, ep);

      card.mesh.rotation.x = lerp(0, card.scatterRotX, ep);
      card.mesh.rotation.y = lerp(0, card.scatterRotY, ep);
      card.mesh.rotation.z = lerp(card.initRotZ, card.scatterRotZ, ep) + wobRz;

      card.mesh.scale.setScalar(lerp(cScale, card.scatterScale, ep));
    } else {
      card.mesh.position.set(cPos.x, cPos.y, card.zBase);
      card.mesh.rotation.set(0, 0, card.initRotZ);
      card.mesh.scale.setScalar(cScale);
    }
  });

  renderer.render(scene, camera);
}

init();
