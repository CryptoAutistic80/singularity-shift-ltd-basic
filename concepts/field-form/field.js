const projects = [
  {
    name: 'Arc House', title: ['A softer', 'skyline.'], type: 'Living / Concept study',
    description: 'An exploration of light, repetition and the space between. Imagining a more generous kind of urban living.',
    image: new URL('./assets/light-study.webp', import.meta.url).href,
    alt: 'A white, curved building in Madrid, its repeated fins set against a pale blue sky. Architectural reference photograph by Joel Filipe.',
    photographer: 'Joel Filipe', source: 'https://unsplash.com/photos/white-concrete-building-at-daytime-PFIeJh17SZo', place: 'Madrid, Spain', position: '50% 49%',
    study: 'Urban living', focus: 'Daylight, shelter, shared space',
    question: 'How can a repeated façade create variety, privacy and a sense of belonging?',
    approach: 'Imagine a series of homes arranged around generous shared thresholds. Deep window reveals frame the sky, while a repeated structure makes room for individual lives. The study asks how an apparently simple elevation could support many different ways of living.',
    reference: 'Joel Filipe’s photograph in Madrid draws attention to the rhythm of a curved white façade. It is an existing building, used here as a visual reference for a fictional brief.'
  },
  {
    name: 'Common Ground', title: ['A greener', 'threshold.'], type: 'Community / Concept study',
    description: 'A place to pause, meet and belong. Exploring how the smallest patch of green can change our relationship with the city.',
    image: new URL('./assets/terrace-study.webp', import.meta.url).href,
    alt: 'A green tree beside the pale wall and dark windows of a building in London. Architectural reference photograph by Imani Bahati.',
    photographer: 'Imani Bahati', source: 'https://unsplash.com/photos/green-leafed-tree-beside-white-concrete-building-with-glass-window-idaXDb_k51o', place: 'London, United Kingdom', position: '50% 50%',
    study: 'Neighbourhood gathering place', focus: 'Green thresholds, shade, connection',
    question: 'What if the space outside a building mattered as much as the space within?',
    approach: 'Picture a small neighbourhood room opening onto a planted courtyard. A sheltered bench, a broad doorway and a tree create a sequence of places to stop. This fictional brief explores a public edge that feels welcoming without requiring an invitation.',
    reference: 'Imani Bahati’s London photograph places a leafy tree against a quiet white wall. The existing scene is a reference for the relationship between built form and nature, not a proposed or completed FIELD / FORM project.'
  },
  {
    name: 'Quiet Works', title: ['Room to', 'think.'], type: 'Workplace / Concept study',
    description: 'Less distraction. More possibility. A study of proportion and rhythm, imagining workspaces that leave room for concentration.',
    image: new URL('./assets/rhythm-study.webp', import.meta.url).href,
    alt: 'A sharply angled brick façade with small windows beneath an open pale sky in Canada. Architectural reference photograph by RUBENIMAGES.',
    photographer: 'RUBENIMAGES.', source: 'https://unsplash.com/photos/brown-concrete-building-during-daytime-qQ_LvMMNXoM', place: 'Canada', position: '39% 50%',
    study: 'Shared workplace', focus: 'Calm proportions, focus, flexibility',
    question: 'Can a workplace offer both the energy of company and the quiet of a room of one’s own?',
    approach: 'The imagined plan alternates spaces for shared work with smaller rooms for retreat. Repeated openings and a restrained material palette bring a clear rhythm to the day. The brief considers how simple boundaries can support different needs without isolating people.',
    reference: 'This photograph by RUBENIMAGES. in Canada studies an existing façade and the open sky. Its proportions inform the fictional brief; the photograph does not depict a FIELD / FORM commission.'
  }
];

const get = (id) => document.getElementById(id);
const buttons = [...document.querySelectorAll('[data-project]')];
const range = get('study-range');
const imageStudy = get('image-study');
const imageStack = get('image-stack');
const colourImage = get('colour-image');
const monoImage = get('mono-image');
const projectCopy = get('project-copy');
const dialog = get('brief-dialog');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let selectedIndex = 0;
let requestedIndex = 0;
let selectionVersion = 0;

function updateStudy() {
  const value = Number(range.value);
  imageStudy.style.setProperty('--split', `${value}%`);
  range.setAttribute('aria-valuetext', `${value}% monochrome study, ${100 - value}% colour photograph`);
  get('study-value').value = `${value}% mono`;
}
range.addEventListener('input', updateStudy);
updateStudy();
function pointerStudy(event) {
  const rect = imageStudy.getBoundingClientRect();
  range.value = Math.max(0, Math.min(100, Math.round((event.clientX - rect.left) / rect.width * 100)));
  updateStudy();
}
imageStudy.addEventListener('pointerdown', (event) => {
  if (!event.isPrimary || event.button !== 0) return;
  imageStudy.setPointerCapture(event.pointerId);
  pointerStudy(event);
});
imageStudy.addEventListener('pointermove', (event) => {
  if (imageStudy.hasPointerCapture(event.pointerId)) pointerStudy(event);
});
imageStudy.addEventListener('pointerup', (event) => {
  if (imageStudy.hasPointerCapture(event.pointerId)) imageStudy.releasePointerCapture(event.pointerId);
});

