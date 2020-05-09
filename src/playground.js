import {materials, mesh} from "./materials";
import {balls, createBalls, showWinnings} from "./balls";

const timeout = (ms) => {
    return new Promise(resolve => {
        setTimeout(() => resolve(), ms)
    })
};

const createRotor = rotor => {
    rotor[0].previousRotorSpeed = rotor[0].speed = 0;
    rotor[0].setPhysics = mesh.setPhysics;

    return {
        async rotate(forceFactor) {
            this.setPhysics(true);

            while (+rotor[0].speed.toFixed(2) !== +forceFactor.toFixed(2)) {
                rotor[0].speed += rotor[0].previousRotorSpeed ? rotor[0].previousRotorSpeed / -10 : forceFactor / 10;
                await timeout(300);
            }

            rotor[0].previousRotorSpeed = forceFactor;
        },

        setPhysics(allow) {
            allow ?
                rotor[0].setPhysics({impostor: 'MeshImpostor', mass: 0, friction: 0, group: 2, mask: 2}) :
                rotor[0].physicsImpostor.dispose();
        },

        getHolder() {
            return rotor[0];
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

const createRoller = (scene) => {
    const assetsManager = new BABYLON.AssetsManager(scene);
    const rollerTask = assetsManager.addMeshTask('Roller', "", 'assets/roller/', 'roller.obj');
    const rotorTask = assetsManager.addMeshTask('Rotor', "", 'assets/roller/', 'rotor.obj');

    assetsManager.load();

    rollerTask.onSuccess = ({loadedMeshes}) => {
        Array.from(loadedMeshes, item => {
            item.rotation.y = Math.PI;
            item.scaling.set(0.137, 0.137, 0.137);
            item.position.set(-3, -10.8, 18);

            if (item.material.name.toLowerCase().includes('glass')) {
                item.material = materials.glass
            } else if (item.material.name.toLowerCase().includes('body')) {
                item.material = materials.createTexture({
                    texture: 'roller/Body_Base_Color',
                    format: 'png'
                });
            }
        });
    };

    return new Promise(resolve => {
        rotorTask.onSuccess = ({loadedMeshes}) => {
            Array.from(loadedMeshes, item => {
                item.rotation.y = Math.PI;
                item.scaling.set(0.137, 0.137, 0.137);
                item.position.set(-0.25, -0.65, 16.7);
            });

            resolve(loadedMeshes);
        };
    })
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
    await rotor.rotate(0.2);

    showWinnings()
};

const endTheGame = async (rotor, walls) => {
    rotor.setPhysics(false);
    await rotor.rotate(0);

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

const createRoom = async (scene) => {
    let start = false;
    let allowCompleteEndFunction = false;

    const roller = await createRoller(scene);
    const rotor = createRotor(roller);

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
            console.log(1)
            endTheGame(rotor, walls);
            start = true;
            allowCompleteEndFunction = false;
        }

        rotor.getHolder().rotate(BABYLON.Axis.Z, rotor.getHolder().speed);
    });
};

document.getElementById('start').addEventListener('click', () => allowPlay());

export {createRoom};
