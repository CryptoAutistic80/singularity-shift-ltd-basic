const form = document.querySelector("#configuration-form");
const viewer = document.querySelector("#lamp-viewer");
const canvas = document.querySelector("#lamp-canvas");
const resetButton = document.querySelector("#reset-view");
const brightnessInput = document.querySelector("#brightness");
const savedPanel = document.querySelector("#saved-configuration");
const finishNames = { porcelain: "Porcelain", graphite: "Graphite", iris: "Iris" };
const finishColours = { porcelain: "#dfded5", graphite: "#434750", iris: "#a4a3c9" };
const shapeNames = { dome: "Dome", pleat: "Pleat" };
const storageKey = "sshift-luma-concept-v1";
let state = { finish: "iris", shape: "dome", brightness: 70 };
let saved = null;
let lamp = null;
const experience = document.querySelector("#object-experience");
const storyStage = document.querySelector("#object-stage");
const chapters = document.querySelector("#anatomy");
const componentLabels = [...document.querySelectorAll("[data-component]")];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const roomyViewport = window.matchMedia("(min-width: 901px) and (min-height: 650px)");
let scrollSceneEnabled = false;
let storyFrame = 0;
const clamp01 = (number) => Math.max(0, Math.min(1, number));
const smoothstep = (start, end, value) => {
  const amount = clamp01((value - start) / (end - start));
  return amount * amount * (3 - 2 * amount);
};

function updateScrollStory() {
  storyFrame = 0;
  if (!scrollSceneEnabled || document.hidden) return;
  const chapterBounds = chapters.getBoundingClientRect();
  const experienceBounds = experience.getBoundingClientRect();
  const viewport = window.innerHeight;
  const travel = chapterBounds.height - viewport * 0.15;
  const progress = clamp01((viewport * 0.85 - chapterBounds.top) / Math.max(1, travel));
  const introTravel = Math.max(1, chapterBounds.top - experienceBounds.top - viewport * 0.85 + 20);
  const intro = clamp01((20 - experienceBounds.top) / introTravel);
  const chapter = progress < 0.37 ? 0 : progress < 0.77 ? 1 : 2;
  storyStage.style.setProperty("--scene-progress", String(progress));
  storyStage.style.setProperty("--word-shift", `${-progress * 110 - intro * 20}px`);
  storyStage.style.setProperty("--word-scale", String(1 + progress * 0.2));
  storyStage.style.setProperty("--word-opacity", String(1 - smoothstep(0.1, 0.55, progress) * 0.65));
  storyStage.dataset.storyProgress = progress.toFixed(3);
  experience.dataset.storyProgress = progress.toFixed(3);
  document.querySelector("#scene-chapter-number").textContent = String(chapter + 1).padStart(2, "0");
  document.querySelector("#scene-chapter-name").textContent =
    ["A different perspective", "Every part. Nothing extra.", "Yours. In one piece."][chapter];
  lamp?.setStory(progress, intro, true);
}

function scheduleScrollStory() {
  if (scrollSceneEnabled && !storyFrame && !document.hidden) storyFrame = requestAnimationFrame(updateScrollStory);
}

function syncScrollMode() {
  scrollSceneEnabled = Boolean(lamp) && roomyViewport.matches && !reducedMotion.matches;
  document.body.classList.toggle("scroll-scene", scrollSceneEnabled);
  experience.dataset.storyEnabled = String(scrollSceneEnabled);
  document.querySelector(".scroll-invitation-copy").textContent = scrollSceneEnabled
    ? "Scroll to turn it. Keep going to take it apart."
    : "Explore the object, then discover its story.";
  if (scrollSceneEnabled) {
    scheduleScrollStory();
  } else {
    cancelAnimationFrame(storyFrame);
    storyFrame = 0;
    storyStage.dataset.storyProgress = "0";
    experience.dataset.storyProgress = "0";
    storyStage.style.setProperty("--scene-progress", "0");
    lamp?.setStory(0, 0, false);
  }
}

try {
  const previous = JSON.parse(localStorage.getItem(storageKey));
  if (previous && Object.hasOwn(finishNames, previous.finish) && Object.hasOwn(shapeNames, previous.shape) &&
      Number.isFinite(previous.brightness) && previous.brightness >= 0 && previous.brightness <= 100) {
    saved = { finish: previous.finish, shape: previous.shape, brightness: Math.round(previous.brightness) };
    state = { ...saved };
  }
} catch {
  // The experience still works when browser storage is unavailable.
}

