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
        this.camera.attachControl(canvas, true);

        // this.camera.lowerRadiusLimit = 30;
        // this.camera.upperRadiusLimit = 40;
        // this.camera.inputs.remove(this.camera.inputs.attached.keyboard);
        // this.camera.inputs.remove(this.camera.inputs.attached.pointers);

        const light = new BABYLON.DirectionalLight("dir02", new BABYLON.Vector3(0, 20, 20), scene);

        scene.enablePhysics(new BABYLON.Vector3(0, -30, 0), new BABYLON.AmmoJSPlugin(null, Ammo));

        return scene;
    }

    createDefaultEngine() {
        return new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true});
    }
}

const playground = new Playground();

const scene = playground.scene;
const engine = playground.engine;

class Lotto {
    constructor() {
        this.balls = {
            winBalls: [],
            winBallsImg: []
        };

        this.allowDestroyBall = false;
        this.currentIndex = 1;
    }

    main() {
        const metall = this.createMaterial('metall');
        const hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("textures/environment.dds", scene);

        const plastic = new BABYLON.PBRMaterial("plastic", scene);
        // plastic.reflectionTexture = hdrTexture;
        plastic.microSurface = 0.96;
        plastic.backFaceCulling = false;
        plastic.alpha = 0.2;
        plastic.albedoColor = new BABYLON.Color3(0.206, 0.94, 1);
        plastic.reflectivityColor = new BABYLON.Color3(0.003, 0.003, 0.003);

        const outCylinder = BABYLON.Mesh.CreateCylinder("cylinder", 2, 8.2, 8, 32, 1, scene, false);
        const insideCylinder = BABYLON.Mesh.CreateCylinder("cylinder", 2, 7.4, 7.4, 32, 1, scene, false);

        const glass = BABYLON.Mesh.CreateCylinder("cylinder", 2.2, 7.4, 7.4, 32, 1, scene, false);
        const hole1 = BABYLON.Mesh.CreateCylinder("cylinder", 4, 0.6, 0.6, 16, 1, scene, false);
        const hole2 = hole1.clone("cylinder");
        const hole3 = hole1.clone("cylinder");
        const hole4 = hole1.clone("cylinder");

        outCylinder.rotation.x = Math.PI / 2;
        insideCylinder.rotation.x = Math.PI / 2;
        glass.rotation.x = Math.PI / 2;

        hole1.position = new BABYLON.Vector3(-1.1, 4, 0);
        hole2.position = new BABYLON.Vector3(-0.35, 4, 0);
        hole3.position = new BABYLON.Vector3(0.45, 4, 0);
        hole4.position = new BABYLON.Vector3(1.3, 4, 0);

        const aCSG = BABYLON.CSG.FromMesh(insideCylinder);
        const bCSG = BABYLON.CSG.FromMesh(outCylinder);
        const cCSG = BABYLON.CSG.FromMesh(glass);

        const dCSG1 = BABYLON.CSG.FromMesh(hole1);
        const dCSG2 = BABYLON.CSG.FromMesh(hole2);
        const dCSG3 = BABYLON.CSG.FromMesh(hole3);
        const dCSG4 = BABYLON.CSG.FromMesh(hole4);

        // Set up a MultiMaterial

        const subCSG1 = cCSG.subtract(aCSG);
        const drumPart1 = subCSG1.toMesh("csg1", plastic, scene);
        drumPart1.position = new BABYLON.Vector3(0.05, -1.5, 0);
        drumPart1.scaling.x = 1.05;

        const subCSG2 = bCSG.subtract(aCSG).subtract(dCSG1).subtract(dCSG2).subtract(dCSG3).subtract(dCSG4);
        const drumPart2 = subCSG2.toMesh("csg2", metall, scene);
        drumPart2.position = new BABYLON.Vector3(0.05, -1.5, 0);
        drumPart2.scaling.x = 1.05;

        // const subCSG3 = dCSG1.subtract(aCSG).subtract(dCSG2);
        // const drumPart3 = subCSG3.toMesh("csg3", plastic, scene);
        // drumPart3.position = new BABYLON.Vector3(0.7, 4, 0);
        //
        // const subCSG4 = eCSG1.subtract(aCSG).subtract(eCSG2);
        // const drumPart4 = subCSG4.toMesh("csg4", plastic, scene);
        // drumPart4.position = new BABYLON.Vector3(-0.7, 4, 0);

        setVisibility(outCylinder, false);
        setVisibility(insideCylinder, false);
        setVisibility(glass, false);
        setVisibility(hole1, false);
        setVisibility(hole2, false);
        setVisibility(hole3, false);
        setVisibility(hole4, false);

        this.createBalls(0, 1);
        this.createBalls(0, 2);
        this.createBalls(0, 3);
        this.createBalls(0, 4);

        // Playground

        const groundMat = new BABYLON.StandardMaterial("groundMat", scene);
        groundMat.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        groundMat.emissiveColor = new BABYLON.Color3(0.2, 0.2, 0.2);
        groundMat.backFaceCulling = false;

        this.createBg();

        //////////////////////////////////////

        this.holder = this.createSphere({diameter: 0.01, material: groundMat, physicsAllow: false});
        this.wheel = this.createSphere({
            z: 2,
            y: -1.6,
            x: 0.05,
            diameter: 0.001,
            material: groundMat,
            physicsAllow: false
        });

        const b = BABYLON.Mesh.CreateBox("box", 1.5, scene);
        b.scaling = new BABYLON.Vector3(1, 1.62, 0.2);
        b.position.y += 2.5;

        const c = BABYLON.Mesh.CreateBox("box", 1.5, scene);
        c.scaling = new BABYLON.Vector3(1, 1.62, 0.2);
        c.position = new BABYLON.Vector3(0.5, 3, 0);

        const xCSG = BABYLON.CSG.FromMesh(b);
        const yCSG = BABYLON.CSG.FromMesh(c);

        setVisibility(b);
        setVisibility(c);

        const subCSG = xCSG.subtract(yCSG);
        const box1 = subCSG.toMesh("csg2", null, scene);
        box1.parent = this.wheel;
        box1.position = new BABYLON.Vector3(-2.3, 0, 0);
        box1.rotation = new BABYLON.Vector3(Math.PI / 2, Math.PI / 2, 0);

        const box2 = box1.clone("tooth2");
        box2.position = new BABYLON.Vector3(2.3, 0, 0);
        box2.rotation = new BABYLON.Vector3(-Math.PI / 2, Math.PI / 2, 0);

        const box3 = box1.clone("tooth3");
        box3.position = new BABYLON.Vector3(0, 2.3, 0);
        box3.rotation = new BABYLON.Vector3(-Math.PI, Math.PI / 2, 0);

        const box4 = box1.clone("tooth3");
        box4.position = new BABYLON.Vector3(0, -2.3, 0);
        box4.rotation.x = -Math.PI / 180;

        [box1, box2, box3, box4].forEach((mesh) => {
            mesh.physicsImpostor = new BABYLON.PhysicsImpostor(mesh, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0});
        });

