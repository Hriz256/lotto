import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';
import * as Ammo from "ammo.js";
import {createRoom} from './playground';

const canvas = document.getElementById("renderCanvas");
let scene = null;

const createDefaultEngine = () => new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true});

const createScene = () => {
    const scene = new BABYLON.Scene(engine);

    const light =  new BABYLON.DirectionalLight("dir02", new BABYLON.Vector3(0, 20, 20), scene);
    // light.intensity = 0.7;

    const camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / -2, Math.PI / 2, 30, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    createRoom(scene);

    scene.enablePhysics(new BABYLON.Vector3(0, -70, 0), new BABYLON.AmmoJSPlugin(null, Ammo));

    return scene;
};

const engine = createDefaultEngine();
scene = createScene();

if (!engine) throw 'engine should not be null.';

engine.runRenderLoop(() => scene && scene.render());
engine.loadingUIBackgroundColor = "Purple";
window.addEventListener("resize", () => engine.resize());
