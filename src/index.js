class Lotto {


    main() {
        const hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("textures/environment.dds", scene);

        const plastic = new BABYLON.PBRMaterial("plastic", scene);
        // plastic.reflectionTexture = hdrTexture;
        plastic.microSurface = 0.96;
        plastic.backFaceCulling = false;
        plastic.alpha = 0.2;
        plastic.albedoColor = new BABYLON.Color3(0.206, 0.94, 1);
        plastic.reflectivityColor = new BABYLON.Color3(0.003, 0.003, 0.003);
    }
}
