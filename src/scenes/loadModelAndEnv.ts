import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { CreateSceneClass } from "../createScene";
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import { CubeTexture } from "@babylonjs/core/Materials/Textures/cubeTexture";
import { EnvironmentHelper } from "@babylonjs/core/Helpers/environmentHelper";

// required imports
import "@babylonjs/core/Loading/loadingScreen";
import "@babylonjs/loaders/glTF";
import "@babylonjs/core/Materials/standardMaterial";
import "@babylonjs/core/Materials/Textures/Loaders/envTextureLoader";
import "@babylonjs/core/Animations/animatable"


// digital assets
import controllerModel from "../../assets/glb/samsung-controller.glb";
import slotmachineModel from "../../assets/glb/slot_machine_with_abstract_design.glb";
import roomEnvironment from "../../assets/environment/room.env"

export class LoadModelAndEnvScene implements CreateSceneClass {
    createScene = async (
        engine: Engine,
        canvas: HTMLCanvasElement
    ): Promise<Scene> => {
        // This creates a basic Babylon Scene object (non-mesh)
        const scene = new Scene(engine);

        // This creates and positions a free camera (non-mesh)
        const camera = new ArcRotateCamera(
            "my first camera",
            0,
            Math.PI,
            10,
            new Vector3(-10, 0, 0),
            scene
        );


        // This attaches the camera to the canvas
        camera.attachControl(canvas, true);

        camera.useFramingBehavior = true;

        // load the environment file
        scene.environmentTexture = new CubeTexture(roomEnvironment, scene);

        // if not setting the envtext of the scene, we have to load the DDS module as well
        new EnvironmentHelper({
            skyboxTexture: roomEnvironment,
            createGround: false
        }, scene)

        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        const light = new HemisphericLight(
            "light",
            new Vector3(0, 1, 0),
            scene
        );

        // Default intensity is 1. Let's dim the light a small amount
        light.intensity = 0.7;

        const slotMachine = await SceneLoader.ImportMeshAsync(
            "",
            "",
            slotmachineModel,
            scene,
            undefined,
            ".glb"
        );


        const slotMachineMesh = slotMachine.meshes[0];

        slotMachineMesh.rotate(new Vector3(0, 1, 0), Math.PI * 6 / 4)
        slotMachineMesh.position.x = 0;
        slotMachineMesh.position.z = 0;
        slotMachineMesh.position.y = -10.1;

        // just scale it so we can see it better
        slotMachine.meshes[0].scaling.scaleInPlace(4);

        // This targets the camera to scene origin
        camera.setTarget(slotMachineMesh.position.add(new Vector3(0, 5, 0)));
        return scene;
    };
}

export default new LoadModelAndEnvScene();
