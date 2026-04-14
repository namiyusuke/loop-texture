import { FRICTION, WHEEL_SENS, TOUCH_SENS } from './config.js';

export let scrollVel = 0;
export let scrollOffset = 0;
let hasScrolled = false;

export function updateScroll(dt, baseSpeed) {
  scrollVel *= FRICTION;
  const totalSpeed = baseSpeed + scrollVel;
  scrollOffset += dt * totalSpeed;
}

export function addScrollVel(delta) {
  scrollVel += delta;
}

function onFirstScroll() {
  hasScrolled = true;
  document.getElementById('overlay').classList.add('hide');
  document.getElementById('scroll-hint').classList.add('hide');
}

export function initScrollListeners(isExpandedFn) {
  window.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault();
      if (isExpandedFn()) return;
      scrollVel += e.deltaY * WHEEL_SENS;
      if (!hasScrolled) onFirstScroll();
    },
    { passive: false },
  );

  let touchPrevY = 0;
  window.addEventListener(
    'touchstart',
    (e) => {
      touchPrevY = e.touches[0].clientY;
    },
    { passive: true },
  );
  window.addEventListener(
    'touchmove',
    (e) => {
      if (isExpandedFn()) return;
      const y = e.touches[0].clientY;
      scrollVel += (touchPrevY - y) * TOUCH_SENS;
      touchPrevY = y;
      if (!hasScrolled) onFirstScroll();
    },
    { passive: true },
  );
}