function shadeColour(hex, amount) {
  const value = Number.parseInt(hex.slice(1), 16);
  const base = amount > 0 ? 255 : 0;
  const amountAbs = Math.abs(amount);
  return "#" + [value >> 16, (value >> 8) & 255, value & 255]
    .map((component) => Math.round(component + (base - component) * amountAbs).toString(16).padStart(2, "0")).join("");
}

function describe(configuration) {
  return `${finishNames[configuration.finish]} finish · ${shapeNames[configuration.shape]} shade · ${configuration.brightness}% light`;
}

function updateFallback() {
  const colour = finishColours[state.finish];
  const stops = document.querySelectorAll("#fallback-finish stop");
  [-0.2, 0.2, 0, -0.3].forEach((amount, index) => stops[index].setAttribute("stop-color", shadeColour(colour, amount)));
  document.querySelector("#fallback-light").setAttribute("opacity", String(state.brightness / 100));
  document.querySelector("#fallback-shade").setAttribute("d", state.shape === "dome"
    ? "M146 309 C151 209 209 166 300 166 C391 166 449 209 454 309 Q300 354 146 309Z"
    : "M146 309 L222 176 Q300 159 378 176 L454 309 Q300 354 146 309Z");
  document.querySelector(".fallback-svg").setAttribute("aria-label", `${finishNames[state.finish]} table lamp with a ${shapeNames[state.shape].toLowerCase()} shade`);
}

function updateControls() {
  form.querySelector(`input[name="finish"][value="${state.finish}"]`).checked = true;
  form.querySelector(`input[name="shape"][value="${state.shape}"]`).checked = true;
  brightnessInput.value = String(state.brightness);
  brightnessInput.style.setProperty("--progress", `${state.brightness}%`);
  document.querySelector("#brightness-value").value = `${state.brightness}%`;
  document.querySelector("#finish-label").textContent = finishNames[state.finish];
  document.querySelector("#stage-finish").textContent = finishNames[state.finish];
  document.querySelector("#stage-form").textContent = shapeNames[state.shape];
  updateFallback();
  lamp?.update(state);
}

function showSaved(configuration, persisted) {
  savedPanel.hidden = false;
  document.querySelector("#saved-description").textContent = describe(configuration);
  document.querySelector("#save-location").textContent = persisted
    ? "Saved in this browser for your next visit."
    : "Kept for this visit. Browser storage is unavailable.";
}

form.addEventListener("input", (event) => {
  const { name, value } = event.target;
  if (name === "finish" && Object.hasOwn(finishNames, value)) state.finish = value;
  if (name === "shape" && Object.hasOwn(shapeNames, value)) state.shape = value;
  if (name === "brightness") state.brightness = Math.max(0, Math.min(100, Number(value)));
  updateControls();
  if (saved) savedPanel.querySelector("strong").textContent =
    describe(saved) === describe(state) ? "Your combination, kept." : "Your previous combination, kept.";
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  saved = { ...state };
  let persisted = false;
  try {
    localStorage.setItem(storageKey, JSON.stringify(saved));
    persisted = true;
  } catch {
    // Saving remains useful for this visit even without persistent storage.
  }
  savedPanel.querySelector("strong").textContent = "Your combination, kept.";
  showSaved(saved, persisted);
});

resetButton.disabled = true;
updateControls();
if (saved) showSaved(saved, true);

function showStaticPreview() {
  lamp = null;
  scrollSceneEnabled = false;
  document.body.classList.remove("scroll-scene");
  experience.dataset.storyEnabled = "false";
  document.querySelector(".scroll-invitation-copy").textContent = "Explore the object, then discover its story.";
  viewer.classList.remove("is-ready", "is-dragging");
  viewer.removeAttribute("tabindex");
  viewer.setAttribute("aria-label", "Static preview of your configured lamp.");
  document.querySelector("#viewer-instruction").textContent = "Your lamp, in preview";
  document.querySelector("#view-status").textContent = "3D is unavailable here. Your finish, silhouette and light controls still work with the illustrated preview.";
  resetButton.disabled = true;
}