function populateBrief(project, index) {
  get('brief-index').textContent = `F / F — 00${index + 1}`;
  get('brief-title').textContent = project.name;
  get('brief-introduction').textContent = project.title.join(' ');
  ['study', 'focus', 'question', 'approach', 'reference'].forEach((key) => {
    get(`brief-${key}`).textContent = project[key];
  });
}
function populateProject(project, index) {
  get('project-number').textContent = `0${index + 1}`;
  get('project-code').textContent = `00${index + 1}`;
  get('image-index').textContent = `0${index + 1}`;
  get('project-name').textContent = project.name;
  projectCopy.dataset.study = String(index);
  get('project-type').textContent = project.type;
  get('project-title').replaceChildren(document.createTextNode(project.title[0]), document.createElement('br'), document.createTextNode(project.title[1]));
  get('project-description').textContent = project.description;
  colourImage.src = project.image;
  colourImage.alt = project.alt;
  monoImage.src = project.image;
  colourImage.style.objectPosition = project.position;
  monoImage.style.objectPosition = project.position;
  get('image-credit').textContent = `${project.photographer} / Unsplash`;
  get('image-credit').href = project.source;
  get('photo-place').textContent = project.place;
  buttons.forEach((button, buttonIndex) => {
    const active = index === buttonIndex;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  selectedIndex = index;
  populateBrief(project, index);
  get('project-status').textContent = `${project.name} selected. ${project.title.join(' ')}`;
}
async function selectProject(index) {
  if (requestedIndex === index) return;
  requestedIndex = index;
  const version = ++selectionVersion;
  const project = projects[index];
  imageStudy.setAttribute('aria-busy', 'true');
  const preload = new Image();
  preload.src = project.image;
  try { await preload.decode(); } catch {
    if (version !== selectionVersion) return;
    requestedIndex = selectedIndex;
    imageStudy.removeAttribute('aria-busy');
    get('project-status').textContent = 'That photograph could not be loaded. Please try selecting the study again.';
    return;
  }
  if (version !== selectionVersion) return;
  imageStack.getAnimations().forEach((animation) => animation.cancel());
  projectCopy.getAnimations().forEach((animation) => animation.cancel());
  if (!reducedMotion.matches) {
    const outgoing = [imageStack, projectCopy].map((element) => element.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 150, fill: 'forwards' }));
    await Promise.allSettled(outgoing.map((animation) => animation.finished));
    if (version !== selectionVersion) return;
    outgoing.forEach((animation) => animation.cancel());
  }
  populateProject(project, index);
  imageStudy.removeAttribute('aria-busy');
  if (!reducedMotion.matches) {
    imageStack.animate([{ opacity: 0, transform: 'scale(1.025)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 480, easing: 'cubic-bezier(.2,.7,.2,1)' });
    projectCopy.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 360, easing: 'ease-out' });
  }
}
buttons.forEach((button) => button.addEventListener('click', () => selectProject(Number(button.dataset.project))));
get('open-brief').addEventListener('click', () => {
  populateBrief(projects[selectedIndex], selectedIndex);
  dialog.showModal();
});
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  const rect = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
});
dialog.addEventListener('close', () => get('open-brief').focus({ preventScroll: true }));


// Native scroll supplies progress. Frames are scheduled only by actual input or layout changes.
const opening = get('opening');
const openingStage = opening.querySelector('.intro-stage');
const sequence = get('field-notes');
const sequenceStage = sequence.querySelector('.sequence-stage');
const spatialWords = [...document.querySelectorAll('[data-spatial-word]')];
let motionFrame = null;
let previousOpeningProgress = -1;
let previousSequenceProgress = -1;
let activeSpatialNote = -1;
const clampUnit = (value) => Math.max(0, Math.min(1, value));
const segment = (progress, start, end) => clampUnit((progress - start) / (end - start));
const easeOut = (value) => 1 - (1 - value) ** 3;

