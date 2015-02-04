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
var sphereNodeDictionary ={};
var oculusControl;
//var scaleColorGroup = d3.scale.category20();
var dimensionScale;
var effect;




/*
 * This method is used to interact with objects in scene.
 *
 */
function onDocumentMouseDown( event ) {

    event.preventDefault();

    var vector = new THREE.Vector3(
        ( event.clientX / window.innerWidth ) * 2 - 1,
        - ( event.clientY / window.innerHeight ) * 2 + 1,
        0.5
    );
    vector = vector.unproject( camera );

    var ray = new THREE.Raycaster( camera.position,
        vector.sub( camera.position ).normalize() );

    var intersects = ray.intersectObjects( spheres );


    if ( intersects.length > 0 ) {

        var index = sphereNodeDictionary[intersects[0].object.uuid]
        console.log(index);
        console.log("Node Information");
        var dataset = getDataset();
        console.log(dataset[index]);

        intersects[ 0 ].object.material.color.setHex( Math.random() * 0xffffff );

    }

    /*
     // Parse all the faces
     for ( var i in intersects ) {
     intersects[ i ].face.material[ 0 ].color
     .setHex( Math.random() * 0xffffff | 0x80000000 );
     }
     */
};

/**
 * This method should be called to init th canvas where we render the brain
 */

initCanvas = function () {
    removeStartButton();
    var light;

    projector = new THREE.Projector();
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;
    spheres = [];

    canvas = document.getElementById('canvas');

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    window.addEventListener( 'mousedown', onDocumentMouseDown, true );
    canvas.appendChild(renderer.domElement);


    controls = new THREE.TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 0.5;

    /*
    effect = new THREE.OculusRiftEffect( renderer, { worldScale: 1 } );
    effect.setSize( window.innerWidth, window.innerHeight );*/

    /*
     oculuscontrol = new THREE.OculusControls( camera );

     oculuscontrol.connect();*/

    drawRegions(getDataset());

    drawConnections(getConnectionMatrix());


    //Adding light

    light = new THREE.HemisphereLight({
        intensity: 0.5
    });
    scene.add(light);

    createLegend();
    animate();

};


/**
 * This method should be called when a new model is uploaded in the system
 */
updateScene = function(){
    var l = spheres.length
    for (var i=0; i < l; i++){
        scene.remove(spheres[i]);
    }

    drawRegions(getDataset());
    createLegend();
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
    var xCentroid;
    var yCentroid;
    var zCentroid;

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
    ).range([-80,+80]);
};

/*
 * This method draws all the regions of the brain as spheres.
 */

var drawRegions = function(dataset) {
    var l = dataset.length;
    var material;
    createDimensionScale(dataset);

    var geometry = new THREE.SphereGeometry(0.8, 10, 10);
    for(var i=0; i < l; i++){
        material = new THREE.MeshPhongMaterial({
            color: scaleColorGroup(dataset[i].group),
            shininess: 15,
            transparent: true,
            opacity: 0.9
        });


        spheres[spheres.length] = new THREE.Mesh(geometry, material);

        spheres[i].position.set(totalScale(dataset[i].x), totalScale(dataset[i].y), totalScale(dataset[i].z));

        sphereNodeDictionary[spheres[i].uuid] = i;

        scene.add(spheres[i]);
    }


};


/*
 * This method draws all the connection between the regions. It needs the connection matrix.
 */

var drawConnections = function(connectionMatrix){
    var rows = connectionMatrix.length;
    //the following variable is set just for performances reason. Since the matrix is symmetric,
    //we can scan just half of it.
    var stoppingIndex = 0;



    /*
    var line = new THREE.Line( geometry, material );
    scene.add( line );*/

    for(var i=0; i < rows; i++){
        for(var j = 0; j < stoppingIndex+1; j++){
            if(connectionMatrix[i][j] > 30){
                var material = new THREE.LineBasicMaterial({
                    color: 0x67809F,
                    linewidth: connectionMatrix[i][j]/25.0
            });
                var start = new THREE.Vector3(spheres[i].position.x, spheres[i].position.y,spheres[i].position.z);
                var end = new THREE.Vector3(spheres[j].position.x, spheres[j].position.y,spheres[j].position.z);
                var geometry = new THREE.Geometry();
                geometry.vertices.push(
                    start,
                    end
                );
                var line = new THREE.Line(geometry, material);
                scene.add(line);
            }
        }
        stoppingIndex+=1;
    }
};


