import * as BABYLON from "babylonjs";
import {materials, mesh} from "./materials";
import {balls, createBalls} from "./balls";


let allowDestroyBall = false;
let play = false;


const createRoller = (scene) => {
    const assetsManager = new BABYLON.AssetsManager(scene);
    const meshTask = assetsManager.addMeshTask('Roller', "", 'assets/roller/', 'roller.obj');


    const holder = mesh.createSphere({
        diameter: 0.1,
        position: {x: -3, y: -10.8, z: 18},
        material: materials['yellow']
    });

    this.joint1 = new BABYLON.HingeJoint({
        mainPivot: new BABYLON.Vector3(0, -1.5, 0),
        connectedPivot: new BABYLON.Vector3(0, 0, 0),
        mainAxis: new BABYLON.Vector3(0, 0, -1),
        connectedAxis: new BABYLON.Vector3(0, 0, -1),
        nativeParams: {}
    });

    meshTask.onSuccess = ({loadedMeshes}) => {
        const roller = new BABYLON.Mesh('roller', scene);

        Array.from(loadedMeshes, (item, index) => {
            item.rotation.y = Math.PI;
            item.position = new BABYLON.Vector3(-3, -10.8, 18);
            item.scaling = new BABYLON.Vector3(0.137, 0.137, 0.137);

            if (index === 3) {
                item.setPhysics = mesh.setPhysics;
                item.setPhysics({impostor: 'MeshImpostor', mass: 1});
            } else {
                item.parent = roller
            }
        });

        // roller.rotation.y = Math.PI;
        // roller.position = new BABYLON.Vector3(-3, -10.8, 18);
        // roller.scaling = new BABYLON.Vector3(0.137, 0.137, 0.137);
    };

    assetsManager.load();
};

// const createRoller = (scene) => {
//     this.metall = this.createMaterial('metall');
//     const hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("assets/environment.dds", scene);
//
//     const plastic = new BABYLON.PBRMaterial("plastic", scene);
//     // plastic.reflectionTexture = hdrTexture;
//     plastic.microSurface = 0.96;
//     plastic.backFaceCulling = false;
//     plastic.alpha = 0.2;
//     plastic.albedoColor = new BABYLON.Color3(0.206, 0.94, 1);
//     plastic.reflectivityColor = new BABYLON.Color3(0.003, 0.003, 0.003);
// };

let spheresWall = [];

const toggleSpheresPhysic = (physic) => {
    Array.from(spheresWall, (item, index) => {
        if (index > 105) {
            physic ? item.setPhysics({restitution: 1, friction: 1}) : item.dispose();
        }
    });
};

const startTheGame = () => {
    setTimeout(() => {
        Array.from(balls[`${balls.currentIndex}`], item => item.physicsImpostor.setMass(10));
    }, 3000);
};

const run = () => {
    toggleSpheresPhysic(true);

    // setTimeout(() => {
    //     wheelMove(true);
    //
    //     setTimeout(() => showWinnings(), 1000);
    // }, 3000);
};

const createWheel = () => {
    // this.holder = this.createSphere({diameter: 0.01, material: this.groundMat, physicsAllow: false});
    // this.wheel = this.createSphere({
    //     z: 0,
    //     y: -1.5,
    //     x: 0.05,
    //     diameter: 0.001,
    //     material: this.groundMat,
    //     physicsAllow: false
    // });
    //
    // const b = BABYLON.Mesh.CreateBox("box", 1.5, scene);
    // b.scaling = new BABYLON.Vector3(1, 2.5, 0.1);
    // b.position.y += 2.5;
    //
    // const c = BABYLON.Mesh.CreateBox("box", 1.5, scene);
    // c.scaling = new BABYLON.Vector3(1, 2.5, 0.1);
    // c.position = new BABYLON.Vector3(0.5, 3, 0);
    //
    // const xCSG = BABYLON.CSG.FromMesh(b);
    // const yCSG = BABYLON.CSG.FromMesh(c);
    //
    // setVisibility(b);
    // setVisibility(c);
    //
    // const subCSG = xCSG.subtract(yCSG);
    // const box1 = subCSG.toMesh("csg2", null, scene);
    // box1.parent = this.wheel;
    // box1.position = new BABYLON.Vector3(-1.5, 0, 0);
    // box1.rotation = new BABYLON.Vector3(Math.PI / 2, Math.PI / 2, 0);
    //
    // const box2 = box1.clone("tooth2");
    // box2.position = new BABYLON.Vector3(1.5, 0, 0);
    // box2.rotation = new BABYLON.Vector3(-Math.PI / 2, Math.PI / 2, 0);
    //
    // const box3 = box1.clone("tooth3");
    // box3.position = new BABYLON.Vector3(0, 1.5, 0);
    // box3.rotation = new BABYLON.Vector3(-Math.PI, Math.PI / 2, 0);
    //
    // const box4 = box1.clone("tooth3");
    // box4.position = new BABYLON.Vector3(0.02, -1.5, 0);
    // box4.rotation.x = -Math.PI / 180;
    //
    // [box1, box2, box3, box4].forEach((mesh) => {
    //     mesh.physicsImpostor = new BABYLON.PhysicsImpostor(mesh, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0});
    // });

    // this.holder = this.createSphere({diameter: 0.01, material: this.groundMat, physicsAllow: false});
    //
    // this.joint1 = new BABYLON.HingeJoint({
    //     mainPivot: new BABYLON.Vector3(0, -1.5, 0),
    //     connectedPivot: new BABYLON.Vector3(0, 0, 0),
    //     mainAxis: new BABYLON.Vector3(0, 0, -1),
    //     connectedAxis: new BABYLON.Vector3(0, 0, -1),
    //     nativeParams: {}
    // });
}

