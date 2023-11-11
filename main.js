import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import { Inspector } from "@babylonjs/inspector";
import ammo from "ammo.js";

const Ammo = await ammo.bind(window)();
const canvas = document.getElementById("renderCanvas");
var slotSound = new Audio("/assets/mixkit-slot-machine-random-wheel-1930.wav")
const engine = new BABYLON.WebGPUEngine(canvas);
await engine.initAsync();
let slotMachine; // Declare it in a higher scope
// Increase resolution for the animation
engine.setHardwareScalingLevel(1 / window.devicePixelRatio);
class Queue {
  constructor() {
    this.elements = {};
    this.head = 0;
    this.tail = 0;
  }
  enqueue(element) {
    this.elements[this.tail] = element;
    this.tail++;
  }
  dequeue() {
    const item = this.elements[this.head];
    delete this.elements[this.head];
    this.head++;
    return item;
  }
  peek() {
    return this.elements[this.head];
  }
  get length() {
    return this.tail - this.head;
  }
  get isEmpty() {
    return this.length === 0;
  }
}

const createScene = async function () {
  const scene = new BABYLON.Scene(engine);

  // This creates and positions a free camera (non-mesh)
  const camera = new BABYLON.ArcRotateCamera(
    "my camera",
    0,
    -1,
    55,
    new BABYLON.Vector3(0, 0, 0),
    scene
  );
  camera.attachControl(canvas, true);
  camera.useFramingBehavior = true;

  camera.angularSensibilityX = 2000;
  camera.angularSensibilityY = 2000;
  camera.panningSensibility = 2000;
  camera.fov = 1.016;
  camera.lowerRadiusLimit = 12;
  camera.upperRadiusLimit = 56.5;
  camera.lowerAlphaLimit = 2.078;
  camera.upperAlphaLimit = 4.224;
  camera.upperBetaLimit = 1.73;

  const physicsPlugin = new BABYLON.AmmoJSPlugin(true, Ammo);
  scene.enablePhysics(new BABYLON.Vector3(0, -18, 0), physicsPlugin);

  const utilLayer = new BABYLON.UtilityLayerRenderer(scene);

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  const light = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(0, 1, 0),
    scene
  );

  const pointLight1 = new BABYLON.PointLight(
    "pointLight",
    new BABYLON.Vector3(-4.5, 15.5, -19),
    scene
  );

  //pointLight1.diffuse = new BABYLON.Color3(1, 0.3, 0)
  pointLight1.intensity = 300;

  const spotLight = new BABYLON.SpotLight(
    "spotLight",
    new BABYLON.Vector3(-30, 25, 12),
    new BABYLON.Vector3(1, -1, -0.5),
    Math.PI / 1.5,
    0,
    scene
  );
  spotLight.intensity = 10000;
  spotLight.shadowEnabled = true;

  //const lightGizmo = new BABYLON.LightGizmo(utilLayer);
  //lightGizmo.light = spotLight;

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0;
  //Creating the shadow generator for spotlight
  spotLight.shadowEnabled = true;
  const shadowGenerator = new BABYLON.ShadowGenerator(4096, spotLight);

  var ground = BABYLON.MeshBuilder.CreateBox(
    "ground",
    { width: 175, depth: 175, height: 2.75 },
    scene
  );
  ground.position.y = -1;
  ground.visibility = 0;
  ground.physicsImpostor = new BABYLON.PhysicsImpostor(
    ground,
    BABYLON.PhysicsImpostor.BoxImpostor,
    { mass: 0, friction: 0.5, restitution: 0 },
    scene
  );
  var wall1 = BABYLON.MeshBuilder.CreateBox(
    "wall1",
    { width: 80, depth: 5, height: 50 },
    scene
  );
  wall1.position.x = -5;
  wall1.position.z = 27;
  wall1.position.y = 25;
  wall1.rotation = new BABYLON.Vector3(0, Math.PI / 4, 0);
  wall1.visibility = 0;
  wall1.physicsImpostor = new BABYLON.PhysicsImpostor(
    wall1,
    BABYLON.PhysicsImpostor.BoxImpostor,
    { mass: 0, friction: 0.5, restitution: 0 },
    scene
  );
  var wall2 = BABYLON.MeshBuilder.CreateBox(
    "wall2",
    { width: 80, depth: 5, height: 50 },
    scene
  );
  wall2.position.x = -58;
  wall2.position.z = -28;
  wall2.position.y = 25;
  wall2.rotation = new BABYLON.Vector3(0, Math.PI / 4, 0);
  wall2.visibility = 0;
  wall2.physicsImpostor = new BABYLON.PhysicsImpostor(
    wall2,
    BABYLON.PhysicsImpostor.BoxImpostor,
    { mass: 0, friction: 0.5, restitution: 0 },
    scene
  );
  var wall3 = BABYLON.MeshBuilder.CreateBox(
    "wall3",
    { width: 80, depth: 5, height: 50 },
    scene
  );
  wall3.position.x = -3;
  wall3.position.z = -28;
  wall3.position.y = 25;
  wall3.rotation = new BABYLON.Vector3(0, -Math.PI / 4, 0);
  wall3.visibility = 0;
  wall3.physicsImpostor = new BABYLON.PhysicsImpostor(
    wall3,
    BABYLON.PhysicsImpostor.BoxImpostor,
    { mass: 0, friction: 0.5, restitution: 0 },
    scene
  );
  var wall4 = BABYLON.MeshBuilder.CreateBox(
    "wall4",
    { width: 80, depth: 5, height: 50 },
    scene
  );
  wall4.position.x = -60;
  wall4.position.z = 25;
  wall4.position.y = 25;
  wall4.rotation = new BABYLON.Vector3(0, -Math.PI / 4, 0);
  wall4.visibility = 0;
  wall4.physicsImpostor = new BABYLON.PhysicsImpostor(
    wall4,
    BABYLON.PhysicsImpostor.BoxImpostor,
    { mass: 0, friction: 0.5, restitution: 0 },
    scene
  );
  var chair1seat = BABYLON.MeshBuilder.CreateBox(
    "chair1seat",
    { width: 8, depth: 9, height: 5 },
    scene
  );
  chair1seat.position.x = -10;
  chair1seat.position.z = 21;
  chair1seat.position.y = 2.5;
  chair1seat.rotation = new BABYLON.Vector3(0, -Math.PI / 4, 0);
  chair1seat.visibility = 0;
  chair1seat.physicsImpostor = new BABYLON.PhysicsImpostor(
    chair1seat,
    BABYLON.PhysicsImpostor.BoxImpostor,
    { mass: 0, friction: 0.5, restitution: 0 },
    scene
  );
  var chair1back = BABYLON.MeshBuilder.CreateBox(
    "chair1back",
    { width: 10, depth: 3, height: 8 },
    scene
  );
  chair1back.position.x = -7.7;
  chair1back.position.z = 23.3;
  chair1back.position.y = 5;
  chair1back.rotation = new BABYLON.Vector3(0, Math.PI / 4, 0);
  chair1back.visibility = 0;
  chair1back.physicsImpostor = new BABYLON.PhysicsImpostor(
    chair1back,
    BABYLON.PhysicsImpostor.BoxImpostor,
    { mass: 0, friction: 0.5, restitution: 0 },
    scene
  );
  var chair1right = BABYLON.MeshBuilder.CreateBox(
    "chair1right",
    { width: 8, depth: 2, height: 7 },
    scene
  );
  chair1right.position.x = -14;
  chair1right.position.z = 24;
  chair1right.position.y = 3.5;
  chair1right.rotation = new BABYLON.Vector3(0, -Math.PI / 4, 0);
  chair1right.visibility = 0;
  chair1right.physicsImpostor = new BABYLON.PhysicsImpostor(
    chair1right,
    BABYLON.PhysicsImpostor.BoxImpostor,
    { mass: 0, friction: 0.5, restitution: 0 },
    scene
  );
  var chair1left = BABYLON.MeshBuilder.CreateBox(
    "chair1left",
    { width: 8, depth: 2, height: 7 },
    scene
  );
  chair1left.position.x = -6.5;
  chair1left.position.z = 17;
  chair1left.position.y = 3.5;
  chair1left.rotation = new BABYLON.Vector3(0, -Math.PI / 4, 0);
  chair1left.visibility = 0;
  chair1left.physicsImpostor = new BABYLON.PhysicsImpostor(
    chair1left,
    BABYLON.PhysicsImpostor.BoxImpostor,
    { mass: 0, friction: 0.5, restitution: 0 },
    scene
  );

  // Chair 2 rotated 90 degrees clockwise compared to chair 1
  var chair2seat = BABYLON.MeshBuilder.CreateBox(
    "chair2seat",
    { width: 8, depth: 9, height: 5 },
    scene
  );
  chair2seat.position.x = -11;
  chair2seat.position.z = -26;
  chair2seat.position.y = 2.5;
  chair2seat.rotation = new BABYLON.Vector3(0, -Math.PI / 4, 0);
  chair2seat.visibility = 0;
  chair2seat.physicsImpostor = new BABYLON.PhysicsImpostor(
    chair2seat,
    BABYLON.PhysicsImpostor.BoxImpostor,
    { mass: 0, friction: 0.5, restitution: 0 },
    scene
  );

  var chair2back = BABYLON.MeshBuilder.CreateBox(
    "chair2back",
    { width: 10, depth: 3, height: 8 },
    scene
  );
  chair2back.position.x = -8.7;
  chair2back.position.z = -28.3;
  chair2back.position.y = 5;
  chair2back.rotation = new BABYLON.Vector3(0, -Math.PI / 4, 0);
  chair2back.visibility = 0;
  chair2back.physicsImpostor = new BABYLON.PhysicsImpostor(
    chair2back,
    BABYLON.PhysicsImpostor.BoxImpostor,
    { mass: 0, friction: 0.5, restitution: 0 },
    scene
  );

  var chair2right = BABYLON.MeshBuilder.CreateBox(
    "chair2right",
    { width: 8, depth: 2, height: 7.2 },
    scene
  );
  chair2right.position.x = -7.5;
  chair2right.position.z = -22.5;
  chair2right.position.y = 3.5;
  chair2right.rotation = new BABYLON.Vector3(0, Math.PI / 4, 0);
  chair2right.visibility = 0;
  chair2right.physicsImpostor = new BABYLON.PhysicsImpostor(
    chair2right,
    BABYLON.PhysicsImpostor.BoxImpostor,
    { mass: 0, friction: 0.5, restitution: 0 },
    scene
  );

  var chair2left = BABYLON.MeshBuilder.CreateBox(
    "chair2left",
    { width: 8, depth: 2, height: 7.2 },
    scene
  );
  chair2left.position.x = -14.5;
  chair2left.position.z = -29.5;
  chair2left.position.y = 3.5;
  chair2left.rotation = new BABYLON.Vector3(0, Math.PI / 4, 0);
  chair2left.visibility = 0;
  chair2left.physicsImpostor = new BABYLON.PhysicsImpostor(
    chair2left,
    BABYLON.PhysicsImpostor.BoxImpostor,
    { mass: 0, friction: 0.5, restitution: 0 },
    scene
  );

  // Chair 3, left of chair 2
  var chair3seat = BABYLON.MeshBuilder.CreateBox(
    "chair3seat",
    { width: 8, depth: 9, height: 5 },
    scene
  );
  chair3seat.position.x = -19.75;
  chair3seat.position.z = -34.75;
  chair3seat.position.y = 2.5;
  chair3seat.rotation = new BABYLON.Vector3(0, -Math.PI / 4, 0);
  chair3seat.visibility = 0;
  chair3seat.physicsImpostor = new BABYLON.PhysicsImpostor(
    chair3seat,
    BABYLON.PhysicsImpostor.BoxImpostor,
    { mass: 0, friction: 0.5, restitution: 0 },
    scene
  );

  var chair3back = BABYLON.MeshBuilder.CreateBox(
    "chair3back",
    { width: 10, depth: 3, height: 8 },
    scene
  );
  chair3back.position.x = -17.45;
  chair3back.position.z = -37.05;
  chair3back.position.y = 5;
  chair3back.rotation = new BABYLON.Vector3(0, -Math.PI / 4, 0);
  chair3back.visibility = 0;
  chair3back.physicsImpostor = new BABYLON.PhysicsImpostor(
    chair3back,
    BABYLON.PhysicsImpostor.BoxImpostor,
    { mass: 0, friction: 0.5, restitution: 0 },
    scene
  );

  var chair3right = BABYLON.MeshBuilder.CreateBox(
    "chair3right",
    { width: 8, depth: 2, height: 7.2 },
    scene
  );
  chair3right.position.x = -16.25;
  chair3right.position.z = -31.25;
  chair3right.position.y = 3.5;
  chair3right.rotation = new BABYLON.Vector3(0, Math.PI / 4, 0);
  chair3right.visibility = 0;
  chair3right.physicsImpostor = new BABYLON.PhysicsImpostor(
    chair3right,
    BABYLON.PhysicsImpostor.BoxImpostor,
    { mass: 0, friction: 0.5, restitution: 0 },
    scene
  );

  var chair3left = BABYLON.MeshBuilder.CreateBox(
    "chair3left",
    { width: 8, depth: 2, height: 7.2 },
    scene
  );
  chair3left.position.x = -23.25;
  chair3left.position.z = -38.25;
  chair3left.position.y = 3.5;
  chair3left.rotation = new BABYLON.Vector3(0, Math.PI / 4, 0);
  chair3left.visibility = 0;
  chair3left.physicsImpostor = new BABYLON.PhysicsImpostor(
    chair3left,
    BABYLON.PhysicsImpostor.BoxImpostor,
    { mass: 0, friction: 0.5, restitution: 0 },
    scene
  );

  // Table, only one and only top has physics
  var tabletop = BABYLON.MeshBuilder.CreateBox(
    "tabletop",
    { width: 4.7, depth: 7, height: 1 },
    scene
  );
  tabletop.position.x = -3.1;
  tabletop.position.z = 13.1;
  tabletop.position.y = 5;
  tabletop.rotation = new BABYLON.Vector3(0, Math.PI / 4, 0);
  tabletop.visibility = 0;
  tabletop.physicsImpostor = new BABYLON.PhysicsImpostor(
    tabletop,
    BABYLON.PhysicsImpostor.BoxImpostor,
    { mass: 0, friction: 0.5, restitution: 0 },
    scene
  );
  // var advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
  // Create a coin template with physics properties but not visible
  // var coinMeshes = await BABYLON.SceneLoader.ImportMeshAsync("", "/assets/", "mario_coin.glb", scene);
  // var coin = coinMeshes.meshes[0];
  // coin.scaling.scaleInPlace(0.06);
  // // Rotate 90 degrees so the face is up
  // coin.rotate(new BABYLON.Vector3(1, 0, 0), Math.PI / 2);
  // coin.visibility = 0;
  var coin = BABYLON.MeshBuilder.CreateCylinder(
    "coin",
    { diameter: 1, height: 0.2 },
    scene
  );
  var coinMat = new BABYLON.StandardMaterial("coinMaterial", scene);
  coinMat.diffuseColor = new BABYLON.Color3(1, 0.843, 0);
  coinMat.specularPower = 256;
  coin.material = coinMat;
  coin.visibility = 0;
  coin.shadowEnabled = true;
  shadowGenerator.addShadowCaster(coin);
  coin.receiveShadows = true;

  // Function to create an invisible box
  var a = 0;
  function createInvisibleBox(scene, position) {
    a += 1;
    var box = BABYLON.MeshBuilder.CreateBox("box" + a, { size: 0.1 }, scene);
    box.position = position;
    box.visibility = 0; // Make the box invisible
    return box;
  }
  const coinQueue = new Queue();
  // Example of creating two invisible boxes
  var box1 = createInvisibleBox(scene, new BABYLON.Vector3(-10, 45, 5));
  var box2 = createInvisibleBox(scene, new BABYLON.Vector3(-10, 45, -5));
  var box3 = createInvisibleBox(scene, new BABYLON.Vector3(-10, 45, 0));
  var box4 = createInvisibleBox(scene, new BABYLON.Vector3(-3, 2, -3));
  var box5 = createInvisibleBox(scene, new BABYLON.Vector3(-3, 2, -1));
  var box6 = createInvisibleBox(scene, new BABYLON.Vector3(-3, 2, 1));
  var z = 0;
  function shootCoinFromBox(box) {
    z += 1;
    var coinClone = coin.clone(z + "coinClone");
    coinClone.visibility = 1;
    coinClone.position = box.position.clone(); // Start at the box's position
    // Adding the spotlight shadows for the coin clones
    coinClone.receiveShadows = true;
    shadowGenerator.addShadowCaster(coinClone);
    // Add physics to the coin
    coinClone.physicsImpostor = new BABYLON.PhysicsImpostor(
      coinClone,
      BABYLON.PhysicsImpostor.CylinderImpostor,
      { mass: 1, friction: 10, restitution: 0 },
      scene
    );
    // Set random rotation
    var randomRotationX = Math.random() * 2 * Math.PI; // Random rotation around X axis
    var randomRotationY = Math.random() * 2 * Math.PI; // Random rotation around Y axis
    var randomRotationZ = Math.random() * 2 * Math.PI; // Random rotation around Z axis
    coinClone.rotation = new BABYLON.Vector3(
      randomRotationX,
      randomRotationY,
      randomRotationZ
    );
    // Apply an impulse to shoot the coin
    var shootDirection = new BABYLON.Vector3(
      2 * (Math.random() - 0.5),
      2 * (Math.random() - 0.5),
      2 * (Math.random() - 0.5)
    );
    coinClone.physicsImpostor.applyImpulse(
      shootDirection.scale(20),
      coinClone.getAbsolutePosition()
    );
    coinQueue.enqueue(coinClone);
    if (coinQueue.length > 360) {
      coinQueue.dequeue().dispose();
    }
  }
  function shootCoinFromMachine(box) {
    z += 1;
    var coinClone = coin.clone(z + "coinClone" + z);
    coinClone.visibility = 1;
    coinClone.position = box.position.clone(); // Start at the box's position

    // Add physics to the coin
    coinClone.physicsImpostor = new BABYLON.PhysicsImpostor(
      coinClone,
      BABYLON.PhysicsImpostor.CylinderImpostor,
      { mass: 1, friction: 10, restitution: 0 },
      scene
    );
    // Set random rotation
    var randomRotationX = Math.random() * 2 * Math.PI; // Random rotation around X axis
    var randomRotationY = Math.random() * 2 * Math.PI; // Random rotation around Y axis
    var randomRotationZ = Math.random() * 2 * Math.PI; // Random rotation around Z axis
    coinClone.rotation = new BABYLON.Vector3(
      randomRotationX,
      randomRotationY,
      randomRotationZ
    );
    // Apply an impulse to shoot the coin
    var shootDirection = new BABYLON.Vector3(
      -4 + Math.random() - 0.5,
      2 + Math.random() - 0.5,
      Math.random() - 0.5
    );
    coinClone.physicsImpostor.applyImpulse(
      shootDirection.scale(10),
      coinClone.getAbsolutePosition()
    );
    coinClone.actionManager = new BABYLON.ActionManager(scene);
    coinClone.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        {
          trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
          parameter: ground,
        },
        function () {
          coinClone.dispose();
        }
      )
    );
  }

  slotMachine = await BABYLON.SceneLoader.ImportMeshAsync(
    "",
    "/assets/",
    "crazyslots15.glb",
    scene
  );
  const casino = await BABYLON.SceneLoader.ImportMeshAsync(
    "",
    "/assets/",
    "blacklodge23.glb",
    scene
  );
  slotMachine.animationGroups.forEach((animationGroup, index) => {
    // Start playing each animation group
    animationGroup.stop();
  });

  const slotMachineMesh = slotMachine.meshes[0];
  slotMachineMesh.scaling.scaleInPlace(2.8);
  //Shadows for slotMachine
  slotMachineMesh.receiveShadows = true;
  shadowGenerator.addShadowCaster(slotMachineMesh);

  const casinoMesh = casino.meshes[0];
  casinoMesh.rotate(new BABYLON.Vector3(0, 1, 0), (Math.PI * 3) / 4);
  casinoMesh.position.x = -49;
  casinoMesh.position.z = -12;
  
  //Adding shadows for all casino meshes
  for (let i = 0; i < casino.meshes.length; i++) {
    casino.meshes[i].receiveShadows = true;
    shadowGenerator.addShadowCaster(casino.meshes[i])
  }

  const cameraTarget = slotMachineMesh.position.add(
    new BABYLON.Vector3(-2, 10, -1)
  );
  camera.setTarget(cameraTarget);

  // add buttons
  var buttonbox = document.createElement("div");
  buttonbox.id = "buttonbox";
  buttonbox.style.position = "absolute";
  buttonbox.style.top = "60px";
  buttonbox.style.left = "85%";
  buttonbox.style.border = "5pt inset blue";
  buttonbox.style.padding = "2pt";
  buttonbox.style.paddingRight = "2pt";
  buttonbox.style.width = "10em";
  buttonbox.style.display = "block";
  document.body.appendChild(buttonbox);

  var tTag = document.createElement("div");
  tTag.id = "choose";
  tTag.textContent = "Actions:";
  tTag.style.textAlign = "center";
  tTag.style.border = "2pt solid gold";
  tTag.style.marginLeft = "1.5pt";
  tTag.style.marginTop = "3pt";
  tTag.style.marginBottom = "2pt";
  tTag.style.backgroundColor = "dodgerblue";
  tTag.style.width = "96%";
  tTag.style.fontSize = "1.0em";
  tTag.style.color = "white";
  buttonbox.appendChild(tTag);

  var b8 = document.createElement("button");
  b8.id = "PLAY";
  b8.textContent = "PLAY";
  b8.style.display = "block";
  b8.style.width = "100%";
  b8.style.fontSize = "1.1em";
  buttonbox.appendChild(b8);
  b8.onclick = function () {
    slotMachine.animationGroups.forEach((animationGroup, index) => {
      // Start playing each animation group
      slotSound.play();
      animationGroup.start();
    });
    for (let i = 0; i < 30; i++) {
      setTimeout(function () {
        shootCoinFromBox(box1);
        shootCoinFromBox(box2);
        shootCoinFromBox(box3);
      }, 3000 + 15 * i); // Delay increases with each iteration
    }
    for (let i = 0; i < 15; i++) {
      setTimeout(function () {
        shootCoinFromMachine(box4);
        shootCoinFromMachine(box5);
        shootCoinFromMachine(box6);
      }, 4000 + 150 * i); // Delay increases with each iteration
    }
  };


  var b10 = document.createElement("button");
  b10.id = "ZoomIn";
  b10.textContent = "Zoom In";
  b10.style.display = "block";
  b10.style.width = "100%";
  b10.style.fontSize = "1.1em";
  buttonbox.appendChild(b10);
  b10.onclick = function () {
    zoomIn();
  };

  var b11 = document.createElement("button");
  b11.id = "ZoomOut";
  b11.textContent = "Zoom Out";
  b11.style.display = "block";
  b11.style.width = "100%";
  b11.style.fontSize = "1.1em";
  buttonbox.appendChild(b11);
  b11.onclick = function () {
    zoomOut();
  };
  //-----------------------------------------------------------
  // camera movers
  var animateCameraTargetToPosition = function (
    cam,
    speed,
    frameCount,
    newPos
  ) {
    var ease = new BABYLON.CubicEase();

    ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);

    BABYLON.Animation.CreateAndStartAnimation(
      "at5",
      cam,
      "target",
      speed,
      frameCount,
      cam.target,
      newPos,
      0,
      ease
    );
  };
  var animateCameraToPosition = function (cam, speed, frameCount, newPos) {
    var ease = new BABYLON.CubicEase();
    ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
    BABYLON.Animation.CreateAndStartAnimation(
      "at4",
      cam,
      "position",
      speed,
      frameCount,
      cam.position,
      newPos,
      0,
      ease
    );

    // Rotation animation
    var rotationEase = new BABYLON.CubicEase();
    rotationEase.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
    BABYLON.Animation.CreateAndStartAnimation(
      "rotationAnimation",
      cam,
      "rotation",
      speed,
      frameCount,
      cam.rotation,
      newRotation,
      0,
      rotationEase
    );
  };

  var speed = 100;
  var frameCount = 150;

  var zoomIn = function () {
    animateCameraTargetToPosition(
      camera,
      speed,
      frameCount,
      new BABYLON.Vector3(-2, 10, -1)
    );
    animateCameraToPosition(
      camera,
      speed,
      frameCount,
      new BABYLON.Vector3(-20, 12, 10)
    );
  };
  var zoomOut = function () {
    animateCameraTargetToPosition(
      camera,
      speed,
      frameCount,
      new BABYLON.Vector3(-2, 10, -1)
    );
    animateCameraToPosition(
      camera,
      speed,
      frameCount,
      new BABYLON.Vector3(-50, 15, 0)
    );
  };
 
  return scene;
};

const scene = await createScene();

engine.runRenderLoop(function () {
  //if (slotMachineMesh) {
  //console.log(camera.position.x, camera.position.y)
  //}
  scene.render();
});

window.addEventListener("resize", function () {
  engine.resize();
});

Inspector.Show(scene, {});
