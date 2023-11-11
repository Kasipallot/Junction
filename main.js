import * as BABYLON from '@babylonjs/core';
//import '@babylonjs/loaders/glTF';
//import {Inspector} from '@babylonjs/inspector';

const canvas = document.getElementById('renderCanvas');

const engine = new BABYLON.WebGPUEngine(canvas);
await engine.initAsync();

const CreateScene = function() {
  const scene = new BABYLON.Scene(engine);

  scene.createDefaultCameraOrLight(true, false, true);
  scene.environmentTexture = new BABYLON.CubeTexture("https://assets.babylonjs.com/environments/environmentSpecular.env", scene);
  new BABYLON.EnvironmentHelper({ 
    skyboxTexture: "https://assets.babylonjs.com/environments/environmentSpecular.env", 
    createGround: false 
}, scene)
  const box = new BABYLON.MeshBuilder.CreateBox()
    
  return scene;
}

const scene = CreateScene();

engine.runRenderLoop(function() {
  scene.render();
})