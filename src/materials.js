const random = (min, max) => Math.floor(min + Math.random() * (max + 1 - min));

const colors = {
    'black': '#000',
    'yellow': '#ffed45'
};

const timeout = (ms) => {
    return new Promise(resolve => {
        setTimeout(() => resolve(), ms)
    })
};

const materials = {
    scene: null,
    createColor(color, hex) {
        this[color] = new BABYLON.StandardMaterial(`${color}`, this.scene);
        this[color].diffuseColor = new BABYLON.Color3.FromHexString(hex);
        this[color].emissiveColor = new BABYLON.Color3.FromHexString(hex);

        return this[color];
    },

    createTexture({texture, format = 'jpg', transparent = false}) {
        this[texture] = new BABYLON.StandardMaterial(`${texture}`, this.scene);
        this[texture].diffuseTexture = new BABYLON.Texture(`assets/${texture}.${format}`, this.scene);
        this[texture].diffuseTexture.hasAlpha = transparent;

        return this[texture];
    },

    createGlass() {
        this.glass = new BABYLON.PBRMaterial("plastic", this.scene);
        // plastic.reflectionTexture = hdrTexture;
        this.glass.microSurface = 0.96;
        this.glass.backFaceCulling = false;
        this.glass.alpha = 0.2;
        this.glass.albedoColor = new BABYLON.Color3(0.206, 0.94, 1);
        this.glass.reflectivityColor = new BABYLON.Color3(0.003, 0.003, 0.003);
    },

    setColors() {
        Array.from(Object.entries(colors), item => this.createColor(item[0], item[1]));
        this.createGlass();
    }
};

const mesh = {
    scene: null,

    createPlane({width, height, ...generalParams}) {
        const plane = BABYLON.MeshBuilder.CreatePlane('plane', {width, height}, this.scene);
        this._generalParams(plane, generalParams);

        return plane;
    },

    createSphere({diameter, ...generalParams}) {
        const sphere = BABYLON.MeshBuilder.CreateSphere('sphere', {diameter}, this.scene);
        this._generalParams(sphere, generalParams);

        return sphere;
    },

    createBox({size, ...generalParams}) {
        const box = new BABYLON.MeshBuilder.CreateBox("box", {
            width: size.x,
            depth: size.z,
            height: size.y
        }, this.scene);
        this._generalParams(box, generalParams);

        return box;
    },

    setPhysics({impostor = 'SphereImpostor', mass = 0, restitution = 0, friction = 0.7, group, mask}) {
        this.physicsImpostor = new BABYLON.PhysicsImpostor(this, BABYLON.PhysicsImpostor[impostor], {
            mass,
            friction,
            restitution,
            group, // Сталкиваться будут те объекты, что имеют одинаковые маску и группу
            mask
        }, this.scene);
    },

    _generalParams(mesh, {position, rotation = new BABYLON.Vector3(0, 0, 0), material}) {
        mesh.position.set(position.x, position.y, position.z);
        mesh.rotation.set(rotation.x, rotation.y, rotation.z);
        mesh.material = material;
        mesh.setPhysics = this.setPhysics;
    },
};

const draw = () => {
    const addTextToThePlane = async (plane, textNode, resolve) => {
        for (let count = 0; count < 3; count++) {
            plane.addControl(textNode);
            await timeout(300);

            plane.removeControl(textNode);
            await timeout(300);
        }

        plane.addControl(textNode);
        resolve()
    };

    const leftPlane = mesh.createPlane({
        width: 30,
        height: 30,
        position: {x: -32, y: 0, z: 19.9}
    });

    const rightPlane = mesh.createPlane({
        width: 30,
        height: 30,
        position: {x: 32, y: 0, z: 19.9}
    });

    const leftTextPlane = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(leftPlane);
    const rightTextPlane = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(rightPlane);

    return {
        async drawText({text, left, top, direction}) {
            const textNode = new BABYLON.GUI.TextBlock();

            textNode.text = text;
            textNode.color = '#000';
            textNode.fontSize = '46px';
            textNode.fontWeight = 'bold';
            textNode.left = left;
            textNode.top = top;

            return new Promise(resolve => {
                return addTextToThePlane(direction === 'left' ? leftTextPlane : rightTextPlane, textNode, resolve);
            })
        },

        removeTextNodes() {
            Array.from(leftTextPlane.getChildren()[0].children, textNode => leftTextPlane.removeControl(textNode));
            Array.from(rightTextPlane.getChildren()[0].children, textNode => rightTextPlane.removeControl(textNode));
        }
    };
};

export {materials, mesh, draw, random, timeout};
