/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./balls.js":
/*!******************!*\
  !*** ./balls.js ***!
  \******************/
/*! exports provided: balls, showWinnings */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"balls\", function() { return balls; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"showWinnings\", function() { return showWinnings; });\n/* harmony import */ var _materials__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./materials */ \"./materials.js\");\n\r\n\r\nconst balls = {\r\n    quantity: 4,\r\n    winBallsInPipe: [],\r\n    winBallsImg: [],\r\n    currentIndex: 0,\r\n    allowStart: false,\r\n    restartsCount: 0,\r\n\r\n    '0': [],\r\n    '1': [],\r\n    '2': [],\r\n    '3': [],\r\n\r\n    setMass(mass) {\r\n        Array.from(this[`${this.currentIndex}`], item => item.physicsImpostor.setMass(mass));\r\n    },\r\n\r\n    isAllBallsFell() {\r\n        return this[`${this.currentIndex}`].every(i => i.position.y < -4) && this[`${this.currentIndex}`].length;\r\n    },\r\n\r\n    clearBallsArray() {\r\n        this.interval = setInterval(() => {\r\n            if (!this[`${this.currentIndex}`].length) {\r\n                clearInterval(this.interval);\r\n\r\n                return;\r\n            }\r\n\r\n            const ballIndex = this[`${this.currentIndex}`].findIndex(ball =>\r\n                (ball.position.y < -4.5 && ball.position.x > -1.2 && ball.position.x < 1.2) ||\r\n                (ball.position.x < -6 || ball.position.x > 6 || ball.position.y < -10)\r\n            );\r\n\r\n            ballIndex !== -1 && this.removeBall(ballIndex);\r\n        }, 100);\r\n    },\r\n\r\n    removeBall(ballIndex) {\r\n        this[`${this.currentIndex}`][ballIndex].dispose();\r\n        this[`${this.currentIndex}`].splice(ballIndex, 1);\r\n    },\r\n\r\n    createBalls(sphereInstance, delay) {\r\n        return new Promise(async (resolve) => {\r\n            for (let index = 0; index < 10; index++) {\r\n\r\n                Array.from({length: this.quantity}, (item, ballIndex) => {\r\n                    const sphere = sphereInstance.loadedMeshes[0].clone('sphere');\r\n                    sphere.rotation.set(Math.random(), Math.random(), Math.random());\r\n                    sphere.position.set(-1.5 + ballIndex, 5.15 + index * 0.7, 16.6);\r\n                    sphere.material = _materials__WEBPACK_IMPORTED_MODULE_0__[\"materials\"].createTexture({texture: `${index}`, format: 'png'});\r\n                    sphere.isVisible = true;\r\n                    sphere.setPhysics = _materials__WEBPACK_IMPORTED_MODULE_0__[\"mesh\"].setPhysics;\r\n                    sphere.setPhysics({mass: 0, friction: 1, restitution: 0.75, group: 2, mask: 2});\r\n\r\n                    this[`${ballIndex}`].push(sphere);\r\n                });\r\n\r\n                await Object(_materials__WEBPACK_IMPORTED_MODULE_0__[\"timeout\"])(delay);\r\n            }\r\n\r\n            resolve();\r\n        })\r\n    },\r\n\r\n    restart() {\r\n        this.restartsCount++;\r\n\r\n        Array.from([...this.winBallsInPipe, ...this.winBallsImg], item => item.dispose());\r\n        this.winBallsInPipe.length = 0;\r\n        this.winBallsImg.length = 0;\r\n\r\n        balls.currentIndex = 0;\r\n    },\r\n};\r\n\r\nconst showWinBall = (number) => {\r\n    const ballsPosition = [\r\n        new BABYLON.Vector3(-8.2, -16.3, 19.8),\r\n        new BABYLON.Vector3(-2.7, -16.1, 19.8),\r\n        new BABYLON.Vector3(2.7, -16.1, 19.8),\r\n        new BABYLON.Vector3(8.2, -16.3, 19.8),\r\n    ];\r\n\r\n    const winBall = _materials__WEBPACK_IMPORTED_MODULE_0__[\"mesh\"].createPlane({\r\n        width: 3.7,\r\n        height: 3.7,\r\n        position: ballsPosition[balls.winBallsImg.length],\r\n        material: _materials__WEBPACK_IMPORTED_MODULE_0__[\"materials\"].createTexture({texture: `balls/Ball_${number}`, format: 'png', transparent: true})\r\n    });\r\n\r\n    balls.winBallsImg.push(winBall);\r\n};\r\n\r\nconst showWinnings = () => {\r\n    const number = Object(_materials__WEBPACK_IMPORTED_MODULE_0__[\"random\"])(0, 9);\r\n    const ballIndex = balls[`${balls.currentIndex}`].findIndex(item => item.material.name === `${number}`);\r\n    const ball = balls[`${balls.currentIndex}`][ballIndex];\r\n\r\n    showWinBall(number);\r\n    balls[`${balls.currentIndex}`].splice(ballIndex, 1);\r\n\r\n    ball.position.set(0, -5.7, 16.5);\r\n    ball.setPhysics({mass: 2, friction: 0, restitution: 0, group: 1, mask: 1});\r\n    balls.winBallsInPipe.push(ball);\r\n\r\n    balls.clearBallsArray();\r\n};\r\n\r\n\r\n\n\n//# sourceURL=webpack:///./balls.js?");

