import * as BABYLON from "babylonjs";

const balls = {
    winBalls: [],
    winBallsImg: []
};

let allowDestroyBall = false;
let currentIndex = 1;

const createSphere = ({x = 0, y = 0, z = 0, diameter = 0, mass = 0, restitution = 0, material, physicsAllow = true, friction = 0, scene}) => {
    const sphere = BABYLON.Mesh.CreateSphere("sphere", 32, diameter, scene);

    sphere.material = material;
    sphere.position = new BABYLON.Vector3(x, y, z);

    sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, {
        mass,
        restitution,
        friction
    }, scene);

    return sphere;
};

const createMaterial = ({name, scale = 1, scene}) => {
    const material = new BABYLON.StandardMaterial(`${name}`, scene);

    material.diffuseTexture = new BABYLON.Texture(`assets/${name}.png`, scene);
    material.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);
    material.diffuseTexture.uScale = scale;
    material.diffuseTexture.vScale = scale;

    return material;
};

const createRoller = (scene) => {
    const assetsManager = new BABYLON.AssetsManager(scene);
    const meshTask = assetsManager.addMeshTask('Roller', "", 'assets/', 'roller.obj');

    meshTask.onSuccess = ({loadedMeshes}) => {
        const roller = new BABYLON.Mesh('roller', scene);

        Array.from(loadedMeshes, item => item.parent = roller);

        roller.rotation.y = Math.PI;
        roller.position.y = -2;
        roller.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1);

        roller.physicsImpostor = new BABYLON.PhysicsImpostor(roller, BABYLON.PhysicsImpostor.MeshImpostor, {
            mass: 0
        }, scene);

        for (let index = 0; index < 10; index++) {
            const sphere = createSphere({
                x: 0,
                y: 15 + index * 0.55,
                z: 2,
                diameter: 0.55,
                material: null,
                mass: 0,
                friction: 1,
                restitution: 0.4
            });

            sphere.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 0, 0));
        }
    };

    assetsManager.load();
};

const createRoom = (scene) => {
    const groundMat = new BABYLON.StandardMaterial("groundMat", scene);
    groundMat.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
    groundMat.emissiveColor = new BABYLON.Color3(0.2, 0.2, 0.2);
    groundMat.backFaceCulling = false;

    createRoller(scene);

    // this.createBg();

    const black = new BABYLON.StandardMaterial("mat", scene);
    black.diffuseColor = new BABYLON.Color3(0, 0, 0);
    const bgImg = createMaterial({name: 'Stage', scene});
    const bodyImg = createMaterial({name: 'Body', scene});
    bodyImg.diffuseTexture.hasAlpha = true;
    const glassImg = createMaterial({name: 'glass', scene});
    glassImg.diffuseTexture.hasAlpha = true;

    const bg = BABYLON.MeshBuilder.CreatePlane("bg", {
        width: 85,
        height: 42.3
    }, scene, true, BABYLON.MeshBuilder.FRONTSIDE);
    bg.position = new BABYLON.Vector3(0, 0, 20);
    bg.material = bgImg;

    // const body = BABYLON.MeshBuilder.CreatePlane("body", {width: 10, height: 18.2}, scene, true);
    // body.position = new BABYLON.Vector3(0, 1, 4);
    // body.material = bodyImg;
    //
    // const bodyBlack = BABYLON.MeshBuilder.CreatePlane("body", {width: 9, height: 10}, scene, true);
    // bodyBlack.position = new BABYLON.Vector3(0, -3, 4.5);
    // bodyBlack.material = black;
    // this.createWheel();

    // const wall1 = this.createBox({z: -5.4, y: -1.5, material: this.groundMat, size: 9, restitution: 1});
    // wall1.scaling.x = 1.5;
    // wall1.scaling.y = 1.5;
    //
    // const wall2 = this.createBox({z: 5.4, y: -1.5, material: this.groundMat, size: 9, restitution: 1});
    // wall2.scaling.x = 1.5;
    // wall2.scaling.y = 1.5;
    //
    // setVisibility(wall1, false);
    // setVisibility(wall2, false);

    // this.createSpheresWall();
};