        this.joint1 = new BABYLON.HingeJoint({
            mainPivot: new BABYLON.Vector3(0, 0, 1),
            connectedPivot: new BABYLON.Vector3(0, 0, 0),
            mainAxis: new BABYLON.Vector3(0, 0, -1),
            connectedAxis: new BABYLON.Vector3(0, 0, 1),
            nativeParams: {}
        });

        const wall1 = this.createBox({z: -5.4, y: -1.5, material: groundMat, size: 9, restitution: 1});
        wall1.scaling.x = 1.5;
        wall1.scaling.y = 1.5;

        const wall2 = this.createBox({z: 5.4, y: -1.5, material: groundMat, size: 9, restitution: 1});
        wall2.scaling.x = 1.5;
        wall2.scaling.y = 1.5;

        setVisibility(wall1, false);
        setVisibility(wall2, false);

        // drumPart2.physicsImpostor = new BABYLON.PhysicsImpostor(drumPart2, BABYLON.PhysicsImpostor.MeshImpostor, {
        //     mass: 0,
        //     friction: 0.5,
        //     restitution: 0.4
        // }, scene);

        let alpha = -0.9;

        this.spheresWall = [];

        for (let i = 0; i < 124; i++) {
            const sphere = this.createSphere({
                x: -10,
                y: 5,
                z: 0,
                diameter: 2.5,
                material: metall,
                restitution: 1,
                friction: 1
            });

            sphere.position = new BABYLON.Vector3(5 * Math.cos(alpha), -1.5 + (-5 * Math.sin(alpha)), 0);

            setVisibility(sphere, false);
            this.toggleSpheresPhysic(false);
            this.spheresWall.push(sphere);

            alpha += 0.05;
        }
    }

    createBg() {
        const black = new BABYLON.StandardMaterial("mat", scene);
        black.diffuseColor = new BABYLON.Color3(0, 0, 0);
        const bgImg = this.createMaterial('Stage', 1);
        const bodyImg = this.createMaterial('Body', 1);
        bodyImg.diffuseTexture.hasAlpha = true;
        const glassImg = this.createMaterial('glass', 1);
        glassImg.diffuseTexture.hasAlpha = true;

        const bg = BABYLON.MeshBuilder.CreatePlane("bg", {
            width: 85,
            height: 42.3
        }, scene, true, BABYLON.MeshBuilder.FRONTSIDE);
        bg.position = new BABYLON.Vector3(0, 0, 20);
        bg.material = bgImg;

        const body = BABYLON.MeshBuilder.CreatePlane("body", {width: 10, height: 18.2}, scene, true);
        body.position = new BABYLON.Vector3(0, 1, 4);
        body.material = bodyImg;

        const bodyBlack = BABYLON.MeshBuilder.CreatePlane("body", {width: 9, height: 10}, scene, true);
        bodyBlack.position = new BABYLON.Vector3(0, -3, 4.5);
        bodyBlack.material = black;

        // const glass = BABYLON.MeshBuilder.CreatePlane("glass", {width: 7, height: 15}, scene, true);
        // glass.position = new BABYLON.Vector3(0, 1.5, -1);
        // glass.material = glassImg;
    }

    createSphere({x = 0, y = 0, z = 0, diameter = 0, mass = 0, restitution = 0, material, physicsAllow = true, friction = 0}) {
        const sphere = BABYLON.Mesh.CreateSphere("sphere", 32, diameter, scene);

        sphere.material = material;
        sphere.position = new BABYLON.Vector3(x, y, z);

        if (physicsAllow) {
            sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, {
                mass,
                restitution,
                friction
            }, scene);
        }

        return sphere;
    }

    showWinBall(number) {
        const ballsVectorPos = [
            new BABYLON.Vector3(-4.9, -9.8, 0),
            new BABYLON.Vector3(-1.65, -9.7, 0),
            new BABYLON.Vector3(1.65, -9.7, 0),
            new BABYLON.Vector3(4.9, -9.8, 0)
        ];

        const winBallImg = this.createMaterial(`balls/Ball_${number}`, 1);
        winBallImg.diffuseTexture.hasAlpha = true;

        const winBall = BABYLON.MeshBuilder.CreatePlane("body", {width: 2.4, height: 2.2}, scene, true);
        winBall.position = ballsVectorPos[this.balls.winBallsImg.length];
        winBall.material = winBallImg;

        this.balls.winBallsImg.push(winBallImg);
    }

    toggleSpheresPhysic(physic) {
        this.spheresWall.forEach((i, index) => {
            if (index > 95) {
                physic ?
                    i.physicsImpostor = new BABYLON.PhysicsImpostor(i, BABYLON.PhysicsImpostor.SphereImpostor, {
                        mass: 0,
                        restitution: 1
                    }, scene) :
                    i.physicsImpostor.dispose();
            }
        });
    }

    createBox({x = 0, y = 0, z = 0, size = 1, friction = 0, mass = 0, restitution = 0, material}) {
        const box = BABYLON.Mesh.CreateBox("box", size, scene);

        box.material = material;
        box.position = new BABYLON.Vector3(x, y, z);

        box.physicsImpostor = new BABYLON.PhysicsImpostor(box, BABYLON.PhysicsImpostor.BoxImpostor, {
            friction,
            mass,
            restitution
        }, scene);

        return box;
    }

    createMaterial(name, scale = 3) {
        const material = new BABYLON.StandardMaterial(`${name}`, scene);

        material.diffuseTexture = new BABYLON.Texture(`textures/${name}.png`, scene);
        material.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        material.diffuseTexture.uScale = scale;
        material.diffuseTexture.vScale = scale;

        return material;
    }

    wheelMove(isRun) {
        if (isRun) {
            this.wheel.position = new BABYLON.Vector3(0.05, -1.5, 0);
            this.wheel.physicsImpostor = new BABYLON.PhysicsImpostor(this.wheel, BABYLON.PhysicsImpostor.SphereImpostor, {mass: 20});
            this.holder.physicsImpostor = new BABYLON.PhysicsImpostor(this.holder, BABYLON.PhysicsImpostor.SphereImpostor, {mass: 0});
            this.holder.physicsImpostor.addJoint(this.wheel.physicsImpostor, this.joint1);
            this.joint1.setMotor(11)
        } else {
            this.wheel.position = new BABYLON.Vector3(0.05, -1.5, 2);
            this.wheel.physicsImpostor.dispose();
            this.holder.physicsImpostor.dispose();
            this.joint1.setMotor(0)
        }
    }

    run() {
        this.toggleSpheresPhysic(true);

        setTimeout(() => {
            this.wheelMove(true);

            setTimeout(() => this.showWinnings(), 12000);
        }, 3000);
    }

    showWinnings() {
        const number = random(0, 9);
        const ball = this.balls[`${this.currentIndex}`].find(item => item.material.name === `${number}`);

        this.showWinBall(number);
        ball.dispose();

        this.interval = setInterval(() => {
            if (!this.balls[`${this.currentIndex}`].length) {
                clearInterval(this.interval);
                this.endTheGame();

                return;
            }

            this.allowDestroyBall = true;
        }, 500);
    }

    createBalls(mass, ballIndex) {
        const ballsX = [-1.1, -0.3, 0.55, 1.4];
        const spheresArray = [];

        for (let index = 0; index < 10; index++) {
            const sphere = this.createSphere({
                x: ballsX[ballIndex ? ballIndex - 1 : this.currentIndex - 1],
                y: 2.8 + index * 0.55,
                z: 0,
                diameter: 0.55,
                material: this.createMaterial(`${index}`),
                mass,
                friction: 1,
                restitution: 0.4
            });

            sphere.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, -15, 0));
            spheresArray.push(sphere);
        }

        this.balls[`${ballIndex ? ballIndex : this.currentIndex}`] = [...spheresArray];
    }

    removeBall() {
        this.balls[`${this.currentIndex}`].sort(() => Math.random() - 0.5);
        this.balls[`${this.currentIndex}`][this.balls[`${this.currentIndex}`].length - 1].dispose();
        this.balls[`${this.currentIndex}`].length--;
    }

    startTheGame() {
        setTimeout(() => {
            this.balls[`${this.currentIndex}`].forEach(item => item.dispose());
            this.createBalls(10);
        }, 3000);
    }

    endTheGame() {
        this.wheelMove(false);
        this.toggleSpheresPhysic(false);
        this.currentIndex++;
        start = false;
        lotto.startTheGame();
    }
}

let start = false;

const lotto = new Lotto();

lotto.main();
lotto.startTheGame();

engine.runRenderLoop(function () {
    if (scene) {
        scene.render();
    }

    const allow = lotto.balls[`${lotto.currentIndex}`].every(i => i.position.y < 1);

    if (allow && !start) {
        lotto.run();

        start = true;
    }

    if (lotto.allowDestroyBall) {
        lotto.removeBall();
        lotto.allowDestroyBall = false;
    }

    document.getElementById("fps").innerHTML = engine.getFps().toFixed() + " fps";
});

// Resize
window.addEventListener("resize", () => engine.resize());

