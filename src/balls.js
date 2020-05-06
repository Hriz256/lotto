import {materials, mesh} from "./materials";

const balls = {
    winBalls: [],
    winBallsImg: [],
    currentIndex: 0
};

const createBalls = (mass, ballIndex) => {
    const ballsX = [-1.7, -0.7, 0.4, 1.4];

    const spheresArray = Array.from({length: 10}, (item, index) => {
        const sphere = mesh.createSphere({
            diameter: 0.6,
            position: {x: ballsX[ballIndex ? ballIndex : balls.currentIndex], y: 5 + index * 0.6, z: 16.7},
            material: materials.createTexture({texture: `${index}`, format: 'png'})
        });

        sphere.setPhysics({mass, friction: 1, restitution: 0.4});

        return sphere;
    });

    balls[`${ballIndex ? ballIndex : balls.currentIndex}`] = [...spheresArray];
};

export {balls, createBalls}
