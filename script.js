const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 15);

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener('resize', () => {
  camera.aspect = innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 5;
controls.maxDistance = 30;

const starGeo = new THREE.BufferGeometry();
const starCnt = 2000;
const posArr = new Float32Array(starCnt * 3);
for(let i = 0; i < starCnt*3; i++) {
  posArr[i] = (Math.random() - 0.5) * 200;
}
starGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
const starMat = new THREE.PointsMaterial({ color: 0xffffff });
const stars = new THREE.Points(starGeo, starMat);
scene.add(stars);

const sunGeo = new THREE.SphereGeometry(2, 32, 32);
const sunMat = new THREE.MeshBasicMaterial({ color: 0xffee88 });
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

let planet;
const loader = new THREE.TextureLoader();
loader.load('pacar1.jpg', tex => {
  const geo = new THREE.SphereGeometry(1, 32, 32);
  const mat = new THREE.MeshStandardMaterial({ map: tex });
  planet = new THREE.Mesh(geo, mat);
  planet.position.x = 8;
  scene.add(planet);
});

scene.add(new THREE.AmbientLight(0x888888));
const light = new THREE.PointLight(0xffffff, 1.2);
light.position.copy(sun.position);
scene.add(light);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  sun.rotation.y += 0.002;
  if (planet) planet.rotation.y += 0.005, planet.position.applyAxisAngle(new THREE.Vector3(0,1,0), 0.001);
  renderer.render(scene, camera);
}
animate();

// Musik kontrol
const music = document.getElementById('bg-music');
const btn = document.getElementById('btn-toggle-music');
music.play().catch(_=>music.muted = false);
btn.addEventListener('click', () => {
  if (music.paused) {
    music.play(); btn.innerText = 'Pause Music';
  } else {
    music.pause(); btn.innerText = 'Play Music';
  }
});