const wheelMove = (isRun) => {
    if (isRun) {
        this.wheel.position = new BABYLON.Vector3(0.05, -1.5, 0);
        this.wheel.physicsImpostor = new BABYLON.PhysicsImpostor(this.wheel, BABYLON.PhysicsImpostor.SphereImpostor, {mass: 20});
        this.holder.physicsImpostor = new BABYLON.PhysicsImpostor(this.holder, BABYLON.PhysicsImpostor.SphereImpostor, {mass: 0});
        this.holder.physicsImpostor.addJoint(this.wheel.physicsImpostor, this.joint1);
        this.joint1.setMotor(10)
    } else {
        this.wheel.dispose();
        this.holder.dispose();
        this.createWheel();
    }
}

const createSpheresWall = () => {
    let alpha = 2.06;

    const wall1 = mesh.createBox({
        size: {x: 12, y: 12, z: 2},
        position: {x: 0, y: -1.5, z: 14.9},
        material: materials['yellow']
    });

    const wall2 = mesh.createBox({
        size: {x: 12, y: 12, z: 2},
        position: {x: 0, y: -1.5, z: 18.3},
        material: materials['yellow']
    });


    Array.from([wall1, wall2], item => {
        item.isVisible = false;
        item.setPhysics({impostor: 'BoxImpostor', restitution: 1});
    });

    spheresWall = Array.from({length: 124}, () => {
        const sphere = mesh.createSphere({
            diameter: 2.5,
            position: {x: -0.2 + (6.45 * Math.cos(alpha)), y: -0.6 + (6.45 * Math.sin(alpha)), z: 16},
            material: materials['yellow'],
        });

        sphere.setPhysics({restitution: 1, friction: 1});
        // sphere.isVisible = false;

        alpha += 0.05;

        return sphere;
    });

    toggleSpheresPhysic(false);
};


const createRoom = (scene) => {
    let start = false;
    createRoller(scene);

    Array.from({length: 4}, (i, index) => createBalls(0, index));

    const bg = mesh.createPlane({
        width: 85,
        height: 42.3,
        position: {x: 0, y: 0, z: 20},
        material: materials.createTexture({texture: 'Stage', format: 'png'})
    });

    scene.registerBeforeRender(() => {
        const allow = balls[`${balls.currentIndex}`].every(i => i.position.y < 1);

        if (allow && !start && play) {
            run();
            start = true;
        }

        // if (allowDestroyBall) {
        //     removeBall();
        //     allowDestroyBall = false;
        // }
    });

    createSpheresWall();
};


class Lotto {


