import {materials, mesh, random} from "./materials";

const balls = {
    winBallsInPipe: [],
    winBallsImg: [],
    currentIndex: 0,
    allowStart: false,

    setMass(mass) {
        Array.from(this[`${this.currentIndex}`], item => item.physicsImpostor.setMass(mass));
    },

    isAllBallsFell() {
        return this[`${this.currentIndex}`].every(i => i.position.y < 0);
    },

    clearBallsArray() {
        this.interval = setInterval(() => {
            if (!this[`${this.currentIndex}`].length) {
                clearInterval(this.interval);

                return;
            }

            const ballIndex = this[`${this.currentIndex}`].findIndex(ball =>
                ball.position.y < -4.5 &&
                ball.position.x > -2 &&
                ball.position.x < 2
            );

            ballIndex !== -1 && this.removeBall(ballIndex);
        }, 100);
    },

    removeBall(ballIndex) {
        this[`${this.currentIndex}`][ballIndex].dispose();
        this[`${this.currentIndex}`].splice(ballIndex, 1);
    }
};

const createBalls = () => {
    const ballsX = [-1.5, -0.5, 0.5, 1.5];

    Array.from({length: ballsX.length}, (i, ballIndex) => {

        balls[`${ballIndex}`] = Array.from({length: 10}, (item, index) => {
            const mat = materials.createTexture({texture: `${index}`, format: 'png'});
            mat.diffuseTexture.uOffset = random(1, 9) / 10;
            mat.diffuseTexture.vOffset = random(1, 9) / 10;

            const sphere = mesh.createSphere({
                diameter: 0.7,
                position: {x: ballsX[ballIndex ? ballIndex : balls.currentIndex], y: 5 + index * 0.7, z: 16.7},
                material: mat
            });

            sphere.setPhysics({mass: 0, friction: 1, restitution: 0.8, group: 2, mask: 2});

            return sphere;
        });

    });
};

const showWinBall = (number) => {
    const ballsPosition = [
        new BABYLON.Vector3(-8.2, -16.3, 19.8),
        new BABYLON.Vector3(-2.7, -16.1, 19.8),
        new BABYLON.Vector3(2.7, -16.1, 19.8),
        new BABYLON.Vector3(8.2, -16.3, 19.8),
    ];

    const winBall = mesh.createPlane({
        width: 3.7,
        height: 3.7,
        position: ballsPosition[balls.winBallsImg.length],
        material: materials.createTexture({texture: `balls/Ball_${number}`, format: 'png', transparent: true})
    });

    balls.winBallsImg.push(winBall);
};

const showWinnings = () => {
    const number = random(0, 9);
    const ballIndex = balls[`${balls.currentIndex}`].findIndex(item => item.material.name === `${number}`);

    showWinBall(number);
    balls.removeBall(ballIndex);

    const newWinBall = mesh.createSphere({
        diameter: 0.7,
        position: {x: 0, y: -5.7, z: 16.5},
        material: materials.createTexture({texture: `${number}`, format: 'png'})
    });

    newWinBall.setPhysics({mass: 2, friction: 0, restitution: 0.4, group: 1, mask: 1});
    balls.winBallsInPipe.push(newWinBall);

    balls.clearBallsArray();
};

export {balls, createBalls, showWinnings}
