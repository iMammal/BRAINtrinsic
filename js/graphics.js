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
var spheres;

var dimensionScale;

/**
 * This method should be called to init th canvas where we render the brain
 */

initCanvas = function () {

    var scaleColorGroup = d3.scale.category20();
    var material;
    var geometry;


    projector = new THREE.Projector();
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;
    spheres = [];

    canvas = document.getElementById('canvas');


    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    canvas.appendChild(renderer.domElement);


    controls = new THREE.TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 0.5;

    var dataset = getDataset();


    var l = dataset.length;

    createDimensionScale(dataset);

    var geometry = geometry = new THREE.SphereGeometry(0.5, 10, 10);
    for(var i=0; i < l; i++){
        material = new THREE.MeshPhongMaterial({
            color: scaleColorGroup(dataset[i].group),
            shininess: 15,
            transparent: true,
            opacity: 0.7
        });

        spheres[spheres.length] = new THREE.Mesh(geometry, material);
        spheres[i].position.set(totalScale(dataset[i].x), totalScale(dataset[i].y), totalScale(dataset[i].z));
        scene.add(spheres[i]);
    }
    /*
    material = new THREE.MeshPhongMaterial({color: 0xE4F1FE});
    geometry = new THREE.SphereGeometry(10, 20, 20);

    sphere = new THREE.Mesh(geometry, material);


    scene.add(sphere);
    */

    //Adding light

    light = new THREE.HemisphereLight({
        intensity: 0.5
    });
    scene.add(light);

    createLegend();
    animate();

};





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
};



//Private methods

var createDimensionScale = function(d){
    var l = d.length;
    var allCoordinates = [];

    for(var i=0; i < l; i++) {
        allCoordinates[allCoordinates.length] = d[i].x;
        allCoordinates[allCoordinates.length] = d[i].y;
        allCoordinates[allCoordinates.length] = d[i].z;
    }

    totalScale = d3.scale.linear().domain(
        [
            d3.min(allCoordinates, function(element){
                return element;
            })
            ,
            d3.max(allCoordinates, function(element){
                return element;
            })
        ]
    ).range([-50,+50]);
};
