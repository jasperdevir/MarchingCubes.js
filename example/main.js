import * as THREE from 'three';

import { OrbitControls } from 'orbit_controls';
import { GUI } from 'gui';

import { MarchingGrid } from 'marching_cubes';

var scene, camera, renderer, controls, gui, clock;
var grid;

function initScene(){
    scene = new THREE.Scene();

    const width = window.innerWidth;
    const height = window.innerHeight;

    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    scene.add(camera);

    const cameraPos = new THREE.Vector3(-8,4,-10);
    const cameraDir = new THREE.Vector3(0,0,1);

    camera.position.set(cameraPos.x,cameraPos.y,cameraPos.z);
    camera.lookAt(cameraDir.x, cameraDir.y, cameraDir.z);

    renderer = new THREE.WebGLRenderer({antialias: true}); 
    renderer.setSize(width, height);

    document.body.appendChild(renderer.domElement);

    gui = new GUI();

    controls = new OrbitControls( camera, renderer.domElement );
    clock = new THREE.Clock();
}

var gridParams = {
    pos: new THREE.Vector3(0,0,0),
    width: 10,
    height: 10,
    depth: 10,
    scale: 1,
    color: 0xffffff,
    regenGrid: function(){
        grid.remove(scene);
        genGrid();
    }
};

function initGui(){
    const gridFolder = gui.addFolder('Grid');

    const dimFolder = gridFolder.addFolder('Dimensions');
    dimFolder.add(gridParams, 'width').name('Width');
    dimFolder.add(gridParams, 'height').name('Height');
    dimFolder.add(gridParams, 'depth').name('Depth');
    dimFolder.add(gridParams, 'scale').name('Scale');

    gridFolder.add(gridParams, 'regenGrid').name("Regenerate Grid");

    gridFolder.addColor(gridParams, 'color').name("Color")
    .onChange(() => {
        grid.mesh.material.color = new THREE.Color(gridParams.color);
    });
    

}

function initLighting(){
    var ambientLight = new THREE.AmbientLight(new THREE.Color(1,1,1), 0.4);
    var cameraLight = new THREE.PointLight(new THREE.Color(1,1,1), 1);
    cameraLight.decay = 0.5;
    scene.add(ambientLight);
    camera.add(cameraLight);
    scene.add(camera);
}

function genGrid(){
    const pos = new THREE.Vector3(
        gridParams.pos.x - (gridParams.width / 2) * gridParams.scale, 
        gridParams.pos.y - (gridParams.height / 2) * gridParams.scale,
        gridParams.pos.z - (gridParams.depth / 2) * gridParams.scale
    );

    const dimensions = new THREE.Vector4(
        gridParams.width, 
        gridParams.height, 
        gridParams.depth, 
        gridParams.scale
    );

    const material = new THREE.MeshPhongMaterial({color: gridParams.color, side: THREE.DoubleSide});

    grid = new MarchingGrid(pos, dimensions, material);

    grid.genMesh();
    grid.add(scene, true, false);
}

var update = function(){
    controls.update();

    renderer.render(scene, camera);
    requestAnimationFrame(update);
}

initScene();
initGui();
initLighting();
genGrid();

requestAnimationFrame(update);