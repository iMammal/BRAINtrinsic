/**
 * Created by giorgioconte on 31/01/15.
 */

var threshold = 30;


var projector;
var camera;
var canvas;
var renderer;
var controls;
var scene;
var spheres;
var sphereNodeDictionary ={};
var oculusControl;

var dimensionScale;
var effect;

var nodesSelected = [];

var displayedEdges = [];




/*
 * This method is used to interact with objects in scene.
 *
 */
function onClick( event ) {

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
        var dataset = getDataset();

        setNodeInfoPanel(dataset[index].name, index);


        //intersects[ 0 ].object.material.color.setHex( Math.random() * 0xffffff );

    }

    /*
     // Parse all the faces
     for ( var i in intersects ) {
     intersects[ i ].face.material[ 0 ].color
     .setHex( Math.random() * 0xffffff | 0x80000000 );
     }
     */
};

function onDblClick( event ){
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

        var nodeIndex = sphereNodeDictionary[intersects[0].object.uuid]
        var dataset = getDataset();

        var el = nodesSelected.indexOf(nodeIndex);

        if( el == -1 ){
            //if the node is not already selected -> draw edges and add in the nodesSelected Array
            drawEdgesGivenNode(nodeIndex);
            nodesSelected[nodesSelected.length] = nodeIndex;
        } else
        { //if the nodes is already selected, remove edges and remove from the nodeSelected Array

            nodesSelected.splice(el, 1);
            removeEdgesGivenNode(nodeIndex);
        }
    }
};


/**
 * This method should be called to init th canvas where we render the brain
 */

initCanvas = function () {
    removeStartButton();
    setRegionsActivated();
    var light;

    projector = new THREE.Projector();
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;
    spheres = [];

    canvas = document.getElementById('canvas');

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    canvas.addEventListener('dblclick', onDblClick , true);
    canvas.addEventListener( 'click', onClick, true );

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

    //drawConnections(getConnectionMatrix());


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

    for(i=0; i < displayedEdges.length; i++){
        scene.remove(displayedEdges[i]);
    }

    displayedEdges = [];

    drawRegions(getDataset());
    drawConnections();
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
    ).range([-100,+100]);

};

/*
 * This method draws all the regions of the brain as spheres.
 */

var drawRegions = function(dataset) {
    var l = dataset.length;
    var material;
    createDimensionScale(dataset);

    var geometry = new THREE.SphereGeometry(1.0, 10, 10);

    var xCentroid = d3.mean(dataset, function(d){
        return totalScale(d.x);
    });

    var yCentroid = d3.mean(dataset, function(d){
        return totalScale(d.y);
    });

    var zCentroid = d3.mean(dataset, function(d){
        return totalScale(d.z);
    });

    for(var i=0; i < l; i++){
        if(regionsActivated[dataset[i].group]) {
            material = new THREE.MeshPhongMaterial({
                color: scaleColorGroup(dataset[i].group),
                shininess: 15,
                transparent: true,
                opacity: 0.9
            });

            spheres[spheres.length] = new THREE.Mesh(geometry, material);

            var x = totalScale(dataset[i].x) - xCentroid;
            var y = totalScale(dataset[i].y) - yCentroid;
            var z = totalScale(dataset[i].z) - zCentroid;

        spheres[i].position.set(x, y, z);
            //console.log("drawn region " + i + " in position x: " + totalScale(dataset[i].x) + ", y: " + totalScale(dataset[i].y)+ ", "+ "z: " +totalScale(dataset[i].z));

            sphereNodeDictionary[spheres[i].uuid] = i;

            scene.add(spheres[i]);
       }
    }


};


/*
 * This method draws all the connection between the regions. It needs the connection matrix.
 */

/*
var drawConnections = function(connectionMatrix){
    var rows = connectionMatrix.length;

    /*
    var line = new THREE.Line( geometry, material );
    scene.add( line );
    */
    /*
    var scale = getConnectionMatrixScale();
    for(var i=0; i < rows; i++){
        for(var j = 0; j < i; j++){
            if(connectionMatrix[i][j] > 30){
                var material = new THREE.LineBasicMaterial({
                    color: scale(connectionMatrix[i][j]),
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
    }
};*/


var drawConnections = function () {

    for(var i= 0; i < nodesSelected.length; i++){
        if(isRegionActive(getRegionByNode(nodesSelected[i]))){
            var row = getConnectionMatrixRow(nodesSelected[i]);
            for(var j=0; j < row.length; j++){
                if(isRegionActive(getRegionByNode(j)) && row[j] > threshold){
                    var start = new THREE.Vector3(spheres[nodesSelected[i]].position.x, spheres[nodesSelected[i]].position.y, spheres[nodesSelected[i]].position.z);
                    var end = new THREE.Vector3(spheres[j].position.x, spheres[j].position.y, spheres[j].position.z);
                    var line = drawEdge(start,end);
                    displayedEdges[displayedEdges.length] = line;
                }
            }

        }
    }
};



var drawEdgesGivenNode = function (indexNode) {
    var connectionRow = getConnectionMatrixRow(indexNode);

    var l = connectionRow.length;
    for(var i=0; i < l ; i++){
        if(connectionRow[i] > threshold  && isRegionActive(getRegionByNode(i))) {
            var start = new THREE.Vector3(spheres[indexNode].position.x, spheres[indexNode].position.y, spheres[indexNode].position.z);
            var end = new THREE.Vector3(spheres[i].position.x, spheres[i].position.y, spheres[i].position.z);
            var line = drawEdgeWithName(start,end, indexNode);
            displayedEdges[displayedEdges.length] = line;
        }
    }
};


var drawEdge = function (start,end) {
    var material = new THREE.LineBasicMaterial;
    var geometry = new THREE.Geometry();
    geometry.vertices.push(
        start,
        end
    );
    var line = new THREE.Line(geometry, material);
    scene.add(line);
    return line;
};

var drawEdgeWithName = function (start, end, name) {
    var line = drawEdge(start,end);
    line.name = name;
    return line;
};

var removeEdgesGivenNode = function (indexNode) {
    var x = spheres[indexNode].position.x;
    var y = spheres[indexNode].position.y;
    var z = spheres[indexNode].position.z;

    var l = displayedEdges.length;

    for(var i=0; i < l; i++){
        var edge = displayedEdges[i];

        var xStart = edge.geometry.vertices[0].x;
        var yStart = edge.geometry.vertices[0].y;
        var zStart = edge.geometry.vertices[0].z;

        //removing only the esges that starts from that node
        if(x == xStart && y == yStart && z == zStart){
            scene.remove(edge);
        }
    }
};



