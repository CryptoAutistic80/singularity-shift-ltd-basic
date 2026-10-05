const coffees = {
  daily: { name: 'The Daily', number: '01', notes: 'MILK CHOCOLATE · HAZELNUT · CARAMEL', roast: 'MEDIUM-DARK ROAST', espresso: 'A round, chocolatey cup that feels right at home in your espresso or moka pot. Especially good with a splash of milk.', filter: 'A comforting, chocolatey filter coffee with plenty of body. The easy choice for a gentle start or an unhurried cafetière.' },
  bright: { name: 'Bright Side', number: '02', notes: 'BERRIES · CITRUS · BROWN SUGAR', roast: 'LIGHT-MEDIUM ROAST', espresso: 'A lively, fruit-forward espresso for the curious. Expect a brighter cup; try it black to let its playful character shine.', filter: 'Your bright little moment. A juicy, fruit-forward profile that suits filter brewing and a slow, thoughtful first sip.' },
  slow: { name: 'Slow Sunday', number: '03', notes: 'COCOA · BISCUIT · SOFT CARAMEL', roast: 'MEDIUM ROAST · DECAF', espresso: 'All the cosy coffee character, with less of the buzz. A mellow decaf match for your espresso or moka routine.', filter: 'A gentle, biscuit-sweet decaf for your filter or cafetière. Make an afternoon of it, or let your evening slow right down.' },
};
const finder = document.querySelector('#coffee-finder');
const matchCard = document.querySelector('#match-card');
const addMatch = document.querySelector('#add-match');
const filters = [...document.querySelectorAll('[data-filter]')];
const cards = [...document.querySelectorAll('[data-coffee]')];
const saved = new Set();
let currentMatch = 'daily';
function makeArrow(value) { const arrow = document.createElement('span'); arrow.setAttribute('aria-hidden', 'true'); arrow.textContent = value; return arrow; }
function updateSaveButtons() {
  document.querySelectorAll('[data-save]').forEach(button => {
    const selected = saved.has(button.dataset.save);
    button.setAttribute('aria-pressed', String(selected));
    button.replaceChildren(document.createTextNode(selected ? 'Saved to your list ' : 'Save to tasting list '), makeArrow(selected ? '✓' : '+'));
  });
  const isSaved = saved.has(currentMatch);
  addMatch.setAttribute('aria-pressed', String(isSaved));
  addMatch.replaceChildren(document.createTextNode(isSaved ? 'Saved — remove from list ' : 'Save to my tasting list '), makeArrow(isSaved ? '✓' : '+'));
}
function updateMatch() {
  const values = new FormData(finder);
  const flavour = values.get('flavour');
  const brew = values.get('brew');
  currentMatch = flavour === 'bright' ? 'bright' : flavour === 'decaf' ? 'slow' : 'daily';
  const coffee = coffees[currentMatch];
  matchCard.dataset.match = currentMatch;
  document.querySelector('#match-name').textContent = coffee.name;
  document.querySelector('#match-number').textContent = coffee.number;
  document.querySelector('#match-notes').textContent = coffee.notes;
  document.querySelector('#match-reason').textContent = coffee[brew === 'filter' ? 'filter' : 'espresso'];
  document.querySelector('#match-roast').textContent = coffee.roast;
  document.querySelector('#match-brew').textContent = brew === 'filter' ? 'FILTER / CAFETIÈRE' : 'ESPRESSO / MOKA';
  updateSaveButtons();
}
function renderList(message = '') {
  const list = document.querySelector('#saved-coffees');
  list.replaceChildren();
  if (saved.size === 0) {
    const empty = document.createElement('li'); empty.className = 'empty-list';
    empty.textContent = 'Your next favourite is waiting. Save a coffee above to get started.';
    list.append(empty);
  } else {
    for (const key of saved) {
      const item = document.createElement('li');
      const name = document.createElement('span'); name.textContent = coffees[key].name;
      const remove = document.createElement('button'); remove.type = 'button'; remove.textContent = 'Remove';
      remove.setAttribute('aria-label', 'Remove ' + coffees[key].name + ' from your tasting list');
      remove.addEventListener('click', () => {
        const siblings = [...list.querySelectorAll('button')];
        const index = siblings.indexOf(remove);
        toggleCoffee(key);
        const remaining = [...list.querySelectorAll('button')];
        if (remaining.length) remaining[Math.min(index, remaining.length - 1)].focus();
        else focusVisibleSave(key);
      });
      item.append(name, remove); list.append(item);
    }
  }
  document.querySelector('#tasting-count').textContent = String(saved.size);
  document.querySelector('#clear-list').hidden = saved.size === 0;
  document.querySelector('#list-status').textContent = message;
  updateSaveButtons();
}
function focusVisibleSave(key) {
  const preferred = document.querySelector('[data-coffee="' + key + '"]');
  const card = preferred && !preferred.hidden ? preferred : cards.find(item => !item.hidden);
  (card ? card.querySelector('[data-save]') : addMatch).focus({ preventScroll: true });
}
function toggleCoffee(key) {
  if (!Object.hasOwn(coffees, key)) return;
  const removed = saved.has(key);
  if (removed) saved.delete(key); else saved.add(key);
  renderList(coffees[key].name + (removed ? ' removed. ' : ' saved. ') + saved.size + (saved.size === 1 ? ' coffee' : ' coffees') + ' on your tasting list.');
}
finder.addEventListener('change', updateMatch);
addMatch.addEventListener('click', () => toggleCoffee(currentMatch));
document.querySelectorAll('[data-save]').forEach(button => button.addEventListener('click', () => toggleCoffee(button.dataset.save)));
document.querySelector('#clear-list').addEventListener('click', () => {
  saved.clear(); renderList('Your tasting list has been cleared.');
  focusVisibleSave('daily');
});
filters.forEach(button => button.addEventListener('click', () => {
  const value = button.dataset.filter;
  filters.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
  let count = 0;
  cards.forEach(card => {
    card.hidden = value !== 'all' && card.dataset.kind !== value;
    if (!card.hidden) count++;
  });
  document.querySelector('#filter-count').textContent = count + (count === 1 ? ' coffee' : ' coffees') + ' to get to know';
}));
updateMatch();