/***/ }),

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _playground__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./playground */ \"./playground.js\");\n/* harmony import */ var _materials__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./materials */ \"./materials.js\");\n\r\n\r\n\r\nconst canvas = document.getElementById(\"renderCanvas\");\r\n\r\nconst createDefaultEngine = () => new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true});\r\n\r\nconst load = (scene) => {\r\n    const assetsManager = new BABYLON.AssetsManager(scene);\r\n    assetsManager.addMeshTask('Roller', '', 'assets/roller/', 'roller.obj');\r\n    assetsManager.addMeshTask('Rotor', '', 'assets/roller/', 'rotor.obj');\r\n    assetsManager.addMeshTask('Sphere', '', 'assets/', 'sphere2.obj');\r\n\r\n    assetsManager.load();\r\n\r\n    return new Promise(resolve => {\r\n        assetsManager.onFinish = tasks => resolve(tasks);\r\n    });\r\n};\r\n\r\nconst createScene = () => {\r\n    const scene = new BABYLON.Scene(engine);\r\n\r\n    const light = new BABYLON.DirectionalLight('light', new BABYLON.Vector3(0, 20, 20), scene);\r\n    light.specular = new BABYLON.Color3(0, 0, 0); // убрать блики\r\n    light.intensity = 1.25;\r\n\r\n    const camera = new BABYLON.ArcRotateCamera(\"Camera\", Math.PI / -2, Math.PI / 2, 30, new BABYLON.Vector3(0, 0, 0), scene);\r\n    camera.attachControl(canvas, true);\r\n\r\n    const ammo = new BABYLON.AmmoJSPlugin(true);\r\n    ammo.setMaxSteps(40);\r\n    ammo.setFixedTimeStep(1 / 240);\r\n    scene.enablePhysics(new BABYLON.Vector3(0, -40, 0), ammo);\r\n\r\n    _materials__WEBPACK_IMPORTED_MODULE_1__[\"mesh\"].scene = scene;\r\n    _materials__WEBPACK_IMPORTED_MODULE_1__[\"materials\"].scene = scene;\r\n\r\n    _materials__WEBPACK_IMPORTED_MODULE_1__[\"materials\"].setColors();\r\n\r\n    (async () => {\r\n        const tasks = await load(scene);\r\n        tasks[2].loadedMeshes[0].isVisible = false;\r\n        // newMeshes[0].scaling.set(0.01, 0.01, 0.01)\r\n\r\n        await Object(_playground__WEBPACK_IMPORTED_MODULE_0__[\"createRoom\"])(scene, tasks);\r\n    })();\r\n\r\n    return scene;\r\n};\r\n\r\nconst engine = createDefaultEngine();\r\nconst scene = createScene();\r\n\r\nif (!engine) throw 'engine should not be null.';\r\n\r\nengine.runRenderLoop(() => {\r\n    scene && scene.render();\r\n    document.getElementById('fps').innerHTML = engine.getFps().toFixed() + \" fps\";\r\n});\r\n\r\nengine.loadingUIBackgroundColor = \"Purple\";\r\nwindow.addEventListener(\"resize\", () => engine.resize());\r\n\n\n//# sourceURL=webpack:///./index.js?");

/***/ }),

