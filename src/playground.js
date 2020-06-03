import {materials, mesh, draw, timeout} from "./materials";
import {balls, showWinnings} from "./balls";

const toggleStartBtn = show => {
    const btn = document.getElementById('start');

    btn.style.opacity = `${show ? 1 : 0.5}`;
    show ? btn.removeAttribute('disabled') : btn.setAttribute('disabled', 'disabled');
};

const drawWinBalls = () => {
    const drawFunc = draw();
    let offsetX = 0;
    let offsetY = 0;

    return {
        async draw(winNumbers) {
            const leftAnimText = drawFunc.drawText({
                text: winNumbers,
                left: `${100 - offsetX * 250}px`,
                top: `${456 - offsetY * 65}px`,
                direction: 'left'
            });

            const rightAnimText = drawFunc.drawText({
                text: winNumbers,
                left: `${-115 + offsetX * 250}px`,
                top: `${456 - offsetY * 65}px`,
                direction: 'right'
            });

            this.changeOffset();

            return Promise.all([leftAnimText, rightAnimText]);
        },

        changeOffset() {
            offsetY++;

            if (balls.restartsCount === 4 || balls.restartsCount === 14) {
                offsetY++;
            } else if (balls.restartsCount === 9) {
                offsetX++;
                offsetY = 0;
            }

            balls.restartsCount++;
        }
    };
};

const createRotor = rotorInstance => {
    const rotor = rotorInstance.loadedMeshes;

    Array.from(rotor, item => {
        item.rotation.y = Math.PI;
        item.scaling.set(0.137, 0.137, 0.137);
        item.position.set(-0.25, -0.65, 16.7);
    });

    rotor[0].previousRotorSpeed = rotor[0].speed = 0;
    rotor[0].setPhysics = mesh.setPhysics;

    return {
        async rotate(forceFactor) {
            while (+rotor[0].speed.toFixed(2) !== +forceFactor.toFixed(2)) {
                rotor[0].speed += rotor[0].previousRotorSpeed ? rotor[0].previousRotorSpeed / -10 : forceFactor / 10;
                console.log(+rotor[0].speed.toFixed(2), 'speed');
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
            position: {x: 0, y: 0, z},
            material: materials['yellow']
        });

        wall.isVisible = false;

        return wall;
    });

    // const spheresWall = Array.from({length: 18}, () => {
    //     const box = mesh.createBox({
    //         size: {x: 4, y: 10, z: 3},
    //         position: {x: -0.22 + (6.5 * Math.cos(alpha)), y: -0.5 + (6.5 * Math.sin(alpha)), z: 16},
    //         material: materials['yellow'],
    //     });
    //
    //     box.lookAt(new BABYLON.Vector3(-0.22, -0.5, 16));
    //     box.isVisible = false;
    //     box.setPhysics({restitution: 0.3, friction: 0.5, group: 2, mask: 2});
    //     alpha += 0.35;
    //
    //     return box;
    // });

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
                        restitution: 0.8,
                        friction: 0.5,
                        group: 2,
                        mask: 2
                    }) : item.physicsImpostor.dispose();
                }
            });
        }
    }
};

const createRoller = (scene, roller) => {
    Array.from(roller.loadedMeshes, item => {
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

const startTheGame = (walls) => {
    walls.setWallPhysics();
    balls.setMass(10);
};

const run = async (rotor, walls) => {
    walls.toggleSpheresPhysic(true); // Включаем физику у окружающих сфер

    await timeout(2000);
    rotor.setPhysics(true);
    await rotor.rotate(0.14);

    setTimeout(showWinnings, 10000);
};

const endTheGame = async (rotor, walls, draw, sphereInstance) => {
    await rotor.rotate(0);
    rotor.setPhysics(false); // выключаем физику, чтоб мячи проходили сквозь него

    walls.toggleSpheresPhysic(false);
    await timeout(2000);

    if (++balls.currentIndex === balls.quantity) {
        const winNumbers = balls.winBallsInPipe.reduce((acc, item) => acc + `${item.material.name} `, '');

        balls.restart();
        await draw.draw(winNumbers);
        await timeout(1000);
        await balls.createBalls(sphereInstance, 200);

        toggleStartBtn(true);
    } else {
        balls.allowStart = true;
    }
};

const createRoom = async (scene, tasks) => {
    let start = false;
    let allowCompleteEndFunction = false;

    createBallCollector(); // стены вокруг трубы, в которую падают выигрышные шарики
    createRoller(scene, tasks[0]);
    const rotor = createRotor(tasks[1]);

    const walls = createRollerWalls();
    // После создания стены из сфер делаем некоторые из них "нефизичными", чтобы они не мешали падению шариков
    walls.toggleSpheresPhysic(false);

    const bg = mesh.createPlane({
        width: 85,
        height: 42.3,
        position: {x: 0, y: 0, z: 20},
        material: materials.createTexture({texture: 'Stage', format: 'png'})
    });

    const draw = drawWinBalls();

    await balls.createBalls(tasks[2], 0);

    scene.registerBeforeRender(() => {
        const bool = balls.currentIndex !== balls.quantity && balls.isAllBallsFell(); // если все шары упали

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

        // const isTrue = balls[`${balls.currentIndex}`].some(i => i.position.y < -10);

        // isTrue && alert(isTrue);

        if (balls[`${balls.currentIndex}`] && !balls[`${balls.currentIndex}`].length && allowCompleteEndFunction) {
            endTheGame(rotor, walls, draw, tasks[2]);
            start = true;
            allowCompleteEndFunction = false;
        }

        rotor.getHolder().rotate(BABYLON.Axis.Z, rotor.getHolder().speed);
    });
};

document.getElementById('start').addEventListener('click', e => {
    balls.allowStart = !balls.allowStart;

    toggleStartBtn(false);
});

export {createRoom};
