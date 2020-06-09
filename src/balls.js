import {materials, mesh, random, timeout} from "./materials";

const balls = {
    quantity: 4,
    winBallsInPipe: [],
    winBallsImg: [],
    currentIndex: 0,
    allowStart: false,
    restartsCount: 0,

    '0': [],
    '1': [],
    '2': [],
    '3': [],

    setMass(mass) {
        Array.from(this[`${this.currentIndex}`], item => item.physicsImpostor.setMass(mass));
    },

    isAllBallsFell() {
        return this[`${this.currentIndex}`].every(i => i.position.y < -4) && this[`${this.currentIndex}`].length;
    },

    clearBallsArray() {
        this.interval = setInterval(() => {
            if (!this[`${this.currentIndex}`].length) {
                clearInterval(this.interval);

                return;
            }

            const ballIndex = this[`${this.currentIndex}`].findIndex(ball =>
                (ball.position.y < -4.5 && ball.position.x > -1.2 && ball.position.x < 1.2) ||
                (ball.position.x < -6 || ball.position.x > 6 || ball.position.y < -10)
            );

            ballIndex !== -1 && this.removeBall(ballIndex);
        }, 100);
    },

    removeBall(ballIndex) {
        this[`${this.currentIndex}`][ballIndex].dispose();
        this[`${this.currentIndex}`].splice(ballIndex, 1);
    },

    createBalls(sphereInstance, delay) {
        return new Promise(async (resolve) => {
            for (let index = 0; index < 10; index++) {

                Array.from({length: this.quantity}, (item, ballIndex) => {
                    const sphere = sphereInstance.loadedMeshes[0].clone('sphere');
                    sphere.rotation.set(Math.random(), Math.random(), Math.random());
                    sphere.position.set(-1.5 + ballIndex, 5.15 + index * 0.7, 16.6);
                    sphere.material = materials.createTexture({texture: `${index}`, format: 'png'});
                    sphere.isVisible = true;
                    sphere.setPhysics = mesh.setPhysics;
                    sphere.setPhysics({mass: 0, friction: 1, restitution: 0.7, group: 2, mask: 2});

                    this[`${ballIndex}`].push(sphere);
                });

                await timeout(delay);
            }

            resolve();
        })
    },

    restart() {
        this.restartsCount++;

        Array.from([...this.winBallsInPipe, ...this.winBallsImg], item => item.dispose());
        this.winBallsInPipe.length = 0;
        this.winBallsImg.length = 0;

        balls.currentIndex = 0;
    },
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
    const ball = balls[`${balls.currentIndex}`][ballIndex];

    showWinBall(number);
    balls[`${balls.currentIndex}`].splice(ballIndex, 1);

    ball.position.set(0, -5.7, 16.5);
    ball.setPhysics({mass: 2, friction: 0, restitution: 0, group: 1, mask: 1});
    balls.winBallsInPipe.push(ball);

    balls.clearBallsArray();
};

export {balls, showWinnings}