/***/ "./materials.js":
/*!**********************!*\
  !*** ./materials.js ***!
  \**********************/
/*! exports provided: materials, mesh, draw, random, timeout */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"materials\", function() { return materials; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"mesh\", function() { return mesh; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"draw\", function() { return draw; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"random\", function() { return random; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"timeout\", function() { return timeout; });\nconst random = (min, max) => Math.floor(min + Math.random() * (max + 1 - min));\r\n\r\nconst colors = {\r\n    'black': '#000',\r\n    'yellow': '#ffed45'\r\n};\r\n\r\nconst timeout = (ms) => {\r\n    return new Promise(resolve => {\r\n        setTimeout(() => resolve(), ms)\r\n    })\r\n};\r\n\r\nconst materials = {\r\n    scene: null,\r\n    createColor(color, hex) {\r\n        this[color] = new BABYLON.StandardMaterial(`${color}`, this.scene);\r\n        this[color].diffuseColor = new BABYLON.Color3.FromHexString(hex);\r\n        this[color].emissiveColor = new BABYLON.Color3.FromHexString(hex);\r\n\r\n        return this[color];\r\n    },\r\n\r\n    createTexture({texture, format = 'jpg', transparent = false}) {\r\n        this[texture] = new BABYLON.StandardMaterial(`${texture}`, this.scene);\r\n        this[texture].diffuseTexture = new BABYLON.Texture(`assets/${texture}.${format}`, this.scene);\r\n        this[texture].diffuseTexture.hasAlpha = transparent;\r\n\r\n        return this[texture];\r\n    },\r\n\r\n    createGlass() {\r\n        this.glass = new BABYLON.PBRMaterial(\"plastic\", this.scene);\r\n        // plastic.reflectionTexture = hdrTexture;\r\n        this.glass.microSurface = 0.96;\r\n        this.glass.backFaceCulling = false;\r\n        this.glass.alpha = 0.2;\r\n        this.glass.albedoColor = new BABYLON.Color3(0.206, 0.94, 1);\r\n        this.glass.reflectivityColor = new BABYLON.Color3(0.003, 0.003, 0.003);\r\n    },\r\n\r\n    setColors() {\r\n        Array.from(Object.entries(colors), item => this.createColor(item[0], item[1]));\r\n        this.createGlass();\r\n    }\r\n};\r\n\r\nconst mesh = {\r\n    scene: null,\r\n\r\n    createPlane({width, height, ...generalParams}) {\r\n        const plane = BABYLON.MeshBuilder.CreatePlane('plane', {width, height}, this.scene);\r\n        this._generalParams(plane, generalParams);\r\n\r\n        return plane;\r\n    },\r\n\r\n    createSphere({diameter, ...generalParams}) {\r\n        const sphere = BABYLON.MeshBuilder.CreateSphere('sphere', {diameter}, this.scene);\r\n        this._generalParams(sphere, generalParams);\r\n\r\n        return sphere;\r\n    },\r\n\r\n    createBox({size, ...generalParams}) {\r\n        const box = new BABYLON.MeshBuilder.CreateBox(\"box\", {\r\n            width: size.x,\r\n            depth: size.z,\r\n            height: size.y\r\n        }, this.scene);\r\n        this._generalParams(box, generalParams);\r\n\r\n        return box;\r\n    },\r\n\r\n    setPhysics({impostor = 'SphereImpostor', mass = 0, restitution = 0, friction = 0.7, group, mask}) {\r\n        this.physicsImpostor = new BABYLON.PhysicsImpostor(this, BABYLON.PhysicsImpostor[impostor], {\r\n            mass,\r\n            friction,\r\n            restitution,\r\n            group, // Сталкиваться будут те объекты, что имеют одинаковые маску и группу\r\n            mask\r\n        }, this.scene);\r\n    },\r\n\r\n    _generalParams(mesh, {position, rotation = new BABYLON.Vector3(0, 0, 0), material}) {\r\n        mesh.position.set(position.x, position.y, position.z);\r\n        mesh.rotation.set(rotation.x, rotation.y, rotation.z);\r\n        mesh.material = material;\r\n        mesh.setPhysics = this.setPhysics;\r\n    },\r\n};\r\n\r\nconst draw = () => {\r\n    const addTextToThePlane = async (plane, textNode, resolve) => {\r\n        for (let count = 0; count < 3; count++) {\r\n            plane.addControl(textNode);\r\n            await timeout(300);\r\n\r\n            plane.removeControl(textNode);\r\n            await timeout(300);\r\n        }\r\n\r\n        plane.addControl(textNode);\r\n        resolve()\r\n    };\r\n\r\n    const leftPlane = mesh.createPlane({\r\n        width: 30,\r\n        height: 30,\r\n        position: {x: -32, y: 0, z: 19.9}\r\n    });\r\n\r\n    const rightPlane = mesh.createPlane({\r\n        width: 30,\r\n        height: 30,\r\n        position: {x: 32, y: 0, z: 19.9}\r\n    });\r\n\r\n    const leftTextPlane = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(leftPlane);\r\n    const rightTextPlane = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(rightPlane);\r\n\r\n    return {\r\n        async drawText({text, left, top, direction}) {\r\n            const textNode = new BABYLON.GUI.TextBlock();\r\n\r\n            textNode.text = text;\r\n            textNode.color = '#000';\r\n            textNode.fontSize = '46px';\r\n            textNode.fontWeight = 'bold';\r\n            textNode.left = left;\r\n            textNode.top = top;\r\n\r\n            return new Promise(resolve => {\r\n                return addTextToThePlane(direction === 'left' ? leftTextPlane : rightTextPlane, textNode, resolve);\r\n            })\r\n        },\r\n\r\n        removeTextNodes() {\r\n            Array.from(leftTextPlane.getChildren()[0].children, textNode => leftTextPlane.removeControl(textNode));\r\n            Array.from(rightTextPlane.getChildren()[0].children, textNode => rightTextPlane.removeControl(textNode));\r\n        }\r\n    };\r\n};\r\n\r\n\r\n\n\n//# sourceURL=webpack:///./materials.js?");

