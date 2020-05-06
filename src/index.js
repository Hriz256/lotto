import * as BABYLON from 'babylonjs';
import * as Ammo from "ammo.js";

const canvas = document.getElementById("renderCanvas");

const random = (min, max) => {
    return Math.floor(min + Math.random() * (max + 1 - min));
};

function setVisibility(mesh, value) {
    mesh.isVisible = value;

    const children = mesh.getChildren();

    for (let i = 0; i < children.length; i++) {
        const child = children[i];

        setVisibility(child, value);
    }
}

class Playground {
    constructor() {
        this.engine = this.createDefaultEngine();
        this.scene = this.createScene();
    }

    createScene() {
        const scene = new BABYLON.Scene(this.engine);
        scene.clearColor = BABYLON.Color3.Purple();

        this.camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / -2, Math.PI / 2, 30, BABYLON.Vector3.Zero(), scene);
        // this.camera.attachControl(canvas, true);

        // this.camera.lowerRadiusLimit = 30;
        // this.camera.upperRadiusLimit = 40;
        // this.camera.inputs.remove(this.camera.inputs.attached.keyboard);
        // this.camera.inputs.remove(this.camera.inputs.attached.pointers);

        const light = new BABYLON.DirectionalLight("dir02", new BABYLON.Vector3(0, 20, 20), scene);

        scene.enablePhysics(new BABYLON.Vector3(0, -10, 0), new BABYLON.AmmoJSPlugin(null, Ammo));

        return scene;
    }

    createDefaultEngine() {
        return new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true});
    }
}

// const playground = new Playground();
//
// const scene = playground.scene;
// const engine = playground.engine;
let play = false;

// engine.runRenderLoop(function () {
//     if (scene) {
//         scene.render();
//     }
//
//     const allow = lotto.balls[`${lotto.currentIndex}`].every(i => i.position.y < 1);
//
//     if (allow && !start && play) {
//         lotto.run();
//
//         start = true;
//     }
//
//     if (lotto.allowDestroyBall) {
//         lotto.removeBall();
//         lotto.allowDestroyBall = false;
//     }
//
//     // document.getElementById("fps").innerHTML = engine.getFps().toFixed() + " fps";
// });
//
// // Resize
// window.addEventListener("resize", () => engine.resize());
// document.getElementById('start').addEventListener('click', function (e) {
//     play = !play;
//
//     if (play) {
//         lotto.startTheGame();
//         e.target.textContent = 'Стоп';
//     } else {
//         e.target.textContent = 'Старт';
//     }
// });
//