// All motion is tied to a scroll, pointer, or layout event. No idle animation loop.
function initDaybreakMotion() {
  const root = document.documentElement;
  const hero = document.querySelector('.hero');
  const ribbon = document.querySelector('.manifesto-strip');
  const ritual = document.querySelector('.ritual');
  const stage = document.querySelector('.ritual-stage');
  const strip = document.querySelector('.demo-strip');
  const toggle = document.querySelector('#motion-toggle');
  const motionState = document.querySelector('#motion-state');
  const sceneNumber = document.querySelector('#ritual-current');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  let userPaused = false;
  let enabled = false;
  let frame = 0;
  let pointer = null;
  const clamp = value => Math.max(0, Math.min(1, value));
  const smooth = value => { const t = clamp(value); return t * t * (3 - 2 * t); };
  const mix = (start, end, amount) => start + (end - start) * amount;
  const px = value => value.toFixed(2) + 'px';
  const deg = value => value.toFixed(2) + 'deg';
  function set(element, values) {
    for (const [key, value] of Object.entries(values)) element.style.setProperty('--' + key, value);
  }
  function render() {
    frame = 0;
    if (!enabled || document.hidden) return;
    const vh = window.innerHeight;
    const vw = window.innerWidth;
    // Read layout together before changing any CSS properties.
    const heroRect = hero.getBoundingClientRect();
    const ribbonRect = ribbon.getBoundingClientRect();
    const ritualRect = ritual.getBoundingClientRect();
    const stageHeight = stage.offsetHeight;
    const barHeight = strip.offsetHeight;
    const small = vw <= 720;
    const mobileScale = small ? 0.5 : 1;
    const heroProgress = clamp(-heroRect.top / Math.max(heroRect.height, 1));
    let x = 0;
    let y = 0;
    if (pointer && finePointer.matches) {
      x = Math.max(-1, Math.min(1, ((pointer.x - heroRect.left) / heroRect.width - 0.5) * 2));
      y = Math.max(-1, Math.min(1, ((pointer.y - heroRect.top) / heroRect.height - 0.5) * 2));
    }
    if (heroRect.bottom > -100 && heroRect.top < vh + 100) {
      set(hero, {
        'photo-x': px(x * 22), 'photo-y': px(-heroProgress * 140 * mobileScale + y * 15),
        'photo-turn': deg(4 - heroProgress * 10 + x * 3.5),
        'image-x': px(-x * 13), 'image-y': px(-heroProgress * 25 + y * 8),
        'title-one-x': px(-heroProgress * 100 * mobileScale - x * 7),
        'title-one-y': px(heroProgress * 32 * mobileScale),
        'title-two-x': px(heroProgress * 70 * mobileScale + x * 9),
        'title-two-y': px(-heroProgress * 12 * mobileScale),
        'stamp-x': px(-x * 30), 'stamp-y': px(heroProgress * 85 * mobileScale - y * 23),
        'stamp-turn': deg(15 + heroProgress * 70 - x * 13),
        'detail-x': px(x * 34), 'detail-y': px(-heroProgress * 95 * mobileScale + y * 28),
        'detail-turn': deg(-12 - heroProgress * 35 + x * 11),
        'tag-x': px(-x * 12), 'tag-y': px(heroProgress * 40 * mobileScale - y * 14),
        'tag-turn': deg(-7 + heroProgress * 15 - x * 4),
      });
    }
    if (ribbonRect.bottom > -150 && ribbonRect.top < vh + 150) {
      const travel = (vh - ribbonRect.top) / (vh + ribbonRect.height) - 0.35;
      set(ribbon, { 'ribbon-one-x': px(-travel * vw * 0.62), 'ribbon-two-x': px(travel * vw * 0.53) });
    }
    root.style.setProperty('--demo-height', barHeight + 'px');
    if (root.classList.contains('story-motion-enabled') && ritualRect.bottom > -100 && ritualRect.top < vh + 100) {
      const progress = clamp((barHeight - ritualRect.top) / Math.max(1, ritualRect.height - stageHeight));
      const second = smooth((progress - 0.1) / 0.38);
      const third = smooth((progress - 0.52) / 0.38);
      const spread = small ? vw * 0.20 : vw * 0.21;
      const startColour = [201, 224, 191];
      const middleColour = [216, 207, 241];
      const endColour = [243, 170, 202];
      const colour = startColour.map((value, index) => Math.round(mix(mix(value, middleColour[index], second), endColour[index], third)));
      set(ritual, {
        'ritual-bg': 'rgb(' + colour.join(',') + ')',
        'ritual-progress': String(0.06 + progress * 0.94),
        'ritual-title-x': px(-progress * vw * (small ? 0.06 : 0.1)),
        'ritual-title-y': px(-progress * (small ? 18 : 40)),
        'frame-one-x': px(-second * spread - third * spread * 0.3),
        'frame-one-y': px(-second * vh * 0.05 - third * vh * 0.015),
        'frame-one-turn': deg(-7 - second * 10 - third * 4),
        'frame-one-scale': String(1 - second * 0.10 - third * 0.03),
        'frame-two-x': px((1 - second) * vw * 0.07 - third * spread * 0.70),
        'frame-two-y': px((1 - second) * vh * 1.05 - third * vh * 0.035),
        'frame-two-turn': deg(19 - second * 15 - third * 12),
        'frame-two-scale': String(1 - third * 0.07),
        'frame-three-x': px((1 - third) * -vw * 0.05),
        'frame-three-y': px((1 - third) * vh * 1.12),
        'frame-three-turn': deg(-15 + third * 12),
        'frame-image-y': px(-progress * 15),
      });
      const current = third > 0.62 ? '03' : second > 0.62 ? '02' : '01';
      if (sceneNumber.textContent !== current) sceneNumber.textContent = current;
    }
  }
  function schedule() {
    if (enabled && !frame && !document.hidden) frame = window.requestAnimationFrame(render);
  }
  function syncSceneLayout() {
    root.classList.toggle('story-motion-enabled', enabled && window.innerHeight >= 600);
    schedule();
  }
  function syncMotion() {
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
    enabled = !reduced.matches && !userPaused;
    pointer = null;
    root.classList.toggle('motion-enabled', enabled);
    toggle.hidden = false;
    toggle.disabled = reduced.matches;
    toggle.setAttribute('aria-pressed', String(enabled));
    toggle.setAttribute('aria-label', reduced.matches ? 'Motion effects disabled by your system preference' : 'Motion effects');
    motionState.textContent = reduced.matches ? 'reduced' : enabled ? 'on' : 'off';
    syncSceneLayout();
  }
  toggle.addEventListener('click', () => { userPaused = !userPaused; syncMotion(); });
  reduced.addEventListener('change', syncMotion);
  finePointer.addEventListener('change', () => { pointer = null; schedule(); });
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', syncSceneLayout, { passive: true });
  window.addEventListener('load', schedule, { once: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && frame) { window.cancelAnimationFrame(frame); frame = 0; }
    else schedule();
  });
  hero.addEventListener('pointermove', event => {
    if (!enabled || !finePointer.matches || event.pointerType === 'touch') return;
    pointer = { x: event.clientX, y: event.clientY }; schedule();
  }, { passive: true });
  hero.addEventListener('pointerleave', () => { pointer = null; schedule(); }, { passive: true });
  if ('ResizeObserver' in window) {
    const resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(document.body);
  }
  if (document.fonts) document.fonts.ready.then(schedule);
  syncMotion();
}
initDaybreakMotion();