/***/ }),

/***/ "./playground.js":
/*!***********************!*\
  !*** ./playground.js ***!
  \***********************/
/*! exports provided: createRoom */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"createRoom\", function() { return createRoom; });\n/* harmony import */ var _materials__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./materials */ \"./materials.js\");\n/* harmony import */ var _balls__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./balls */ \"./balls.js\");\n\r\n\r\n\r\nconst toggleStartBtn = show => {\r\n    const btn = document.getElementById('start');\r\n\r\n    btn.style.opacity = `${show ? 1 : 0.5}`;\r\n    show ? btn.removeAttribute('disabled') : btn.setAttribute('disabled', 'disabled');\r\n};\r\n\r\nconst drawWinBalls = () => {\r\n    const drawFunc = Object(_materials__WEBPACK_IMPORTED_MODULE_0__[\"draw\"])();\r\n    let offsetX = 0;\r\n    let offsetY = 0;\r\n\r\n    return {\r\n        async draw(winNumbers) {\r\n            const leftAnimText = drawFunc.drawText({\r\n                text: winNumbers,\r\n                left: `${100 - offsetX * 250}px`,\r\n                top: `${456 - offsetY * 65}px`,\r\n                direction: 'left'\r\n            });\r\n\r\n            const rightAnimText = drawFunc.drawText({\r\n                text: winNumbers,\r\n                left: `${-115 + offsetX * 250}px`,\r\n                top: `${456 - offsetY * 65}px`,\r\n                direction: 'right'\r\n            });\r\n\r\n            this.changeOffset();\r\n\r\n            return Promise.all([leftAnimText, rightAnimText]);\r\n        },\r\n\r\n        changeOffset() {\r\n            offsetY++;\r\n\r\n            if (_balls__WEBPACK_IMPORTED_MODULE_1__[\"balls\"].restartsCount === 4 || _balls__WEBPACK_IMPORTED_MODULE_1__[\"balls\"].restartsCount === 14) {\r\n                offsetY++;\r\n            } else if (_balls__WEBPACK_IMPORTED_MODULE_1__[\"balls\"].restartsCount === 9) {\r\n                offsetX++;\r\n                offsetY = 0;\r\n            }\r\n\r\n            _balls__WEBPACK_IMPORTED_MODULE_1__[\"balls\"].restartsCount++;\r\n        }\r\n    };\r\n};\r\n\r\nconst createRotor = rotorInstance => {\r\n    const rotor = rotorInstance.loadedMeshes;\r\n\r\n    Array.from(rotor, item => {\r\n        item.rotation.y = Math.PI;\r\n        item.scaling.set(0.139, 0.139, 0.139);\r\n        item.position.set(-0.25, -0.67, 16.7);\r\n    });\r\n\r\n    rotor[0].previousRotorSpeed = rotor[0].speed = 0;\r\n    rotor[0].setPhysics = _materials__WEBPACK_IMPORTED_MODULE_0__[\"mesh\"].setPhysics;\r\n\r\n    return {\r\n        async rotate(forceFactor) {\r\n            while (+rotor[0].speed.toFixed(2) !== +forceFactor.toFixed(2)) {\r\n                rotor[0].speed += rotor[0].previousRotorSpeed ? rotor[0].previousRotorSpeed / -10 : forceFactor / 10;\r\n                console.log(+rotor[0].speed.toFixed(2), 'speed');\r\n                await Object(_materials__WEBPACK_IMPORTED_MODULE_0__[\"timeout\"])(300);\r\n            }\r\n\r\n            rotor[0].previousRotorSpeed = forceFactor;\r\n        },\r\n\r\n        setPhysics(allow) {\r\n            allow ?\r\n                rotor[0].setPhysics({impostor: 'MeshImpostor', mass: 0, friction: 0, group: 2, mask: 2}) :\r\n                rotor[0].physicsImpostor.dispose();\r\n        },\r\n\r\n        getHolder() {\r\n            return rotor[0];\r\n        }\r\n    }\r\n};\r\n\r\nconst createBallCollector = () => {\r\n    const walls = {\r\n        back: {\r\n            position: {x: 2, y: -7, z: 18},\r\n        },\r\n        front: {\r\n            position: {x: 2, y: -7, z: 15},\r\n        },\r\n        right: {\r\n            position: {x: 5.8, y: -7, z: 17},\r\n            rotation: {x: 0, y: Math.PI / 2, z: 0}\r\n        },\r\n        bottom: {\r\n            position: {x: 2, y: -8.5, z: 16},\r\n            rotation: {x: 0, y: 0, z: -Math.PI / 34}\r\n        },\r\n        left: {\r\n            position: {x: -0.5, y: -9.25, z: 16},\r\n            rotation: {x: 0, y: 0, z: -Math.PI / 3}\r\n        }\r\n    };\r\n\r\n    Array.from(Object.values(walls), item => {\r\n        const wall = _materials__WEBPACK_IMPORTED_MODULE_0__[\"mesh\"].createBox({\r\n            size: {x: 6, y: 3, z: 2},\r\n            position: item.position,\r\n            rotation: item.rotation,\r\n            material: _materials__WEBPACK_IMPORTED_MODULE_0__[\"materials\"]['yellow']\r\n        });\r\n\r\n        wall.setPhysics({impostor: 'BoxImpostor', group: 1, mask: 1});\r\n        wall.isVisible = false;\r\n    });\r\n};\r\n\r\nconst createRollerWalls = () => {\r\n    let alpha = 1.85;\r\n\r\n    const walls = Array.from([8.5, 23.4], z => {\r\n        const wall = _materials__WEBPACK_IMPORTED_MODULE_0__[\"mesh\"].createBox({\r\n            size: {x: 12, y: 12, z: 12},\r\n            position: {x: 0, y: 0, z},\r\n            material: _materials__WEBPACK_IMPORTED_MODULE_0__[\"materials\"]['yellow']\r\n        });\r\n\r\n        wall.isVisible = false;\r\n\r\n        return wall;\r\n    });\r\n\r\n    const spheresWall2 = Array.from({length: 65}, () => {\r\n        const sphere = _materials__WEBPACK_IMPORTED_MODULE_0__[\"mesh\"].createSphere({\r\n            diameter: 2.5,\r\n            position: {x: -0.23 + (5.5 * Math.cos(alpha)), y: -0.5 + (5.5 * Math.sin(alpha)), z: 14.5},\r\n            material: _materials__WEBPACK_IMPORTED_MODULE_0__[\"materials\"]['yellow'],\r\n        });\r\n\r\n        sphere.setPhysics({restitution: 0.75, friction: 1, group: 2, mask: 2});\r\n        sphere.isVisible = false;\r\n        alpha += 0.1;\r\n\r\n        return sphere;\r\n    });\r\n\r\n    // const spheresWall = Array.from({length: 18}, () => {\r\n    //     const box = mesh.createBox({\r\n    //         size: {x: 4, y: 10, z: 3},\r\n    //         position: {x: -0.22 + (6.5 * Math.cos(alpha)), y: -0.5 + (6.5 * Math.sin(alpha)), z: 16},\r\n    //         material: materials['yellow'],\r\n    //     });\r\n    //\r\n    //     box.lookAt(new BABYLON.Vector3(-0.22, -0.5, 16));\r\n    //     box.isVisible = false;\r\n    //     box.setPhysics({restitution: 0.3, friction: 0.5, group: 2, mask: 2});\r\n    //     alpha += 0.35;\r\n    //\r\n    //     return box;\r\n    // });\r\n\r\n    const spheresWall = Array.from({length: 65}, () => {\r\n        const sphere = _materials__WEBPACK_IMPORTED_MODULE_0__[\"mesh\"].createSphere({\r\n            diameter: 2.5,\r\n            position: {x: -0.23 + (6.48 * Math.cos(alpha)), y: -0.5 + (6.47 * Math.sin(alpha)), z: 16.3},\r\n            material: _materials__WEBPACK_IMPORTED_MODULE_0__[\"materials\"]['yellow'],\r\n        });\r\n\r\n        sphere.setPhysics({restitution: 0.75, friction: 1, group: 2, mask: 2});\r\n        sphere.isVisible = false;\r\n        alpha += 0.1;\r\n\r\n        return sphere;\r\n    });\r\n\r\n    return {\r\n        setWallPhysics() {\r\n            Array.from(walls, item => item.setPhysics({\r\n                impostor: 'BoxImpostor',\r\n                restitution: 1,\r\n                friction: 1,\r\n                group: 2,\r\n                mask: 2\r\n            }));\r\n        },\r\n\r\n        toggleSpheresPhysic(physic) {\r\n            Array.from(spheresWall, (item, index) => {\r\n                if (index > 52) {\r\n                    physic ? item.setPhysics({\r\n                        restitution: 0.75,\r\n                        friction: 1,\r\n                        group: 2,\r\n                        mask: 2\r\n                    }) : item.physicsImpostor.dispose();\r\n                }\r\n            });\r\n        }\r\n    }\r\n};\r\n\r\nconst createRoller = (scene, roller) => {\r\n    Array.from(roller.loadedMeshes, item => {\r\n        item.rotation.y = Math.PI;\r\n        item.scaling.set(0.137, 0.137, 0.137);\r\n        item.position.set(-3, -10.8, 18);\r\n\r\n        if (item.material.name.toLowerCase().includes('glass')) {\r\n            item.material = _materials__WEBPACK_IMPORTED_MODULE_0__[\"materials\"].glass\r\n        } else if (item.material.name.toLowerCase().includes('body')) {\r\n            item.material = _materials__WEBPACK_IMPORTED_MODULE_0__[\"materials\"].createTexture({\r\n                texture: 'roller/Body_Base_Color',\r\n                format: 'png'\r\n            });\r\n        }\r\n    });\r\n};\r\n\r\nconst startTheGame = (walls) => {\r\n    walls.setWallPhysics();\r\n    _balls__WEBPACK_IMPORTED_MODULE_1__[\"balls\"].setMass(10);\r\n};\r\n\r\nconst run = async (rotor, walls) => {\r\n    walls.toggleSpheresPhysic(true); // Включаем физику у окружающих сфер\r\n\r\n    await Object(_materials__WEBPACK_IMPORTED_MODULE_0__[\"timeout\"])(2000);\r\n    rotor.setPhysics(true);\r\n    await rotor.rotate(0.14);\r\n\r\n    setTimeout(_balls__WEBPACK_IMPORTED_MODULE_1__[\"showWinnings\"], 10000);\r\n};\r\n\r\nconst endTheGame = async (rotor, walls, draw, sphereInstance) => {\r\n    await rotor.rotate(0);\r\n    rotor.setPhysics(false); // выключаем физику, чтоб мячи проходили сквозь него\r\n\r\n    walls.toggleSpheresPhysic(false);\r\n    await Object(_materials__WEBPACK_IMPORTED_MODULE_0__[\"timeout\"])(2000);\r\n\r\n    if (++_balls__WEBPACK_IMPORTED_MODULE_1__[\"balls\"].currentIndex === _balls__WEBPACK_IMPORTED_MODULE_1__[\"balls\"].quantity) {\r\n        const winNumbers = _balls__WEBPACK_IMPORTED_MODULE_1__[\"balls\"].winBallsInPipe.reduce((acc, item) => acc + `${item.material.name} `, '');\r\n\r\n        _balls__WEBPACK_IMPORTED_MODULE_1__[\"balls\"].restart();\r\n        await draw.draw(winNumbers);\r\n        await Object(_materials__WEBPACK_IMPORTED_MODULE_0__[\"timeout\"])(1000);\r\n        await _balls__WEBPACK_IMPORTED_MODULE_1__[\"balls\"].createBalls(sphereInstance, 200);\r\n\r\n        toggleStartBtn(true);\r\n    } else {\r\n        _balls__WEBPACK_IMPORTED_MODULE_1__[\"balls\"].allowStart = true;\r\n    }\r\n};\r\n\r\nconst createRoom = async (scene, tasks) => {\r\n    let start = false;\r\n    let allowCompleteEndFunction = false;\r\n\r\n    createBallCollector(); // стены вокруг трубы, в которую падают выигрышные шарики\r\n    createRoller(scene, tasks[0]);\r\n    const rotor = createRotor(tasks[1]);\r\n\r\n    const walls = createRollerWalls();\r\n    // После создания стены из сфер делаем некоторые из них \"нефизичными\", чтобы они не мешали падению шариков\r\n    walls.toggleSpheresPhysic(false);\r\n\r\n    const bg = _materials__WEBPACK_IMPORTED_MODULE_0__[\"mesh\"].createPlane({\r\n        width: 85,\r\n        height: 42.3,\r\n        position: {x: 0, y: 0, z: 20},\r\n        material: _materials__WEBPACK_IMPORTED_MODULE_0__[\"materials\"].createTexture({texture: 'Stage', format: 'png'})\r\n    });\r\n\r\n    const draw = drawWinBalls();\r\n\r\n    await _balls__WEBPACK_IMPORTED_MODULE_1__[\"balls\"].createBalls(tasks[2], 0);\r\n\r\n    scene.registerBeforeRender(() => {\r\n        const bool = _balls__WEBPACK_IMPORTED_MODULE_1__[\"balls\"].currentIndex !== _balls__WEBPACK_IMPORTED_MODULE_1__[\"balls\"].quantity && _balls__WEBPACK_IMPORTED_MODULE_1__[\"balls\"].isAllBallsFell(); // если все шары упали\r\n\r\n        if (bool && start) {\r\n            run(rotor, walls);\r\n            start = false;\r\n        }\r\n\r\n        if (_balls__WEBPACK_IMPORTED_MODULE_1__[\"balls\"].allowStart) {\r\n            startTheGame(walls);\r\n            start = true;\r\n            allowCompleteEndFunction = true;\r\n            _balls__WEBPACK_IMPORTED_MODULE_1__[\"balls\"].allowStart = false;\r\n        }\r\n\r\n        // const isTrue = balls[`${balls.currentIndex}`].some(i => i.position.y < -10);\r\n\r\n        // isTrue && alert(isTrue);\r\n\r\n        if (_balls__WEBPACK_IMPORTED_MODULE_1__[\"balls\"][`${_balls__WEBPACK_IMPORTED_MODULE_1__[\"balls\"].currentIndex}`] && !_balls__WEBPACK_IMPORTED_MODULE_1__[\"balls\"][`${_balls__WEBPACK_IMPORTED_MODULE_1__[\"balls\"].currentIndex}`].length && allowCompleteEndFunction) {\r\n            endTheGame(rotor, walls, draw, tasks[2]);\r\n            start = true;\r\n            allowCompleteEndFunction = false;\r\n        }\r\n\r\n        rotor.getHolder().rotate(BABYLON.Axis.Z, rotor.getHolder().speed);\r\n    });\r\n};\r\n\r\ndocument.getElementById('start').addEventListener('click', e => {\r\n    _balls__WEBPACK_IMPORTED_MODULE_1__[\"balls\"].allowStart = !_balls__WEBPACK_IMPORTED_MODULE_1__[\"balls\"].allowStart;\r\n\r\n    toggleStartBtn(false);\r\n});\r\n\r\n\r\n\n\n//# sourceURL=webpack:///./playground.js?");

/***/ })

/******/ });