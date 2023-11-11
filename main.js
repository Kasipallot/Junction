import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders/glTF';
import * as GUI from '@babylonjs/gui'
import { Inspector } from '@babylonjs/inspector';
import ammo from 'ammo.js';

const Ammo = await ammo.bind(window)();
const canvas = document.getElementById('renderCanvas');

const engine = new BABYLON.WebGPUEngine(canvas);
await engine.initAsync();
let slotMachineMesh; // Declare it in a higher scope

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
  const physicsPlugin = new BABYLON.AmmoJSPlugin(true, Ammo);
  scene.enablePhysics(new BABYLON.Vector3(0, -18, 0), physicsPlugin);

  const utilLayer = new BABYLON.UtilityLayerRenderer(scene);

  var ground = BABYLON.MeshBuilder.CreateBox("ground", { width: 200, depth: 200, height: 2.5 }, scene);
  ground.position.y = -1;
  ground.visibility = 0;
  ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.5, restitution: 0.3 }, scene);
  // var advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
  // Create a coin template with physics properties but not visible
  var coinMeshes = await BABYLON.SceneLoader.ImportMeshAsync("", "/assets/", "mario_coin.glb", scene);
  var coin = coinMeshes.meshes[0];
  coin.scaling.scaleInPlace(0.06);
  // Rotate 90 degrees so the face is up
  coin.rotate(new BABYLON.Vector3(1, 0, 0), Math.PI / 2);
  coin.visibility = 0;

  var coins = []; // Array to hold all coins

  for (var i = 0; i < 10; i++) {
    for (var j = 0; j < 10; j++) {
      var coinClone = coin.clone("coinClone" + i + j);
      coinClone.visibility = 1;
      coinClone.position.y = 20;
      coinClone.position.x = (i - 5) * 1.4 - 10;
      coinClone.position.z = (j - 5) * 1.4;
      var shootDirection = new BABYLON.Vector3(Math.random(), 1, Math.random()).normalize();
      coinClone.physicsImpostor = new BABYLON.PhysicsImpostor(coinClone, BABYLON.PhysicsImpostor.CylinderImpostor, { mass: 1, friction: 0.5, restitution: 1 }, scene);
      coinClone.physicsImpostor.applyImpulse(shootDirection.scale(100), coinClone.getAbsolutePosition());
      coins.push(coinClone); // Add the coin to the array
    }
  }
  // Function to create an invisible box
  var a = 0
  function createInvisibleBox(scene, position) {
    a += 1
    var box = BABYLON.MeshBuilder.CreateBox("box" + a, { size: 0.1 }, scene);
    box.position = position;
    box.visibility = 0; // Make the box invisible
    return box;
  }

  // Example of creating two invisible boxes
  var box1 = createInvisibleBox(scene, new BABYLON.Vector3(0, 4, -5));
  var box2 = createInvisibleBox(scene, new BABYLON.Vector3(1, 4, -5));
  var box3 = createInvisibleBox(scene, new BABYLON.Vector3(-1, 4, -5));
  var z = 0
  function shootCoinFromBox(box) {
    z += 1
    var coinClone = coin.clone(z + "coinClone");
    coinClone.visibility = 1;
    coinClone.position = box.position.clone(); // Start at the box's position

    // Add physics to the coin
    coinClone.physicsImpostor = new BABYLON.PhysicsImpostor(coinClone, BABYLON.PhysicsImpostor.CylinderImpostor, { mass: 1000, friction: 10, restitution: 1 }, scene);

    // Apply an impulse to shoot the coin
    var shootDirection = new BABYLON.Vector3(Math.random(), 1, Math.random()).normalize();
    coinClone.physicsImpostor.applyImpulse(shootDirection.scale(100), coinClone.getAbsolutePosition());
  }

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  const light = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(0, 1, 0),
    scene
  );

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0.7;

  const slotMachine = await BABYLON.SceneLoader.ImportMeshAsync("", "/assets/", "crazyslots5.glb", scene);
  const casino = await BABYLON.SceneLoader.ImportMeshAsync("", "/assets/", "blacklodge1.glb", scene);

  slotMachineMesh = slotMachine.meshes[0];
  slotMachineMesh.scaling.scaleInPlace(2.8);

  const casinoMesh = casino.meshes[0];
  casinoMesh.rotate(new BABYLON.Vector3(0, 1, 0), Math.PI * 3 / 4);
  casinoMesh.position.x = -49;
  casinoMesh.position.z = -12;

  ground.receiveShadows = true;

  scene.onPointerDown = function castRay() {
    const hit = scene.pick(scene.pointerX, scene.pointerY);

    if (hit.pickedMesh && hit.pickedMesh.name === "mySphere") {
      hit.pickedMesh.material = new BABYLON.StandardMaterial();
      hit.pickedMesh.material.diffuseColor = BABYLON.Color3.Red();
    }
  };
  const cameraTarget = slotMachineMesh.position.add(new BABYLON.Vector3(-2, 10, -1));
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
  b8.id = "WIN";
  b8.textContent = "WIN";
  b8.style.display = "block";
  b8.style.width = "100%";
  b8.style.fontSize = "1.1em";
  buttonbox.appendChild(b8);
  b8.onclick = function () {
    //setCamLateralLeft();
  };

  var b9 = document.createElement("button");
  b9.id = "LOSE";
  b9.textContent = "LOSE";
  b9.style.display = "block";
  b9.style.width = "100%";
  b9.style.fontSize = "1.1em";
  buttonbox.appendChild(b9);
  b9.onclick = function () {
    //setCamLateralRight();
  };

  var b10 = document.createElement("button");
  b10.id = "ZoomIn";
  b10.textContent = "Zoom In";
  b10.style.display = "block";
  b10.style.width = "100%";
  b10.style.fontSize = "1.1em";
  buttonbox.appendChild(b10);
  b10.onclick = function () {
    setCamDefault();
  };

  var b11 = document.createElement("button");
  b11.id = "ZoomOut";
  b11.textContent = "Zoom Out";
  b11.style.display = "block";
  b11.style.width = "100%";
  b11.style.fontSize = "1.1em";
  buttonbox.appendChild(b11);
  b11.onclick = function () {
    setCamLateralLeft();
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
    BABYLON.Animation.CreateAndStartAnimation('at4', cam, 'position', speed, frameCount, cam.position, newPos, 0, ease);


    // Rotation animation
    var rotationEase = new BABYLON.CubicEase();
    rotationEase.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
    BABYLON.Animation.CreateAndStartAnimation('rotationAnimation', cam, 'rotation', speed, frameCount, cam.rotation, newRotation, 0, rotationEase);
  }

  var speed = 45;
  var frameCount = 200;

  var setCamDefault = function () {
    animateCameraTargetToPosition(camera, speed, frameCount, new BABYLON.Vector3(0, 0, 0));
    animateCameraToPosition(camera, speed, frameCount, new BABYLON.Vector3(-2, 10, -1));
  };
  var setCamLateralLeft = function () {
    animateCameraTargetToPosition(camera, speed, frameCount, new BABYLON.Vector3(5, 15, 0));
    animateCameraToPosition(camera, speed, frameCount, new BABYLON.Vector3(-85, 15, 0));
  };
  var setCamLateralRight = function () {
    animateCameraTargetToPosition(camera, speed, frameCount, new BABYLON.Vector3(-5, 15, 0));
    animateCameraToPosition(camera, speed, frameCount, new BABYLON.Vector3(85, 15, 0));
  };
  return scene;
};

const scene = await createScene();

engine.runRenderLoop(function () {
  if (slotMachineMesh) {
    //console.log(camera.position.x, camera.position.y)
  }
  scene.render();
});

window.addEventListener("resize", function () {
  engine.resize();
});

Inspector.Show(scene, {});
