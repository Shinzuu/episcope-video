// 3D scenes on two slides, drawn with three.js r180 (MIT, vendored unchanged in assets/vendor/three-0.180.0).
//   Title slide: the 64 districts at their centroids, each bar as tall as its 2022 census population.
//   Slide 20: share of need met at every budget and equity floor, our plan against the population split.
// Every value comes from assets/data.js. A scene renders only while its slide is active (and the tab is visible),
// fades and grows in over about one second, then turns slowly. With no WebGL, or with prefers-reduced-motion,
// the static SVG under each canvas is shown instead. Canvases ignore the pointer, so keys, clicks and swipes
// still reach the deck.
import * as THREE from "./vendor/three-0.180.0/three.module.min.js";

const D = window.EPI_DATA;
const root = document.documentElement;
const figs = [...document.querySelectorAll(".scene3d")];
const css = (name) => getComputedStyle(root).getPropertyValue(name).trim();
const ease = (x) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);
const FRAME_MS = 1000 / 30; // 30 fps is plenty for a slow turn and halves the GPU work

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch (_) {
    return false;
  }
}

function fallback() {
  root.classList.remove("has3d");
  figs.forEach((f) => { f.classList.remove("on"); f.classList.add("no3d"); });
}

// Text as a camera-facing sprite. h is the text height in world units.
function label(text, { h = 0.2, color = css("--ink"), weight = 700 } = {}) {
  const font = `${weight} 64px ${getComputedStyle(document.body).fontFamily}`;
  const c = document.createElement("canvas");
  const g = c.getContext("2d");
  g.font = font;
  c.width = Math.ceil(g.measureText(text).width) + 16;
  c.height = 84;
  g.font = font;
  g.fillStyle = color;
  g.textBaseline = "middle";
  g.fillText(text, 8, 44);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false, opacity: 0 }));
  sp.scale.set((h * c.width) / c.height, h, 1);
  sp.renderOrder = 10;
  return sp;
}

function lights(scene) {
  scene.add(new THREE.HemisphereLight(0xffffff, 0x8a9a9e, 1.7));
  const sun = new THREE.DirectionalLight(0xffffff, 1.5);
  sun.position.set(3, 7, 5);
  scene.add(sun);
}

// ---------- title: 64 districts, height = population ----------
function titleScene(scene, camera) {
  const ds = D.districts;
  const lonc = (Math.min(...ds.map((d) => d.lon)) + Math.max(...ds.map((d) => d.lon))) / 2;
  const latc = (Math.min(...ds.map((d) => d.lat)) + Math.max(...ds.map((d) => d.lat))) / 2;
  const pmax = Math.max(...ds.map((d) => d.pop));
  const geo = new THREE.BoxGeometry(0.17, 1, 0.17).translate(0, 0.5, 0);
  const mat = new THREE.MeshStandardMaterial({ roughness: 0.55, metalness: 0.05 });
  const plate = new THREE.MeshStandardMaterial({ roughness: 0.9, transparent: true, opacity: 0.35 });
  const group = new THREE.Group();
  const bars = ds.map((d) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(d.lon - lonc, 0, -(d.lat - latc));
    m.userData.h = 0.08 + (3.4 * d.pop) / pmax;
    m.scale.y = 0.0001;
    group.add(m);
    const foot = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.02, 0.3), plate);
    foot.position.copy(m.position);
    group.add(foot);
    return m;
  });
  scene.add(group);
  lights(scene);

  const top = ds.reduce((a, d) => (d.pop > a.pop ? d : a));
  const tag = label(`${top.name}: ${(top.pop / 1e6).toFixed(1)} million`, { h: 0.26 });
  tag.position.set(top.lon - lonc, 3.4 + 0.55, -(top.lat - latc));
  scene.add(tag);

  camera.fov = 30;
  const aim = new THREE.Vector3(0, 1.0, 0);
  return {
    recolor() { mat.color.set(css("--teal")); plate.color.set(css("--muted")); },
    update(t) {
      bars.forEach((m, i) => { m.scale.y = m.userData.h * ease((t - (i % 8) * 0.03) / 1.0); });
      tag.material.opacity = ease((t - 0.8) / 0.5);
      const az = -0.55 + 0.22 * Math.sin(t * 0.18);
      camera.position.set(Math.sin(az) * 10.5, 6.2, Math.cos(az) * 10.5);
      camera.lookAt(aim);
    },
  };
}