    main() {
        this.metall = this.createMaterial('metall');
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
        const hole1 = BABYLON.Mesh.CreateCylinder("cylinder", 4.2, 0.64, 0.64, 16, 1, scene, false);
        const hole12 = BABYLON.Mesh.CreateCylinder("cylinder", 4, 0.62, 0.62, 16, 1, scene, false);
        const hole2 = hole1.clone("cylinder");
        const hole3 = hole1.clone("cylinder");
        const hole4 = hole1.clone("cylinder");

        outCylinder.rotation.x = Math.PI / 2;
        insideCylinder.rotation.x = Math.PI / 2;
        glass.rotation.x = Math.PI / 2;

        hole1.position = new BABYLON.Vector3(-1.1, 4, 0);
        hole12.position = new BABYLON.Vector3(-1.1, 4, 0);
        hole2.position = new BABYLON.Vector3(-0.35, 4, 0);
        hole3.position = new BABYLON.Vector3(0.45, 4, 0);
        hole4.position = new BABYLON.Vector3(1.3, 4, 0);

        const aCSG = BABYLON.CSG.FromMesh(insideCylinder);
        const bCSG = BABYLON.CSG.FromMesh(outCylinder);
        const cCSG = BABYLON.CSG.FromMesh(glass);

        const dCSG1 = BABYLON.CSG.FromMesh(hole1);
        const dCSG12 = BABYLON.CSG.FromMesh(hole12);
        const dCSG2 = BABYLON.CSG.FromMesh(hole2);
        const dCSG3 = BABYLON.CSG.FromMesh(hole3);
        const dCSG4 = BABYLON.CSG.FromMesh(hole4);

        // Set up a MultiMaterial

        const subCSG1 = cCSG.subtract(aCSG);
        const drumPart1 = subCSG1.toMesh("csg1", plastic, scene);
        drumPart1.position = new BABYLON.Vector3(0.05, -1.5, 0);
        drumPart1.scaling.x = 1.05;

        const subCSG2 = bCSG.subtract(aCSG).subtract(dCSG1).subtract(dCSG2).subtract(dCSG3).subtract(dCSG4);
        const drumPart2 = subCSG2.toMesh("csg2", this.metall, scene);
        drumPart2.position = new BABYLON.Vector3(0.05, -1.5, 0);
        drumPart2.scaling.x = 1.05;

        const subCSG3 = dCSG1.subtract(dCSG12);
        const pipe = subCSG3.toMesh("csg3", plastic, scene);
        pipe.position = new BABYLON.Vector3(-1.9, -5.95, 2);
        pipe.rotation = new BABYLON.Vector3(Math.PI / 2, Math.PI / 2.8, 0);

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
        setVisibility(hole12, false);

        this.createBalls(0, 1);
        this.createBalls(0, 2);
        this.createBalls(0, 3);
        this.createBalls(0, 4);

        // Playground

        this.groundMat = new BABYLON.StandardMaterial("this.groundMat", scene);
        this.groundMat.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        this.groundMat.emissiveColor = new BABYLON.Color3(0.2, 0.2, 0.2);
        this.groundMat.backFaceCulling = false;

        this.createBg();
        this.createWheel();

        const wall1 = this.createBox({z: -5.4, y: -1.5, material: this.groundMat, size: 9, restitution: 1});
        wall1.scaling.x = 1.5;
        wall1.scaling.y = 1.5;

        const wall2 = this.createBox({z: 5.4, y: -1.5, material: this.groundMat, size: 9, restitution: 1});
        wall2.scaling.x = 1.5;
        wall2.scaling.y = 1.5;

        setVisibility(wall1, false);
        setVisibility(wall2, false);

        this.createSpheresWall();
    }

    createBg() {


        // const glass = BABYLON.MeshBuilder.CreatePlane("glass", {width: 7, height: 15}, scene, true);
        // glass.position = new BABYLON.Vector3(0, 1.5, -1);
        // glass.material = glassImg;

        this.createPipeSphere();
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

    showWinnings() {
        const number = random(0, 9);
        const ball = this.balls[`${this.currentIndex}`].find(item => item.material.name === `${number}`);

        this.showWinBall(number);
        ball.dispose();

        const winBall = this.createSphere({
            x: -0.4,
            y: -4.5,
            z: 3.5,
            material: this.createMaterial(`${number}`),
            diameter: 0.55,
            mass: 10
        });
        this.balls.winBalls.push(winBall);

        this.interval = setInterval(() => {
            if (!this.balls[`${this.currentIndex}`].length) {
                clearInterval(this.interval);
                this.endTheGame();

                return;
            }

            this.allowDestroyBall = true;
        }, 500);
    }

    removeBall() {
        const ballIndex = this.balls[`${this.currentIndex}`].findIndex(ball =>
            ball.position.y < -3 &&
            ball.position.y > -4.5 &&
            ball.position.x > -2 &&
            ball.position.x < 2
        );

        if (ballIndex !== -1) {
            this.balls[`${this.currentIndex}`][ballIndex].dispose();
            this.balls[`${this.currentIndex}`].splice(ballIndex, 1);
        }
    }

    endTheGame() {
        this.wheelMove(false);
        this.toggleSpheresPhysic(false);
        this.currentIndex++;
        start = false;

        play && lotto.startTheGame();
    }
}


document.getElementById('start').addEventListener('click', e => {
    play = !play;

    if (play) {
        startTheGame();
        e.target.textContent = 'Стоп';
    } else {
        e.target.textContent = 'Старт';
    }
});

export {createRoom};
