import {createRoom} from './playground';
import {materials, mesh} from "./materials";

const canvas = document.getElementById("renderCanvas");
let scene = null;

const createDefaultEngine = () => new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true});

const createScene = () => {
    const scene = new BABYLON.Scene(engine);

    const light = new BABYLON.DirectionalLight("dir02", new BABYLON.Vector3(0, 20, 20), scene);
    // light.intensity = 0.75;
    // light.intensity = 0.7;

    const camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / -2, Math.PI / 2, 30, new BABYLON.Vector3(0, 0, 15), scene);
    camera.attachControl(canvas, true);

    const ammo = new BABYLON.AmmoJSPlugin(true);
    ammo.setMaxSteps(10);
    ammo.setFixedTimeStep(1 / 60);
    scene.enablePhysics(new BABYLON.Vector3(0, -40, 0), ammo);

    mesh.scene = scene;
    materials.scene = scene;

    materials.createColor('black', '#000');
    materials.createColor('yellow', '#ffed45');
    materials.createGlass();

    createRoom(scene);

    return scene;
};

const engine = createDefaultEngine();
scene = createScene();

if (!engine) throw 'engine should not be null.';

engine.runRenderLoop(() => {
    scene && scene.render();
    document.getElementById('fps').innerHTML = engine.getFps().toFixed() + " fps";
});

engine.loadingUIBackgroundColor = "Purple";
window.addEventListener("resize", () => engine.resize());