function writeMotionValues(element, values) {
  for (const [name, value] of Object.entries(values)) element.style.setProperty(name, value);
}
function renderScrollMotion() {
  motionFrame = null;
  if (reducedMotion.matches || document.hidden) return;
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;
  // Read both rectangles before writing styles to avoid layout thrashing.
  const openingRect = opening.getBoundingClientRect();
  const sequenceRect = sequence.getBoundingClientRect();
  const introProgress = clampUnit(-openingRect.top / Math.max(1, openingRect.height - viewportHeight));
  const notesProgress = clampUnit(-sequenceRect.top / Math.max(1, sequenceRect.height - viewportHeight));
  if (Math.abs(introProgress - previousOpeningProgress) > 0.0002) {
    previousOpeningProgress = introProgress;
    const apertureProgress = easeOut(segment(introProgress, 0.03, 0.8));
    const captionProgress = easeOut(segment(introProgress, 0.1, 0.52));
    const compact = viewportWidth <= 760;
    writeMotionValues(openingStage, {
      '--field-x': `${-viewportWidth * (compact ? 0.19 : 0.24) * introProgress}px`,
      '--form-x': `${viewportWidth * (compact ? 0.19 : 0.24) * introProgress}px`,
      '--title-y': `${-viewportHeight * 0.095 * introProgress}px`,
      '--field-angle': `${-3 * introProgress}deg`,
      '--form-angle': `${3 * introProgress}deg`,
      '--slash-y': `${-viewportHeight * 0.13 * introProgress}px`,
      '--slash-angle': `${90 * introProgress}deg`,
      '--slash-opacity': String(1 - segment(introProgress, 0.35, 0.78)),
      '--aperture': `${(compact ? 17 : 24) * (1 - apertureProgress)}%`,
      '--photo-scale': String(1.32 - 0.27 * apertureProgress),
      '--photo-y': `${(introProgress - 0.5) * viewportHeight * 0.075}px`,
      '--caption-y': `${95 * (1 - captionProgress) - 30 * introProgress}px`,
      '--caption-opacity': String(captionProgress),
      '--credit-y': `${25 * (1 - captionProgress)}px`,
      '--credit-opacity': String(captionProgress),
      '--cue-scale': String(1 - introProgress * 0.7),
      '--scroll-hint-opacity': String(1 - segment(introProgress, 0.04, 0.2)),
      '--opening-progress': String(introProgress)
    });
    openingStage.dataset.scrollProgress = introProgress.toFixed(3);
  }
  if (Math.abs(notesProgress - previousSequenceProgress) > 0.0002) {
    previousSequenceProgress = notesProgress;
    const secondSheet = segment(notesProgress, 0.13, 0.5);
    const thirdSheet = segment(notesProgress, 0.52, 0.9);
    writeMotionValues(sequenceStage, {
      '--sheet-one-y': `${-22 * secondSheet}px`,
      '--sheet-one-scale': String(1 - 0.08 * secondSheet),
      '--sheet-one-angle': `${-2 - 4 * secondSheet}deg`,
      '--sheet-one-light': String(1 - 0.18 * secondSheet),
      '--sheet-two-y': `${(1 - secondSheet) * 125 - thirdSheet * 2}%`,
      '--sheet-two-scale': String(1 - 0.06 * thirdSheet),
      '--sheet-two-angle': `${5 * (1 - secondSheet) - 3 * thirdSheet}deg`,
      '--sheet-two-light': String(1 - 0.14 * thirdSheet),
      '--sheet-three-y': `${(1 - thirdSheet) * 130}%`,
      '--sheet-three-angle': `${7 * (1 - thirdSheet) + thirdSheet * 0.7}deg`,
      '--sheet-image-scale': String(1.12 - notesProgress * 0.12),
      '--sequence-progress': String(notesProgress)
    });
    const note = notesProgress >= 0.73 ? 2 : notesProgress >= 0.33 ? 1 : 0;
    if (note !== activeSpatialNote) {
      activeSpatialNote = note;
      spatialWords.forEach((word, index) => word.classList.toggle('is-current', index === note));
      get('sequence-current').textContent = `0${note + 1}`;
      sequenceStage.dataset.activeNote = String(note + 1);
    }
    sequenceStage.dataset.scrollProgress = notesProgress.toFixed(3);
  }
}
function scheduleScrollMotion() {
  if (motionFrame !== null || reducedMotion.matches || document.hidden) return;
  motionFrame = window.requestAnimationFrame(renderScrollMotion);
}
function refreshScrollMotion() {
  previousOpeningProgress = -1;
  previousSequenceProgress = -1;
  scheduleScrollMotion();
}
function configureScrollMotion() {
  if (motionFrame !== null) window.cancelAnimationFrame(motionFrame);
  motionFrame = null;
  document.documentElement.classList.toggle('motion-ready', !reducedMotion.matches);
  if (reducedMotion.matches) {
    [imageStack, projectCopy].forEach((element) => element.getAnimations().forEach((animation) => animation.cancel()));
    [openingStage, sequenceStage].forEach((element) => {
      element.removeAttribute('style');
      delete element.dataset.scrollProgress;
    });
  } else refreshScrollMotion();
}
window.addEventListener('scroll', scheduleScrollMotion, { passive: true });
window.addEventListener('resize', refreshScrollMotion, { passive: true });
window.addEventListener('load', refreshScrollMotion, { once: true });
window.addEventListener('pageshow', refreshScrollMotion);
reducedMotion.addEventListener('change', configureScrollMotion);
document.addEventListener('visibilitychange', () => {
  if (document.hidden && motionFrame !== null) {
    window.cancelAnimationFrame(motionFrame);
    motionFrame = null;
  } else scheduleScrollMotion();
});
if (document.fonts) document.fonts.ready.then(refreshScrollMotion);
configureScrollMotion();
