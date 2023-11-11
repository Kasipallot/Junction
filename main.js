import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import { Inspector } from "@babylonjs/inspector";

const canvas = document.getElementById("renderCanvas");

const engine = new BABYLON.Engine(canvas);

const createScene = async function () {
  const scene = new BABYLON.Scene(engine);

  // This creates and positions a free camera (non-mesh)
  const camera = new BABYLON.ArcRotateCamera(
    "my first camera",
    0,
    -1,
    5,
    new BABYLON.Vector3(-7, 0, 0),
    scene
  );
  camera.attachControl(canvas, true);
  camera.useFramingBehavior = true;

  const utilLayer = new BABYLON.UtilityLayerRenderer(scene);

  const ground = new BABYLON.MeshBuilder.CreateGround("", {
    height: 5,
    width: 10,
    subdivisions: 5,
    subdivisionsX: 10,
  });

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  const light = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(0, 1, 0),
    scene
  );

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0.7;

  const slotMachine = await BABYLON.SceneLoader.ImportMeshAsync(
    "",
    "/assets/",
    "crazyslots.glb",
    scene
  );
  const slotMachineMesh = slotMachine.meshes[0];

  ground.receiveShadows = true;

  scene.onPointerDown = function castRay() {
    const hit = scene.pick(scene.pointerX, scene.pointerY);

    if (hit.pickedMesh && hit.pickedMesh.name === "mySphere") {
      hit.pickedMesh.material = new BABYLON.StandardMaterial();
      hit.pickedMesh.material.diffuseColor = BABYLON.Color3.Red();
    }
  };
  camera.setTarget(slotMachineMesh.position.add(new BABYLON.Vector3(0, 3, 0)));
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
  var animateCameraToPosition = function(cam, speed, frameCount, newPos) {
    var ease = new BABYLON.CubicEase();
    ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
    BABYLON.Animation.CreateAndStartAnimation('at4', cam, 'position', speed, frameCount, cam.position, newPos, 0, ease);
}

var speed = 45;
var frameCount = 200;

var setCamDefault = function() {
    animateCameraTargetToPosition(camera, speed, frameCount, new BABYLON.Vector3(0, 0, 0));
    animateCameraToPosition(camera, speed, frameCount, new BABYLON.Vector3(-45, 55, -45));
};
var setCamLateralLeft = function() {
    animateCameraTargetToPosition(camera, speed, frameCount, new BABYLON.Vector3(5, 15, 0));
    animateCameraToPosition(camera, speed, frameCount, new BABYLON.Vector3(-85, 15, 0));
};
var setCamLateralRight = function() {
    animateCameraTargetToPosition(camera, speed, frameCount, new BABYLON.Vector3(-5, 15, 0));
    animateCameraToPosition(camera, speed, frameCount, new BABYLON.Vector3(85, 15, 0));
};
  return scene;
};

const scene = await createScene();

engine.runRenderLoop(function () {
  scene.render();
});

window.addEventListener("resize", function () {
  engine.resize();
});

Inspector.Show(scene, {});
