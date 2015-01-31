var camera, renderer, scene;

// add your global variables here:
var helloWorldMesh;
var world, worldClouds, t, c, l;
var mesh1, mesh2, mesh3;
var sizeM = 45;
var sizeMesh1 = sizeM,
    sizeMesh2 = sizeM,
    sizeMesh3 = sizeM;
var depthCompress = 0.3;
var z0 = -5;
var worldRadius = 15;
var textRadius = 1.75 * worldRadius;
var relcoeff = -0.3;
var spotLight;
var meshArray = [];

head.ready(function() {
    Init();
    animate();
});

function Init() {
    scene = new THREE.Scene();

    //setup camera
    //setup camera
    camera = new LeiaCamera({   dCtoZDP:_ZDPDistanceToCamera,
        zdpNormal:new THREE.Vector3(_ZDPNormal.x, _ZDPNormal.y, _ZDPNormal.z),
        targetPosition: new THREE.Vector3(_ZDPCenter.x, _ZDPCenter.y, _ZDPCenter.z)
    });
    scene.add(camera);


    //setup rendering parameter
    renderer = new LeiaWebGLRenderer({
        antialias: true,
        renderMode: _renderMode,
        colorMode: _colorMode,
        devicePixelRatio: 1,
        ZDPSize: _ZDPSize,
        tunedsp:_maxDisparity,
        messageFlag: _targetEnvironment
    });
    Leia_addRender(renderer,{bFPSVisible:true});

    //add object to Scene
    addObjectsToScene();

    //add Light
    addLights();

    //add Gyro Monitor
    //addGyroMonitor();
}

function animate() {
    requestAnimationFrame(animate);
    for (var i = 0; i < meshArray.length; i++) {
        var curMesh = meshArray[i].mesh;
        switch (meshArray[i].name) {
            case 'apple':
                curMesh.rotation.set(-Math.PI / 2 + 0.2 * Math.sin(3.2 * LEIA.time), 0 * Math.PI / 2, -Math.PI / 2 + 0.25 * Math.sin(4 * LEIA.time));
                curMesh.position.z = -2;
                break;
            default:
                break;
        }
    }


    renderer.Leia_render({
        scene: scene,
        camera: camera
    });
}

function addObjectsToScene() {
    //Add your objects here
    // world sphere
    var worldTexture = new THREE.ImageUtils.loadTexture('resource/world_texture.jpg');
    worldTexture.wrapS = worldTexture.wrapT = THREE.RepeatWrapping;
    worldTexture.repeat.set(1, 1);
    var worldMaterial = new THREE.MeshPhongMaterial({
        map: worldTexture,
        bumpMap: THREE.ImageUtils.loadTexture('resource/world_elevation.jpg'),
        bumpScale: 1.00,
        specularMap: THREE.ImageUtils.loadTexture('resource/world_water.png'),
        specular: new THREE.Color('grey'),
        color: 0xffdd99
    });

    // background Plane
    var planeGeometry = new THREE.PlaneGeometry(80, 60, 10, 10);

    for (var i = 0; i < (planeGeometry.vertices.length); i++) {
        var qq = planeGeometry.vertices[i].x;
        planeGeometry.vertices[i].z = 0.005 * qq * qq;
    }
    
    plane = new THREE.Mesh(planeGeometry, worldMaterial);
    plane.position.z = -8;
    plane.castShadow = false;
    plane.receiveShadow = true;
    scene.add(plane);

    // hello world text
    var helloWorldGeometry = new THREE.TextGeometry(
        "Apple", {
            size: 9,
            height: 2,
            curveSegments: 4,
            font: "helvetiker",
            weight: "normal",
            style: "normal",
            bevelThickness: 0.5,
            bevelSize: 0.25,
            bevelEnabled: true,
            material: 0,
            extrudeMaterial: 1
        }
    );
    helloWorldGeometry.computeBoundingBox();
    var hwbb = helloWorldGeometry.boundingBox;
    var hwbbx = -0.5 * (hwbb.max.x - hwbb.min.x);
    var hwbby = -0.5 * (hwbb.max.y - hwbb.min.y);
    var helloWorldMaterial = new THREE.MeshFaceMaterial(
        [
            new THREE.MeshPhongMaterial({
                color: 0xff0000,
                shading: THREE.FlatShading
            }), // front
            new THREE.MeshPhongMaterial({
                color: 0xffffff,
                shading: THREE.SmoothShading
            }) // side
        ]
    );
    var helloWorldMesh = new THREE.Mesh(helloWorldGeometry, helloWorldMaterial);
    helloWorldMesh.castShadow = true;
    helloWorldMesh.position.set(hwbbx, hwbby, 4);
    scene.add(helloWorldMesh);

    function callback(mesh) {
        mesh.scale.set(45, 45, 45);
        scene.add(mesh);
        meshArray.push({
            mesh: mesh,
            name: "apple"
        });
    }
    Leia_LoadSTLModel({
        path: 'resource/AppleLogo_5k.stl'
    }, callback);
}

function addLights() {
    //Add Lights Here
    spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(70, 70, 70);
    spotLight.shadowCameraVisible = false;
    spotLight.castShadow = true;
    spotLight.shadowMapWidth = spotLight.shadowMapHeight = 512;
    spotLight.shadowDarkness = 0.7;
    scene.add(spotLight);
    var ambientLight = new THREE.AmbientLight(0x888888);
    scene.add(ambientLight);
}