// ---------- slide 20: need met over budget x alpha ----------
function allocScene(scene, camera) {
  const G = D.curve_grid;
  const key = (v) => (Number.isInteger(v) ? v.toFixed(1) : String(v));
  const X = 4.2, Z = 3.0, Y = 2.4; // alpha 0..1 to x, budget index to z (front = smallest), percent to y
  const x = (a) => a * X - X / 2;
  const z = (i) => Z / 2 - (i * Z) / (G.budgets.length - 1);
  const y = (pct) => (pct / 100) * Y;

  function surface(value) {
    const pos = [];
    G.budgets.forEach((b, i) => G.alphas.forEach((a) => pos.push(x(a), y(value(b, a)), z(i))));
    const idx = [];
    const n = G.alphas.length;
    for (let i = 0; i < G.budgets.length - 1; i++) {
      for (let j = 0; j < n - 1; j++) {
        const p = i * n + j;
        idx.push(p, p + n, p + 1, p + 1, p + n, p + n + 1);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  }
  function gridLines(value) {
    const pts = [];
    G.budgets.forEach((b, i) => G.alphas.slice(1).forEach((a, j) => {
      const a0 = G.alphas[j];
      pts.push(x(a0), y(value(b, a0)) + 0.005, z(i), x(a), y(value(b, a)) + 0.005, z(i));
    }));
    G.alphas.forEach((a) => G.budgets.slice(1).forEach((b, i) => {
      const b0 = G.budgets[i];
      pts.push(x(a), y(value(b0, a)) + 0.005, z(i), x(a), y(value(b, a)) + 0.005, z(i + 1));
    }));
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }
  const lp = (b, a) => G.lp[`${key(b)}|${key(a)}`];
  const pop = (b) => G.baseline[key(b)];

  const lpMat = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, roughness: 0.6, transparent: true, opacity: 0.9 });
  const popMat = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, roughness: 0.7, transparent: true, opacity: 0.55 });
  const lineMat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.55 });
  const axisMat = new THREE.LineBasicMaterial();
  const grow = new THREE.Group();
  grow.add(new THREE.Mesh(surface(lp), lpMat));
  grow.add(new THREE.LineSegments(gridLines(lp), lineMat));
  grow.add(new THREE.Mesh(surface((b) => pop(b)), popMat));
  scene.add(grow);
  lights(scene);

  // floor frame and the vertical axis at the back left
  const fx = [-X / 2, X / 2], fz = [Z / 2, -Z / 2];
  const frame = [fx[0], 0, fz[0], fx[1], 0, fz[0], fx[1], 0, fz[0], fx[1], 0, fz[1], fx[0], 0, fz[1], fx[0], Y, fz[1]];
  for (const p of [50, 100]) frame.push(fx[0], y(p), fz[1], fx[1], y(p), fz[1]);
  const fg = new THREE.BufferGeometry();
  fg.setAttribute("position", new THREE.Float32BufferAttribute(frame, 3));
  scene.add(new THREE.LineSegments(fg, axisMat));

  // labels: ticks, axis names, and the two headline points at half the budget
  const labels = [];
  const put = (sp, px, py, pz) => { sp.position.set(px, py, pz); scene.add(sp); labels.push(sp); return sp; };
  const muted = css("--muted");
  [0, 0.5, 1].forEach((a) => put(label(a.toFixed(1), { h: 0.17, color: muted }), x(a), -0.12, fz[0] + 0.38));
  put(label("equity floor α", { h: 0.19 }), x(0.78), -0.12, fz[0] + 0.62);
  G.budgets.forEach((b, i) => put(label(`${key(b)}×`, { h: 0.18, color: muted }), fx[1] + 0.45, 0.05, z(i) - 0.12));
  put(label("budget", { h: 0.19 }), fx[1] + 0.55, 0.42, fz[1] - 0.1);
  [0, 50, 100].forEach((p) => put(label(`${p}%`, { h: 0.17, color: muted }), fx[0] - 0.35, y(p), fz[1]));
  put(label("need met", { h: 0.19 }), fx[0] - 0.25, Y + 0.35, fz[1]);

  const half = G.budgets.indexOf(0.5);
  const dot = new THREE.SphereGeometry(0.07, 20, 14);
  const lpDot = new THREE.Mesh(dot, new THREE.MeshStandardMaterial());
  const popDot = new THREE.Mesh(dot, new THREE.MeshStandardMaterial());
  lpDot.position.set(x(0), y(lp(0.5, 0)), z(half));
  popDot.position.set(x(0), y(pop(0.5)), z(half));
  grow.add(lpDot, popDot);
  const lpTag = put(label(`plan, α 0, half budget: ${lp(0.5, 0).toFixed(1)}%`, { h: 0.2 }), x(0) + 1.25, y(lp(0.5, 0)) + 0.32, z(half));
  const popTag = put(label(`population split: ${pop(0.5).toFixed(1)}%`, { h: 0.2 }), x(0) + 1.05, y(pop(0.5)) - 0.3, z(half));

  camera.fov = 30;
  const aim = new THREE.Vector3(0, 0.9, 0);
  return {
    recolor() {
      lpMat.color.set(css("--s4")); popMat.color.set(css("--alert")); lineMat.color.set(css("--ink"));
      axisMat.color.set(css("--muted")); lpDot.material.color.set(css("--ink")); popDot.material.color.set(css("--alert"));
      lpTag.material.color.set(0xffffff); popTag.material.color.set(0xffffff);
    },
    update(t) {
      grow.scale.y = Math.max(0.0001, ease(t / 1.0));
      labels.forEach((s) => { s.material.opacity = ease((t - 0.7) / 0.5); });
      const az = -0.5 + 0.14 * Math.sin(t * 0.2);
      camera.position.set(Math.sin(az) * 8.4, 3.1, Math.cos(az) * 8.4);
      camera.lookAt(aim);
    },
  };
}

