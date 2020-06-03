import {createRoom} from './playground';
import {materials, mesh} from "./materials";

const canvas = document.getElementById("renderCanvas");

const createDefaultEngine = () => new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true});

const load = (scene) => {
    const assetsManager = new BABYLON.AssetsManager(scene);
    assetsManager.addMeshTask('Roller', '', 'assets/roller/', 'roller.obj');
    assetsManager.addMeshTask('Rotor', '', 'assets/roller/', 'rotor.obj');
    assetsManager.addMeshTask('Sphere', '', 'assets/', 'sphere2.obj');

    assetsManager.load();

    return new Promise(resolve => {
        assetsManager.onFinish = tasks => resolve(tasks);
    });
};

const createScene = () => {
    const scene = new BABYLON.Scene(engine);

    const light = new BABYLON.DirectionalLight('light', new BABYLON.Vector3(0, 20, 20), scene);
    light.specular = new BABYLON.Color3(0, 0, 0); // убрать блики
    light.intensity = 1.25;

    const camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / -2, Math.PI / 2, 30, new BABYLON.Vector3(0, 0, 0), scene);
    camera.attachControl(canvas, true);

    const ammo = new BABYLON.AmmoJSPlugin(true);
    ammo.setMaxSteps(40);
    ammo.setFixedTimeStep(1 / 240);
    scene.enablePhysics(new BABYLON.Vector3(0, -40, 0), ammo);

    mesh.scene = scene;
    materials.scene = scene;

    materials.setColors();

    (async () => {
        const tasks = await load(scene);
        tasks[2].loadedMeshes[0].isVisible = false;
        // newMeshes[0].scaling.set(0.01, 0.01, 0.01)

        await createRoom(scene, tasks);
    })();

    return scene;
};

const engine = createDefaultEngine();
const scene = createScene();

if (!engine) throw 'engine should not be null.';

engine.runRenderLoop(() => {
    scene && scene.render();
    document.getElementById('fps').innerHTML = engine.getFps().toFixed() + " fps";
});

engine.loadingUIBackgroundColor = "Purple";
window.addEventListener("resize", () => engine.resize());