const main = (scene) => {
    // this.metall = this.createMaterial('metall');
    // const hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("assets/environment.dds", scene);
    //
    // const plastic = new BABYLON.PBRMaterial("plastic", scene);
    // // plastic.reflectionTexture = hdrTexture;
    // plastic.microSurface = 0.96;
    // plastic.backFaceCulling = false;
    // plastic.alpha = 0.2;
    // plastic.albedoColor = new BABYLON.Color3(0.206, 0.94, 1);
    // plastic.reflectivityColor = new BABYLON.Color3(0.003, 0.003, 0.003);
    //
    // const outCylinder = BABYLON.Mesh.CreateCylinder("cylinder", 2, 8.2, 8, 32, 1, scene, false);
    // const insideCylinder = BABYLON.Mesh.CreateCylinder("cylinder", 2, 7.4, 7.4, 32, 1, scene, false);
    //
    // const glass = BABYLON.Mesh.CreateCylinder("cylinder", 2.2, 7.4, 7.4, 32, 1, scene, false);
    // const hole1 = BABYLON.Mesh.CreateCylinder("cylinder", 4.2, 0.64, 0.64, 16, 1, scene, false);
    // const hole12 = BABYLON.Mesh.CreateCylinder("cylinder", 4, 0.62, 0.62, 16, 1, scene, false);
    // const hole2 = hole1.clone("cylinder");
    // const hole3 = hole1.clone("cylinder");
    // const hole4 = hole1.clone("cylinder");
    //
    // outCylinder.rotation.x = Math.PI / 2;
    // insideCylinder.rotation.x = Math.PI / 2;
    // glass.rotation.x = Math.PI / 2;
    //
    // hole1.position = new BABYLON.Vector3(-1.1, 4, 0);
    // hole12.position = new BABYLON.Vector3(-1.1, 4, 0);
    // hole2.position = new BABYLON.Vector3(-0.35, 4, 0);
    // hole3.position = new BABYLON.Vector3(0.45, 4, 0);
    // hole4.position = new BABYLON.Vector3(1.3, 4, 0);
    //
    // const aCSG = BABYLON.CSG.FromMesh(insideCylinder);
    // const bCSG = BABYLON.CSG.FromMesh(outCylinder);
    // const cCSG = BABYLON.CSG.FromMesh(glass);
    //
    // const dCSG1 = BABYLON.CSG.FromMesh(hole1);
    // const dCSG12 = BABYLON.CSG.FromMesh(hole12);
    // const dCSG2 = BABYLON.CSG.FromMesh(hole2);
    // const dCSG3 = BABYLON.CSG.FromMesh(hole3);
    // const dCSG4 = BABYLON.CSG.FromMesh(hole4);
    //
    // // Set up a MultiMaterial
    //
    // const subCSG1 = cCSG.subtract(aCSG);
    // const drumPart1 = subCSG1.toMesh("csg1", plastic, scene);
    // drumPart1.position = new BABYLON.Vector3(0.05, -1.5, 0);
    // drumPart1.scaling.x = 1.05;
    //
    // const subCSG2 = bCSG.subtract(aCSG).subtract(dCSG1).subtract(dCSG2).subtract(dCSG3).subtract(dCSG4);
    // const drumPart2 = subCSG2.toMesh("csg2", this.metall, scene);
    // drumPart2.position = new BABYLON.Vector3(0.05, -1.5, 0);
    // drumPart2.scaling.x = 1.05;
    //
    // const subCSG3 = dCSG1.subtract(dCSG12);
    // const pipe = subCSG3.toMesh("csg3", plastic, scene);
    // pipe.position = new BABYLON.Vector3(-1.9, -5.95, 2);
    // pipe.rotation = new BABYLON.Vector3(Math.PI / 2, Math.PI / 2.8, 0);
    //
    // // const subCSG4 = eCSG1.subtract(aCSG).subtract(eCSG2);
    // // const drumPart4 = subCSG4.toMesh("csg4", plastic, scene);
    // // drumPart4.position = new BABYLON.Vector3(-0.7, 4, 0);
    //
    // setVisibility(outCylinder, false);
    // setVisibility(insideCylinder, false);
    // setVisibility(glass, false);
    // setVisibility(hole1, false);
    // setVisibility(hole2, false);
    // setVisibility(hole3, false);
    // setVisibility(hole4, false);
    // setVisibility(hole12, false);

    // this.createBalls(0, 1);
    // this.createBalls(0, 2);
    // this.createBalls(0, 3);
    // this.createBalls(0, 4);

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

    createSpheresWall() {
        let alpha = -0.9;

        this.spheresWall = [];

        for (let i = 0; i < 124; i++) {
            const sphere = this.createSphere({
                x: -10,
                y: 5,
                z: 0,
                diameter: 2.5,
                material: this.metall,
                restitution: 1,
                friction: 1
            });

            sphere.position = new BABYLON.Vector3(5 * Math.cos(alpha), -1.5 + (-4.92 * Math.sin(alpha)), 0);

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

        this.createPipeSphere();
    }

    createPipeSphere() {
        setVisibility(this.createBox({x: -2, y: -6, z: 7, size: 6.2}), false);
        setVisibility(this.createBox({x: -5, y: -6.3, z: 3.3, size: 2}), false);

        const box = BABYLON.Mesh.CreateBox("box", 5.0, scene);
        box.position = new BABYLON.Vector3(-1.8, -8.98, 3.5);
        box.rotation.z += Math.PI / 30;

        box.physicsImpostor = new BABYLON.PhysicsImpostor(box, BABYLON.PhysicsImpostor.BoxImpostor, {
            mass: 0
        }, scene);

        setVisibility(box, false);
        setVisibility(this.createBox({x: -3, y: -6, z: 1.8, size: 3}), false);
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

    createWheel() {
        this.holder = this.createSphere({diameter: 0.01, material: this.groundMat, physicsAllow: false});
        this.wheel = this.createSphere({
            z: 0,
            y: -1.5,
            x: 0.05,
            diameter: 0.001,
            material: this.groundMat,
            physicsAllow: false
        });

        const b = BABYLON.Mesh.CreateBox("box", 1.5, scene);
        b.scaling = new BABYLON.Vector3(1, 2.5, 0.1);
        b.position.y += 2.5;

        const c = BABYLON.Mesh.CreateBox("box", 1.5, scene);
        c.scaling = new BABYLON.Vector3(1, 2.5, 0.1);
        c.position = new BABYLON.Vector3(0.5, 3, 0);

        const xCSG = BABYLON.CSG.FromMesh(b);
        const yCSG = BABYLON.CSG.FromMesh(c);

        setVisibility(b);
        setVisibility(c);

        const subCSG = xCSG.subtract(yCSG);
        const box1 = subCSG.toMesh("csg2", null, scene);
        box1.parent = this.wheel;
        box1.position = new BABYLON.Vector3(-1.5, 0, 0);
        box1.rotation = new BABYLON.Vector3(Math.PI / 2, Math.PI / 2, 0);

        const box2 = box1.clone("tooth2");
        box2.position = new BABYLON.Vector3(1.5, 0, 0);
        box2.rotation = new BABYLON.Vector3(-Math.PI / 2, Math.PI / 2, 0);

        const box3 = box1.clone("tooth3");
        box3.position = new BABYLON.Vector3(0, 1.5, 0);
        box3.rotation = new BABYLON.Vector3(-Math.PI, Math.PI / 2, 0);

        const box4 = box1.clone("tooth3");
        box4.position = new BABYLON.Vector3(0.02, -1.5, 0);
        box4.rotation.x = -Math.PI / 180;

        [box1, box2, box3, box4].forEach((mesh) => {
            mesh.physicsImpostor = new BABYLON.PhysicsImpostor(mesh, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0});
        });

        this.joint1 = new BABYLON.HingeJoint({
            mainPivot: new BABYLON.Vector3(0, -1.5, 0),
            connectedPivot: new BABYLON.Vector3(0, 0, 0),
            mainAxis: new BABYLON.Vector3(0, 0, -1),
            connectedAxis: new BABYLON.Vector3(0, 0, -1),
            nativeParams: {}
        });
    }

    wheelMove(isRun) {
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

    run() {
        this.toggleSpheresPhysic(true);

        setTimeout(() => {
            this.wheelMove(true);

            setTimeout(() => this.showWinnings(), 1000);
        }, 3000);
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

            sphere.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, -25, 0));
            spheresArray.push(sphere);
        }

        this.balls[`${ballIndex ? ballIndex : this.currentIndex}`] = [...spheresArray];
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

        play && lotto.startTheGame();
    }
}

let start = false;
const lotto = new Lotto();

export {createRoom};