function mount(fig, build) {
  // design size from the inline style: a hidden slide has no layout box yet
  const W = parseFloat(fig.style.width), H = parseFloat(fig.style.height);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
  const scale = () => fig.getBoundingClientRect().width / W || 1;
  renderer.setPixelRatio(Math.min(2, devicePixelRatio * scale()));
  renderer.setSize(W, H, false);
  renderer.domElement.setAttribute("aria-hidden", "true");
  fig.prepend(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, W / H, 0.1, 100);
  const s = build(scene, camera);
  let raf = 0, t0 = 0, last = 0;
  const tick = (now) => {
    raf = requestAnimationFrame(tick);
    if (now - last < FRAME_MS) return;
    last = now;
    s.update((now - t0) / 1000);
    renderer.render(scene, camera);
  };
  return {
    fig,
    running: () => raf !== 0,
    start() {
      if (raf) return;
      renderer.setPixelRatio(Math.min(2, devicePixelRatio * scale()));
      s.recolor();
      s.update(0);
      renderer.render(scene, camera); // first frame is empty bars, so nothing pops in before the fade
      t0 = last = performance.now();
      fig.classList.add("on");
      raf = requestAnimationFrame(tick);
    },
    stop() {
      if (!raf) return;
      cancelAnimationFrame(raf);
      raf = 0;
      fig.classList.remove("on");
    },
  };
}

async function init() {
  await document.fonts.ready;
  const scenes = [];
  const t = document.getElementById("title-3d"), a = document.getElementById("alloc-3d");
  if (t) scenes.push(mount(t, titleScene));
  if (a) scenes.push(mount(a, allocScene));
  const sync = (slide) => {
    const visible = document.visibilityState === "visible";
    scenes.forEach((sc) => (visible && slide && slide.contains(sc.fig) ? sc.start() : sc.stop()));
  };
  document.addEventListener("epi:slide", (e) => sync(e.detail.slide));
  document.addEventListener("visibilitychange", () => sync(document.querySelector(".slide.active")));
  sync(document.querySelector(".slide.active"));
  window.EPI_3D = { running: () => scenes.filter((s) => s.running()).map((s) => s.fig.id) };
}

if (matchMedia("(prefers-reduced-motion: reduce)").matches || !hasWebGL() || !D || !D.districts) fallback();
else {
  root.classList.add("has3d");
  init().catch((e) => { console.warn("3D off:", e); fallback(); });
}
