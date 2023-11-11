import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders/glTF';
import { Inspector } from '@babylonjs/inspector';

const canvas = document.getElementById('renderCanvas');

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

  const ground = new BABYLON.MeshBuilder.CreateGround('', {
    height: 5,
    width: 10,
    subdivisions: 5,
    subdivisionsX: 10
  });

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  const light = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(0, 1, 0),
    scene
  );

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0.7;

  const slotMachine = await BABYLON.SceneLoader.ImportMeshAsync("", "/assets/", "crazyslots.glb", scene);
  const slotMachineMesh = slotMachine.meshes[0];

  ground.receiveShadows = true;

  scene.onPointerDown = function castRay() {
    const hit = scene.pick(scene.pointerX, scene.pointerY);

    if (hit.pickedMesh && hit.pickedMesh.name === 'mySphere') {
      hit.pickedMesh.material = new BABYLON.StandardMaterial();
      hit.pickedMesh.material.diffuseColor = BABYLON.Color3.Red();
    }
  }
  camera.setTarget(slotMachineMesh.position.add(new BABYLON.Vector3(0, 3, 0)));


  return scene;
}

const scene = await createScene();

engine.runRenderLoop(function () {
  scene.render();
});

window.addEventListener('resize', function () {
  engine.resize();
});

Inspector.Show(scene, {});