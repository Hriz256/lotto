import * as BABYLON from "babylonjs";
import {materials, mesh} from "./materials";
import {balls, createBalls} from "./balls";


let allowDestroyBall = false;
let play = false;


const createRotor = () => {
    const holder = mesh.createSphere({
        diameter: 0.7,
        position: {x: -0.25, y: -0.65, z: 16.7},
        material: materials['yellow']
    });

    // holder.isVisible = false;

    holder.setPhysics({});

    const joint1 = new BABYLON.HingeJoint({
        mainPivot: new BABYLON.Vector3(0, 0, 0),
        connectedPivot: new BABYLON.Vector3(0, 0, 0),
        mainAxis: new BABYLON.Vector3(0, 0, 1),
        connectedAxis: new BABYLON.Vector3(0, 0, 1),
        nativeParams: {}
    });

    return {
        holderAddJoint(rotor) {
            holder.physicsImpostor.addJoint(rotor.physicsImpostor, joint1);
        },

        runRotor(forceFactor) {
            joint1.setMotor(forceFactor);
        }
    }
};

const createRoller = (scene, rotor) => {
    const assetsManager = new BABYLON.AssetsManager(scene);
    const meshTask = assetsManager.addMeshTask('Roller', "", 'assets/roller/', 'roller.obj');

    meshTask.onSuccess = ({loadedMeshes}) => {
        const roller = new BABYLON.Mesh('roller', scene);

        Array.from(loadedMeshes, (item, index) => {
            item.rotation.y = Math.PI;
            item.scaling = new BABYLON.Vector3(0.137, 0.137, 0.137);

            if (index === 3) {
                item.scaling = new BABYLON.Vector3(0.139, 0.139, 0.139);
                item.position = new BABYLON.Vector3(-2.8, -10.3, 1.25);
                item.computeWorldMatrix();
                item.bakeCurrentTransformIntoVertices(true);

                item.setPhysics = mesh.setPhysics;
                item.setPhysics({impostor: 'MeshImpostor', mass: 20, friction: 0});

                rotor.holderAddJoint(item);
            } else {
                item.position = new BABYLON.Vector3(-3, -10.8, 18);
                // item.isVisible = false
                item.parent = roller
            }
        });

        Array.from([
            'Volum_Base_Glass_Mesh',
            'Import_glass001_Mesh.029',
            'Import_glass002_Mesh.040',
            'Import_glass003_Mesh.051',
            'Import_glass_Mesh.007',
            'export_Glass_Mesh.018'
        ], item => scene.getMeshByName(item).material = materials.glass);

        scene.getMeshByName('Body_Mesh.002').material = materials.createTexture({
            texture: 'roller/Body_Base_Color',
            format: 'png'
        });
    };

    assetsManager.load();
};

let spheresWall = [];

const toggleSpheresPhysic = (physic) => {
    Array.from(spheresWall, (item, index) => {
        if (index > 34) {
            physic ? item.setPhysics({restitution: 0, friction: 0}) : item.physicsImpostor.dispose();
        }
    });
};

const startTheGame = () => {
    // setTimeout(() => {
    Array.from(balls[`${balls.currentIndex}`], item => item.physicsImpostor.setMass(10));
    // }, 3000);
};

const run = (rotor) => {
    toggleSpheresPhysic(true);

    setTimeout(() => {
        rotor.runRotor(10);

        // setTimeout(() => showWinnings(), 1000);
    }, 3000);
};

// const wheelMove = (isRun) => {
//     if (isRun) {
//         this.wheel.position = new BABYLON.Vector3(0.05, -1.5, 0);
//         this.wheel.physicsImpostor = new BABYLON.PhysicsImpostor(this.wheel, BABYLON.PhysicsImpostor.SphereImpostor, {mass: 20});
//         this.holder.physicsImpostor = new BABYLON.PhysicsImpostor(this.holder, BABYLON.PhysicsImpostor.SphereImpostor, {mass: 0});
//         this.holder.physicsImpostor.addJoint(this.wheel.physicsImpostor, this.joint1);
//         this.joint1.setMotor(10)
//     } else {
//         this.wheel.dispose();
//         this.holder.dispose();
//         this.createWheel();
//     }
// }

const createRollerWalls = () => {
    let alpha = 2.06;

    const wall1 = mesh.createBox({
        size: {x: 12, y: 12, z: 12},
        position: {x: 0, y: -1, z: 9.8},
        material: materials['yellow']
    });

    const wall2 = mesh.createBox({
        size: {x: 12, y: 12, z: 12},
        position: {x: 0, y: -1, z: 23.4},
        material: materials['yellow']
    });

    Array.from([wall1, wall2], item => {
        item.isVisible = false;
        item.setPhysics({impostor: 'BoxImpostor', restitution: 1, friction: 1});
    });

    spheresWall = Array.from({length: 45}, () => {
        const sphere = mesh.createSphere({
            diameter: 2.5,
            position: {x: -0.22 + (6.45 * Math.cos(alpha)), y: -0.6 + (6.45 * Math.sin(alpha)), z: 16.3},
            material: materials['yellow'],
        });

        sphere.setPhysics({restitution: 0, friction: 0});
        // sphere.isVisible = false;
        alpha += 0.15;

        return sphere;
    });

    toggleSpheresPhysic(false);
};


const createRoom = (scene) => {
    let start = false;
    const rotor = createRotor();

    createRoller(scene, rotor);

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
            run(rotor);
            start = true;
        }

        // if (allowDestroyBall) {
        //     removeBall();
        //     allowDestroyBall = false;
        // }
    });

    createRollerWalls();
};


class Lotto {


    main() {
        const hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("textures/environment.dds", scene);

        const plastic = new BABYLON.PBRMaterial("plastic", scene);
        // plastic.reflectionTexture = hdrTexture;
        plastic.microSurface = 0.96;
        plastic.backFaceCulling = false;
        plastic.alpha = 0.2;
        plastic.albedoColor = new BABYLON.Color3(0.206, 0.94, 1);
        plastic.reflectivityColor = new BABYLON.Color3(0.003, 0.003, 0.003);
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
