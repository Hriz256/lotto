import {materials, mesh} from "./materials";
import {balls, createBalls, showWinnings} from "./balls";


const timeout = (ms) => {
    return new Promise(resolve => {
        setTimeout(() => resolve(), ms)
    })
};

const createRotor = () => {
    let previousRotorSpeed = 0;
    let rotorOne = null;
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
            rotorOne = rotor;
            holder.physicsImpostor.addJoint(rotor.physicsImpostor, joint1);
        },

        async runRotor(forceFactor) {
            let speed = previousRotorSpeed;
            previousRotorSpeed = forceFactor;
            rotorOne.physicsImpostor.wakeUp();

            const stopRotor = () => {
                if (forceFactor) {
                    speed++
                } else {
                    // if (speed > 3) {
                    speed--;
                    // } else {
                    //     speed -= speed * (1 - Math.abs(rotorOne.rotationQuaternion.w));
                    //     console.log(rotorOne.rotationQuaternion.w)
                    //     // if (speed < 1) {
                    //     //
                    //     // }
                    // }
                }

                joint1.setMotor(speed);
            };

            while (speed !== forceFactor) {
                stopRotor();
                await timeout(300);
            }

            return true;
        },

        getRotor() {
            return rotorOne;
        }
    }
};

const createBallCollector = () => {
    const walls = {
        back: {
            position: {x: 2, y: -7, z: 18},
        },
        front: {
            position: {x: 2, y: -7, z: 15},
        },
        right: {
            position: {x: 5.8, y: -7, z: 17},
            rotation: {x: 0, y: Math.PI / 2, z: 0}
        },
        bottom: {
            position: {x: 2, y: -8.5, z: 16},
            rotation: {x: 0, y: 0, z: -Math.PI / 34}
        },
        left: {
            position: {x: -0.5, y: -9.25, z: 16},
            rotation: {x: 0, y: 0, z: -Math.PI / 3}
        }
    };

    Array.from(Object.values(walls), item => {
        const wall = mesh.createBox({
            size: {x: 6, y: 3, z: 2},
            position: item.position,
            rotation: item.rotation,
            material: materials['yellow']
        });

        wall.setPhysics({impostor: 'BoxImpostor', group: 1, mask: 1});
        wall.isVisible = false;
    });
};

const createRollerWalls = () => {
    let alpha = 2.06;

    const walls = Array.from([9.8, 23.4], z => {
        const wall = mesh.createBox({
            size: {x: 12, y: 12, z: 12},
            position: {x: 0, y: -1, z},
            material: materials['yellow']
        });

        wall.isVisible = false;

        return wall;
    });

    const spheresWall = Array.from({length: 65}, () => {
        const sphere = mesh.createSphere({
            diameter: 2.5,
            position: {x: -0.22 + (6.48 * Math.cos(alpha)), y: -0.6 + (6.48 * Math.sin(alpha)), z: 16.3},
            material: materials['yellow'],
        });

        sphere.setPhysics({restitution: 0.5, friction: 0.5, group: 2, mask: 2});
        sphere.isVisible = false;
        alpha += 0.1;

        return sphere;
    });

    return {
        setWallPhysics() {
            Array.from(walls, item => item.setPhysics({
                impostor: 'BoxImpostor',
                restitution: 1,
                friction: 1,
                group: 2,
                mask: 2
            }));
        },

        toggleSpheresPhysic(physic) {
            Array.from(spheresWall, (item, index) => {
                if (index > 52) {
                    physic ? item.setPhysics({
                        restitution: 0.5,
                        friction: 0.5,
                        group: 2,
                        mask: 2
                    }) : item.physicsImpostor.dispose();
                }
            });
        }
    }
};

const createRoller = (scene, rotor) => {
    const assetsManager = new BABYLON.AssetsManager(scene);
    const meshTask = assetsManager.addMeshTask('Roller', "", 'assets/roller/', 'roller.obj');

    meshTask.onSuccess = ({loadedMeshes}) => {
        Array.from(loadedMeshes, (item, index) => {
            item.rotation.y = Math.PI;
            item.scaling = new BABYLON.Vector3(0.137, 0.137, 0.137);

            if (index === 3) {
                item.scaling = new BABYLON.Vector3(0.139, 0.139, 0.139);
                item.position = new BABYLON.Vector3(-2.79, -10.29, 1.25);

                // следующи 2 строки нужны для того, чтобы сохранить изменения позиции

                item.computeWorldMatrix();
                item.bakeCurrentTransformIntoVertices(true);

                item.setPhysics = mesh.setPhysics;
                item.setPhysics({impostor: 'MeshImpostor', mass: 50, friction: 0, group: 2, mask: 2});

                rotor.holderAddJoint(item);
            } else {
                item.position = new BABYLON.Vector3(-3, -10.8, 18);
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

const allowPlay = () => {
    balls.allowStart = !balls.allowStart;

    document.getElementById('start').textContent = balls.allowStart ? 'Стоп' : 'Старт';
};

const startTheGame = (walls) => {
    walls.setWallPhysics();
    balls.setMass(10);
};

const run = async (rotor, walls) => {
    walls.toggleSpheresPhysic(true); // Включаем физику у окружающих сфер

    await timeout(2000);
    await rotor.runRotor(10);

    showWinnings()
};

const endTheGame = async (rotor, walls) => {
    await rotor.runRotor(0);
    walls.toggleSpheresPhysic(false);
    await timeout(2000);

    balls.currentIndex++;

    if (balls.currentIndex === balls.quantity) {
        document.getElementById('start').textContent = 'Старт';
        createBalls();
    } else {
        balls.allowStart = true;
    }
};

const createRoom = (scene) => {
    let start = false;
    let allowCompleteEndFunction = false;

    const rotor = createRotor();
    createRoller(scene, rotor);

    createBalls();

    const walls = createRollerWalls();

    // После создания стены из сфер делаем некоторые из них "нефизичными", чтобы они не мешали падению шариков
    walls.toggleSpheresPhysic(false);

    createBallCollector(); // стены вокруг трубы, в которую падают выигрышные шарики

    const bg = mesh.createPlane({
        width: 85,
        height: 42.3,
        position: {x: 0, y: 0, z: 20},
        material: materials.createTexture({texture: 'Stage', format: 'png'})
    });

    scene.registerBeforeRender(() => {
        const bool = balls.isAllBallsFell(); // если все шары упали

        if (bool && start) {
            run(rotor, walls);
            start = false;
        }

        if (balls.allowStart) {
            startTheGame(walls);
            start = true;
            allowCompleteEndFunction = true;
            balls.allowStart = false;
        }

        if (!balls[`${balls.currentIndex}`].length && allowCompleteEndFunction) {
            endTheGame(rotor, walls);
            start = true;
            allowCompleteEndFunction = false;
        }
    });
};

document.getElementById('start').addEventListener('click', () => allowPlay());

export {createRoom};