async function initialiseLamp() {
  const THREE = await import("../../assets/vendor/three.module.js");
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(31, 1, 0.1, 50);
  const target = new THREE.Vector3(0, 1.43, 0);
  const initialAngle = { yaw: 0.42, pitch: 0.19 };
  let yaw = initialAngle.yaw;
  let pitch = initialAngle.pitch;
  let frame = 0;
  let visible = true;
  let failed = false;
  let activeShape = "";
  let shade = null;
  let dragging = null;
  let viewportSize = { width: 0, height: 0 };
  let storyProgress = 0;
  let storyIntro = 0;
  let storyActive = false;
  let explosion = 0;
  let storyTurn = 0;

  // A small generated studio environment gives the curved surface soft reflections.
  const environmentCanvas = document.createElement("canvas");
  environmentCanvas.width = 1024;
  environmentCanvas.height = 512;
  const environmentContext = environmentCanvas.getContext("2d");
  const environmentGradient = environmentContext.createLinearGradient(0, 0, 0, 512);
  environmentGradient.addColorStop(0, "#f6f5f3");
  environmentGradient.addColorStop(0.45, "#b7b6bd");
  environmentGradient.addColorStop(1, "#686873");
  environmentContext.fillStyle = environmentGradient;
  environmentContext.fillRect(0, 0, 1024, 512);
  environmentContext.fillStyle = "#ffffff";
  environmentContext.fillRect(150, 90, 160, 220);
  environmentContext.fillStyle = "#eeedf9";
  environmentContext.fillRect(720, 130, 110, 220);
  environmentContext.fillStyle = "#65656f";
  environmentContext.fillRect(480, 120, 85, 220);
  const environmentTexture = new THREE.CanvasTexture(environmentCanvas);
  environmentTexture.mapping = THREE.EquirectangularReflectionMapping;
  environmentTexture.colorSpace = THREE.SRGBColorSpace;
  const environmentGenerator = new THREE.PMREMGenerator(renderer);
  const environmentTarget = environmentGenerator.fromEquirectangular(environmentTexture);
  scene.environment = environmentTarget.texture;
  environmentTexture.dispose();
  environmentGenerator.dispose();

  scene.add(new THREE.HemisphereLight(0xffffff, 0x74707d, 2.15));
  const keyLight = new THREE.DirectionalLight(0xffffff, 3.3);
  keyLight.position.set(-3.5, 7, 4.5);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(2048, 2048);
  keyLight.shadow.camera.left = -4;
  keyLight.shadow.camera.right = 4;
  keyLight.shadow.camera.top = 4;
  keyLight.shadow.camera.bottom = -4;
  keyLight.shadow.camera.near = 0.1;
  keyLight.shadow.camera.far = 16;
  keyLight.shadow.normalBias = 0.035;
  keyLight.shadow.bias = -0.0002;
  keyLight.shadow.radius = 5;
  scene.add(keyLight);
  const fillLight = new THREE.DirectionalLight(0xd1d0ef, 1.25);
  fillLight.position.set(4, 3, -3);
  scene.add(fillLight);

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.ShadowMaterial({ color: 0x3f3e49, opacity: 0.18 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.003;
  floor.receiveShadow = true;
  scene.add(floor);

  const glowCanvas = document.createElement("canvas");
  glowCanvas.width = glowCanvas.height = 256;
  const glowContext = glowCanvas.getContext("2d");
  const glowGradient = glowContext.createRadialGradient(128, 128, 8, 128, 128, 128);
  glowGradient.addColorStop(0, "rgba(255,249,223,0.8)");
  glowGradient.addColorStop(0.28, "rgba(255,249,223,0.55)");
  glowGradient.addColorStop(0.72, "rgba(255,249,223,0.14)");
  glowGradient.addColorStop(1, "rgba(255,249,223,0)");
  glowContext.fillStyle = glowGradient;
  glowContext.fillRect(0, 0, 256, 256);
  const glowTexture = new THREE.CanvasTexture(glowCanvas);
  glowTexture.colorSpace = THREE.SRGBColorSpace;
  const glowMaterial = new THREE.MeshBasicMaterial({ map: glowTexture, transparent: true, depthWrite: false, opacity: 0.7 });
  const lightPool = new THREE.Mesh(new THREE.PlaneGeometry(4.5, 4.5), glowMaterial);
  lightPool.rotation.x = -Math.PI / 2;
  lightPool.position.y = 0.004;
  scene.add(lightPool);

  const bodyMaterial = new THREE.MeshPhysicalMaterial({
    color: finishColours[state.finish], metalness: 0.19, roughness: 0.31,
    clearcoat: 0.28, clearcoatRoughness: 0.3, envMapIntensity: 0.7
  });
  const stemMaterial = new THREE.MeshStandardMaterial({
    color: finishColours[state.finish], metalness: 0.5, roughness: 0.32, envMapIntensity: 0.65
  });
  const trimMaterial = new THREE.MeshStandardMaterial({
    color: 0xaaaab0, metalness: 0.85, roughness: 0.3, envMapIntensity: 0.6
  });
  const diffuserMaterial = new THREE.MeshStandardMaterial({
    color: 0xf0efdf, roughness: 0.7, metalness: 0,
    emissive: 0xffedbe, emissiveIntensity: 1.2, side: THREE.DoubleSide
  });
  const pleatMaterial = bodyMaterial.clone();
  pleatMaterial.roughness = 0.5;
  pleatMaterial.metalness = 0.08;
  pleatMaterial.flatShading = true;
  pleatMaterial.side = THREE.DoubleSide;

  const lampGroup = new THREE.Group();
  scene.add(lampGroup);
  const vectorPoints = (values) => values.map(([x, y]) => new THREE.Vector2(x, y));
  const baseProfile = vectorPoints([[0, 0.03], [0.5, 0.03], [0.61, 0.05], [0.655, 0.08], [0.668, 0.12], [0.651, 0.16], [0.59, 0.19], [0.41, 0.215], [0, 0.218]]);
  const base = new THREE.Mesh(new THREE.LatheGeometry(baseProfile, 96), bodyMaterial);
  base.castShadow = true;
  base.receiveShadow = true;
  lampGroup.add(base);
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.064, 0.076, 1.9, 48), stemMaterial);
  stem.position.y = 1.16;
  stem.castShadow = true;
  stem.receiveShadow = true;
  lampGroup.add(stem);
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.14, 48), trimMaterial);
  collar.position.y = 2.04;
  collar.castShadow = true;
  lampGroup.add(collar);
  const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.067, 0.067, 0.038, 48), trimMaterial);
  knob.rotation.x = Math.PI / 2;
  knob.position.set(0.04, 0.116, 0.657);
  lampGroup.add(knob);

  const cableCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.08, -0.6), new THREE.Vector3(0.14, 0.025, -0.87),
    new THREE.Vector3(0.87, 0.025, -1.2), new THREE.Vector3(1.45, 0.025, -0.95),
    new THREE.Vector3(1.7, 0.025, -1.25), new THREE.Vector3(1.51, 0.025, -1.49)
  ]);
  const cable = new THREE.Mesh(new THREE.TubeGeometry(cableCurve, 80, 0.018, 8, false),
    new THREE.MeshStandardMaterial({ color: 0x77777c, roughness: 0.85 }));
  cable.castShadow = true;
  lampGroup.add(cable);

  const diffuser = new THREE.Mesh(new THREE.CircleGeometry(1.105, 96), diffuserMaterial);
  diffuser.rotation.x = Math.PI / 2;
  diffuser.position.y = 2.064;
  lampGroup.add(diffuser);
  const bulbLight = new THREE.PointLight(0xfff3d4, 8, 5, 2);
  bulbLight.position.set(0, 1.94, 0);
  lampGroup.add(bulbLight);

  const guideGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0.24, 0), new THREE.Vector3(0, 4.2, 0)
  ]);
  const guideMaterial = new THREE.LineDashedMaterial({
    color: 0x8e849e, dashSize: 0.035, gapSize: 0.045, transparent: true, opacity: 0
  });
  const assemblyGuide = new THREE.Line(guideGeometry, guideMaterial);
  assemblyGuide.computeLineDistances();
  lampGroup.add(assemblyGuide);

  function domeGeometry() {
    const profile = vectorPoints([[1.1, 2.057], [1.15, 2.061], [1.177, 2.08], [1.18, 2.105]]);
    for (let step = 0; step <= 40; step++) {
      const angle = (step / 40) * Math.PI / 2;
      profile.push(new THREE.Vector2(Math.cos(angle) * 1.18, 2.11 + Math.sin(angle) * 0.78));
    }
    profile.push(new THREE.Vector2(0, 2.89));
    return new THREE.LatheGeometry(profile, 128);
  }

  function pleatGeometry() {
    const vertices = [];
    const segments = 128;
    const levelCount = 10;
    function point(segment, level) {
      const t = level / levelCount;
      const angle = segment / segments * Math.PI * 2;
      const ridge = segment % 2 === 0 ? 0.018 : -0.018;
      const edge = Math.sin(Math.PI * t) * 0.018;
      const radius = 1.18 - t * 0.59 + ridge * (1 - t * 0.4) + edge;
      return [Math.cos(angle) * radius, 2.07 + t * 0.83, Math.sin(angle) * radius];
    }
    for (let segment = 0; segment < segments; segment++) {
      for (let level = 0; level < levelCount; level++) {
        const a = point(segment, level);
        const b = point(segment + 1, level);
        const c = point(segment + 1, level + 1);
        const d = point(segment, level + 1);
        vertices.push(...a, ...d, ...b, ...b, ...d, ...c);
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    geometry.computeVertexNormals();
    return geometry;
  }

  function changeShape(shapeName) {
    if (shade) {
      lampGroup.remove(shade);
      shade.traverse((object) => object.geometry?.dispose());
    }
    shade = new THREE.Group();
    const shadeBody = new THREE.Mesh(shapeName === "dome" ? domeGeometry() : pleatGeometry(),
      shapeName === "dome" ? bodyMaterial : pleatMaterial);
    shadeBody.castShadow = true;
    shadeBody.receiveShadow = true;
    shade.add(shadeBody);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(1.142, 0.012, 10, 128), stemMaterial);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 2.064;
    shade.add(rim);
    if (shapeName === "pleat") {
      const top = new THREE.Mesh(new THREE.CircleGeometry(0.58, 96), bodyMaterial);
      top.rotation.x = -Math.PI / 2;
      top.position.y = 2.895;
      shade.add(top);
      const topRim = new THREE.Mesh(new THREE.TorusGeometry(0.59, 0.014, 10, 96), bodyMaterial);
      topRim.rotation.x = Math.PI / 2;
      topRim.position.y = 2.895;
      shade.add(topRim);
    }
    lampGroup.add(shade);
    activeShape = shapeName;
  }

  function moveCamera() {
    const verticalDistance = 8.05 + explosion * 3.3;
    const horizontalDistance = (3.2 + explosion * 0.3) /
      (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * camera.aspect);
    const distance = Math.max(verticalDistance, horizontalDistance);
    const orbit = yaw + storyTurn;
    const elevation = Math.max(0.015, Math.min(0.7, pitch + explosion * 0.08));
    target.y = 1.43 + explosion * 0.88;
    camera.position.set(Math.sin(orbit) * Math.cos(elevation) * distance,
      target.y + Math.sin(elevation) * distance, Math.cos(orbit) * Math.cos(elevation) * distance);
    camera.lookAt(target);
  }

  function applyStoryPose() {
    explosion = storyActive
      ? smoothstep(0.16, 0.46, storyProgress) * (1 - smoothstep(0.7, 0.94, storyProgress))
      : 0;
    storyTurn = storyActive ? storyIntro * Math.PI * 0.5 + storyProgress * Math.PI * 1.5 : 0;
    if (shade) {
      shade.position.set(-0.16 * explosion, 1.95 * explosion, 0);
      shade.rotation.z = -0.055 * explosion;
    }
    diffuser.position.set(-0.12 * explosion, 2.064 + 0.95 * explosion, 0);
    diffuser.rotation.z = 0.07 * explosion;
    stem.position.y = 1.16 + 0.22 * explosion;
    collar.position.y = 2.04 + 0.49 * explosion;
    bulbLight.position.y = 1.94 + 0.42 * explosion;
    bulbLight.intensity = state.brightness / 100 * 10 * (1 - explosion * 0.55);
    glowMaterial.opacity = state.brightness / 100 * 0.72 * (1 - explosion * 0.75);
    guideMaterial.opacity = explosion * 0.46;
    assemblyGuide.visible = explosion > 0.01;
    storyStage.dataset.explosion = explosion.toFixed(3);
    storyStage.style.setProperty("--assembly-label-opacity", String(smoothstep(0.42, 0.87, explosion)));
    moveCamera();
  }

  function positionComponentLabels() {
    if (explosion < 0.01) return;
    camera.updateMatrixWorld();
    for (const label of componentLabels) {
      const heights = { shade: 2.56 + shade.position.y, diffuser: diffuser.position.y, base: 0.14 };
      const point = new THREE.Vector3(0, heights[label.dataset.component], 0).project(camera);
      const top = Math.max(12, Math.min(85, (1 - point.y) * 50));
      label.style.top = `${top.toFixed(2)}%`;
    }
  }

  function render() {
    frame = 0;
    if (failed || !visible || document.hidden) return;
    try {
      renderer.render(scene, camera);
      positionComponentLabels();
      viewer.classList.add("is-ready");
    } catch {
      failed = true;
      showStaticPreview();
    }
  }

  function scheduleRender() {
    if (!frame && !failed && visible && !document.hidden) frame = requestAnimationFrame(render);
  }

  function resize() {
    const width = viewer.clientWidth;
    const height = viewer.clientHeight;
    if (!width || !height || (width === viewportSize.width && height === viewportSize.height)) return;
    viewportSize = { width, height };
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    moveCamera();
    renderer.setSize(width, height, false);
    scheduleRender();
  }

  const api = {
    update(configuration) {
      if (failed) return;
      bodyMaterial.color.set(finishColours[configuration.finish]);
      stemMaterial.color.set(finishColours[configuration.finish]);
      pleatMaterial.color.set(finishColours[configuration.finish]);
      const level = configuration.brightness / 100;
      bulbLight.intensity = level * 10;
      diffuserMaterial.emissiveIntensity = level * 1.7;
      glowMaterial.opacity = level * 0.72;
      if (activeShape !== configuration.shape) changeShape(configuration.shape);
      applyStoryPose();
      scheduleRender();
    },
    setStory(progress, intro, enabled) {
      if (failed) return;
      storyProgress = progress;
      storyIntro = intro;
      storyActive = enabled;
      applyStoryPose();
      scheduleRender();
    },
    reset() {
      yaw = initialAngle.yaw;
      pitch = initialAngle.pitch;
      moveCamera();
      scheduleRender();
      document.querySelector("#view-status").textContent = "Viewing angle reset.";
    }
  };

  viewer.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || failed) return;
    dragging = { id: event.pointerId, x: event.clientX, y: event.clientY };
    viewer.setPointerCapture(event.pointerId);
    viewer.classList.add("is-dragging");
  });
  viewer.addEventListener("pointermove", (event) => {
    if (!dragging || dragging.id !== event.pointerId) return;
    yaw -= (event.clientX - dragging.x) * 0.008;
    pitch = Math.max(0.015, Math.min(0.65, pitch + (event.clientY - dragging.y) * 0.004));
    dragging.x = event.clientX;
    dragging.y = event.clientY;
    moveCamera();
    scheduleRender();
  });
  function stopDragging() {
    dragging = null;
    viewer.classList.remove("is-dragging");
  }
  viewer.addEventListener("pointerup", stopDragging);
  viewer.addEventListener("pointercancel", stopDragging);
  viewer.addEventListener("lostpointercapture", stopDragging);
  viewer.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home"].includes(event.key) || failed) return;
    event.preventDefault();
    if (event.key === "Home") { api.reset(); return; }
    if (event.key === "ArrowLeft") yaw += 0.13;
    if (event.key === "ArrowRight") yaw -= 0.13;
    if (event.key === "ArrowUp") pitch = Math.min(0.65, pitch + 0.06);
    if (event.key === "ArrowDown") pitch = Math.max(0.015, pitch - 0.06);
    moveCamera();
    scheduleRender();
  });
  canvas.addEventListener("webglcontextlost", (event) => {
    event.preventDefault();
    failed = true;
    showStaticPreview();
  });
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(viewer);
  const intersectionObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) scheduleRender();
  }, { rootMargin: "100px" });
  intersectionObserver.observe(viewer);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) scheduleRender(); });
  window.addEventListener("pagehide", (event) => {
    if (event.persisted) return;
    cancelAnimationFrame(frame);
    cancelAnimationFrame(storyFrame);
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    scene.traverse((object) => {
      object.geometry?.dispose();
      if (object.material) {
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => material.dispose());
      }
    });
    glowTexture.dispose();
    environmentTarget.dispose();
    renderer.dispose();
  }, { once: true });

  moveCamera();
  resize();
  api.update(state);
  resetButton.disabled = false;
  resetButton.addEventListener("click", () => api.reset());
  return api;
}

// Native scrolling changes a pose directly; there is no animation loop or scroll interception.
window.addEventListener("scroll", scheduleScrollStory, { passive: true });
window.addEventListener("resize", scheduleScrollStory, { passive: true });
document.addEventListener("visibilitychange", scheduleScrollStory);
reducedMotion.addEventListener("change", syncScrollMode);
roomyViewport.addEventListener("change", syncScrollMode);
initialiseLamp().then((api) => {
  lamp = api;
  lamp.update(state);
  syncScrollMode();
}).catch(showStaticPreview);
