const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
const intro = document.querySelector('.collection-intro');
const scene = document.querySelector('.collection-scene');
const features = [...document.querySelectorAll('.concept-feature')];
let frame = 0;
let pointerX = 0;
let pointerY = 0;
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
function render() {
  frame = 0;
  if (motionPreference.matches || document.hidden) return;
  const rect = intro.getBoundingClientRect();
  const narrow = innerWidth <= 720;
  intro.style.setProperty('--deck-scroll', String(clamp(-rect.top / rect.height, 0, 1) * (narrow ? .35 : 1)));
  scene.style.setProperty('--deck-x', String(pointerX));
  scene.style.setProperty('--deck-y', String(pointerY));
  for (const feature of features) {
    const box = feature.getBoundingClientRect();
    if (box.bottom < 0 || box.top > innerHeight) continue;
    feature.style.setProperty('--preview-depth', String(clamp((box.top + box.height / 2 - innerHeight / 2) / innerHeight, -1, 1)));
  }
}
function schedule() {
  if (!frame && !motionPreference.matches && !document.hidden) frame = requestAnimationFrame(render);
}
function syncPreference() {
  document.body.classList.toggle('collection-moving', !motionPreference.matches);
  if (frame) cancelAnimationFrame(frame);
  frame = 0;
  pointerX = pointerY = 0;
  if (motionPreference.matches) {
    intro.style.removeProperty('--deck-scroll');
    scene.style.removeProperty('--deck-x');
    scene.style.removeProperty('--deck-y');
    features.forEach(feature => feature.style.removeProperty('--preview-depth'));
  } else schedule();
}
scene.addEventListener('pointermove', event => {
  if (!finePointer.matches || motionPreference.matches) return;
  const box = scene.getBoundingClientRect();
  pointerX = clamp((event.clientX - box.left) / box.width * 2 - 1, -1, 1);
  pointerY = clamp((event.clientY - box.top) / box.height * 2 - 1, -1, 1);
  schedule();
});
scene.addEventListener('pointerleave', () => { pointerX = pointerY = 0; schedule(); });
window.addEventListener('scroll', schedule, { passive: true });
window.addEventListener('resize', schedule, { passive: true });
document.addEventListener('visibilitychange', schedule);
motionPreference.addEventListener('change', syncPreference);
finePointer.addEventListener('change', () => { pointerX = pointerY = 0; schedule(); });
syncPreference();
