import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Stats from 'three/examples/jsm/libs/stats.module';

const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(5));

// Lights setup (unchanged from the provided code)
// ...const scene = new THREE.Scene()

const light = new THREE.SpotLight(0xffffff, Math.PI * 20)
light.position.set(5, 5, 5)
scene.add(light)

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Ambient light to illuminate the entire scene
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5); // Directional light to simulate sunlight
directionalLight.position.set(0, 10, 0); // Set position of the light
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5); // Point light to illuminate specific areas
pointLight.position.set(0, 3, 0); // Set position of the light
scene.add(pointLight);

const spotLight = new THREE.SpotLight(0xffffff, 0.5); // Spot light to focus on specific objects
spotLight.position.set(0, 5, 0); // Set position of the light
spotLight.castShadow = true; // Enable shadows for the spot light
scene.add(spotLight);

// Create ambient lights around the center and four sides
const centerAmbientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(centerAmbientLight);

const sideAmbientLight1 = new THREE.AmbientLight(0xffffff, 0.2);
sideAmbientLight1.position.set(10, 0, 0); // Adjust position according to your scene
scene.add(sideAmbientLight1);

const sideAmbientLight2 = new THREE.AmbientLight(0xffffff, 0.2);
sideAmbientLight2.position.set(-10, 0, 0); // Adjust position according to your scene
scene.add(sideAmbientLight2);

const sideAmbientLight3 = new THREE.AmbientLight(0xffffff, 0.2);
sideAmbientLight3.position.set(0, 0, 10); // Adjust position according to your scene
scene.add(sideAmbientLight3);

const sideAmbientLight4 = new THREE.AmbientLight(0xffffff, 0.2);
sideAmbientLight4.position.set(0, 0, -10); // Adjust position according to your scene
scene.add(sideAmbientLight4);

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 2;

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xd3d3d3);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const loader = new GLTFLoader();

const modelsToLoad = [
    '../models/onfloor/first floor .gltf',
    '../models/roof-1/roof .gltf',
    '../models/steps/steps.gltf',
    '../models/second floor/second floor .gltf',
];

// Load multiple models sequentially
loadModels(modelsToLoad, 0);

function loadModels(models, index) {
    if (index >= models.length) return; // Stop if all models are loaded

    loader.load(
        models[index],
        (gltf) => {
            scene.add(gltf.scene);
            loadModels(models, index + 1); // Load the next model
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        (error) => {
            console.log(error);
            loadModels(models, index + 1); // Skip to the next model on error
        }
    );
}

window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}

const stats = new Stats();
document.body.appendChild(stats.dom);

// Music player setup
const audioLoader = new THREE.AudioLoader();
const listener = new THREE.AudioListener();
camera.add(listener);

const sound = new THREE.PositionalAudio(listener);
audioLoader.load('../sounds/The Most Beautiful & Relaxing Piano Pieces (Vol. 1).mp3', function (buffer) {
    sound.setBuffer(buffer);
    sound.setRefDistance(20);
    sound.play(); // Start playing the audio
});

// Animation loop (unchanged from the provided code)
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    render();
    stats.update();
}

function render() {
    renderer.render(scene, camera);
}

animate();

// First person camera controls
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

const onKeyDown = (event) => {
    switch (event.code) {
        case 'KeyW':
            moveForward = true;
            break;
        case 'KeyA':
            moveLeft = true;
            break;
        case 'KeyS':
            moveBackward = true;
            break;
        case 'KeyD':
            moveRight = true;
            break;
    }
};

const onKeyUp = (event) => {
    switch (event.code) {
        case 'KeyW':
            moveForward = false;
            break;
        case 'KeyA':
            moveLeft = false;
            break;
        case 'KeyS':
            moveBackward = false;
            break;
        case 'KeyD':
            moveRight = false;
            break;
    }
};

document.addEventListener('keydown', onKeyDown, false);
document.addEventListener('keyup', onKeyUp, false);

const moveCamera = () => {
    if (moveForward) camera.position.z -= 0.1;
    if (moveBackward) camera.position.z += 0.1;
    if (moveLeft) camera.position.x -= 0.1;
    if (moveRight) camera.position.x += 0.1;
    // You can add more movement controls as needed (e.g., vertical movement)
};

const update = () => {
    moveCamera();
    requestAnimationFrame(update);
};

update();
