const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("canvas-container").appendChild(renderer.domElement);

// Lighting
const light = new THREE.PointLight(0xffffff, 2, 1000);
light.position.set(0, 0, 0);
scene.add(light);

// Sun
const sunGeometry = new THREE.SphereGeometry(3.5, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Stars background
function addStars(count) {
  const starGeo = new THREE.BufferGeometry();
  const starPositions = [];

  for (let i = 0; i < count; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = (Math.random() - 0.5) * 2000;
    starPositions.push(x, y, z);
  }

  starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
  const starMaterial = new THREE.PointsMaterial({ color: 0xffffff });
  const stars = new THREE.Points(starGeo, starMaterial);
  scene.add(stars);
}
addStars(1000);

// Planet data
const planetData = [
  { name: "Mercury", color: 0xaaaaaa, size: 1.2, dist: 8, speed: 0.04 },
  { name: "Venus",   color: 0xffc0cb, size: 1.5, dist: 12, speed: 0.015 },
  { name: "Earth",   color: 0x0000ff, size: 1.6, dist: 16, speed: 0.01 },
  { name: "Mars",    color: 0xff0000, size: 1.4, dist: 20, speed: 0.008 },
  { name: "Jupiter", color: 0xffa500, size: 2.8, dist: 25, speed: 0.004 },
  { name: "Saturn",  color: 0xf5deb3, size: 2.4, dist: 30, speed: 0.003 },
  { name: "Uranus",  color: 0xadd8e6, size: 2.0, dist: 35, speed: 0.002 },
  { name: "Neptune", color: 0x00008b, size: 1.9, dist: 40, speed: 0.0016 }
];

const planets = [];
const planetSpeeds = [];
const planetAngles = [];

const controlsContainer = document.getElementById("controlsContainer");

planetData.forEach((planet, i) => {
  const geometry = new THREE.SphereGeometry(planet.size, 32, 32);
  const material = new THREE.MeshStandardMaterial({ color: planet.color });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // Label
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  ctx.font = "20px Arial";
  ctx.fillStyle = "white";
  ctx.fillText(planet.name, 0, 20);
  const texture = new THREE.CanvasTexture(canvas);
  const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(7, 2, 1);
  mesh.add(sprite);

  planets.push({ mesh, dist: planet.dist });
  planetSpeeds.push(planet.speed);
  planetAngles.push(Math.random() * Math.PI * 2);

  // Create UI control
  const wrapper = document.createElement("div");
  wrapper.className = "slider-wrapper";

  const label = document.createElement("label");
  label.innerText = planet.name;
  wrapper.appendChild(label);

  const input = document.createElement("input");
  input.type = "range";
  input.min = "0.0001";
  input.max = "0.1";
  input.step = "0.0001";
  input.value = planet.speed;
  input.addEventListener("input", (e) => {
    planetSpeeds[i] = parseFloat(e.target.value);
  });

  wrapper.appendChild(input);
  controlsContainer.appendChild(wrapper);
});

// Camera setup
camera.position.z = 48;

// Pause/resume toggle
let isPaused = false;

document.getElementById("toggleAnimation").addEventListener("click", () => {
  isPaused = !isPaused;
  document.getElementById("toggleAnimation").innerText = isPaused ? "Resume" : "Pause";
});

document.getElementById("toggleControls").addEventListener("click", () => {
  controlsContainer.style.display =
    controlsContainer.style.display === "none" ? "block" : "none";
});

function animate() {
  requestAnimationFrame(animate);

  if (!isPaused) {
    planets.forEach((planet, i) => {
      planetAngles[i] += planetSpeeds[i];
      const x = planet.dist * Math.cos(planetAngles[i]);
      const z = planet.dist * Math.sin(planetAngles[i]);
      planet.mesh.position.set(x, 0, z);
    });
  }

  renderer.render(scene, camera);
}

animate();
