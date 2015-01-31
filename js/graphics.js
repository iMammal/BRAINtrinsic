/**
 * Created by giorgioconte on 31/01/15.
 */

/*
 * private variables.
 */
var projector;
var camera;
var canvas;
var renderer;
var controls;
var scene;

/**
 * This method should be called to init th canvas where we render the brain
 */

initCanvas = function () {

    //projector = new THREE.Projector();
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    canvas = document.getElementById('canvas');


    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    canvas.appendChild(renderer.domElement);


    controls = new THREE.TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 0.5;

    material = new THREE.MeshBasicMaterial();
    geometry = new THREE.SphereGeometry(10, 20, 20);

    sphere = new THREE.Mesh(geometry, material);


    scene.add(sphere);

    animate();

}





animate = function () {

    requestAnimationFrame(animate);
    controls.update();

    //controls.update(  );
    //oculuscontrol.update(  );
    render();

}


render = function() {

    //Use the following line to render normally on the screen of the pc
    renderer.render(scene, camera);

    // Use the following line to render the scene on the oculus rift
    //effect.render( scene, camera );
}
