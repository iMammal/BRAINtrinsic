/**
 * Created by giorgioconte on 31/01/15.
 */

//var threshold = 30;


var SPHERE_SIZE = 1.0;

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

var visibleNodes =[];

var displayedEdges = [];

var pointedObject;

var root;

var shortestPathEdges = [];

var distanceArray;

var thresholdModality = true;


var mouse = new THREE.Vector2();





function onDocumentMouseMove( event )
{
    // the following line would stop any other event handler from firing
    // (such as the mouse's TrackballControls)
    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1

    var intersectedObject = getIntersectedObject();

    if ( intersectedObject  && visibleNodes[sphereNodeDictionary[intersectedObject.object.uuid]] && isRegionActive(getRegionByNode(sphereNodeDictionary[intersectedObject.object.uuid]))) {
        var i = sphereNodeDictionary[intersectedObject.object.uuid];
        var regionName = getRegionNameByIndex(i);
        setNodeInfoPanel(regionName, i);
    }

    if ( intersectedObject && nodesSelected.indexOf(sphereNodeDictionary[intersectedObject.object.uuid]) == -1 && visibleNodes[sphereNodeDictionary[intersectedObject.object.uuid]] && isRegionActive(getRegionByNode(sphereNodeDictionary[intersectedObject.object.uuid]))) {

        var index = sphereNodeDictionary[intersectedObject.object.uuid];


        if(pointedObject){
            pointedObject.geometry = new THREE.SphereGeometry(1,10,10);
        }



        pointedObject = intersectedObject.object;

        pointedObject.geometry = new THREE.SphereGeometry(2,10,10);
        pointedObject.material.transparent = false;


        var regionName = getRegionNameByIndex(index);
        setNodeInfoPanel(regionName, index);

        if(thresholdModality) {
            drawEdgesGivenNode(index);
        } else{
            console.log("top " + getNumberOfEdges() + "edges");
            drawTopNEdgesByNode(index, getNumberOfEdges());
        }
    } else{
        if(pointedObject){

            if(sphereNodeDictionary[pointedObject.uuid] == root)
                pointedObject.geometry = new THREE.SphereGeometry(3,10,10);
            else {
                pointedObject.geometry = new THREE.SphereGeometry(1, 10, 10);
                pointedObject.material.transparent = true;
            }


            if(nodesSelected.indexOf(sphereNodeDictionary[pointedObject.uuid]) == -1 ) {
                removeEdgesGivenNode(sphereNodeDictionary[pointedObject.uuid]);
            }
            pointedObject = null;
        }
    }

}


/*
 * This method is used to interact with objects in scene.
 *
 */
/*
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

 var index = sphereNodeDictionary[intersects[0].object.uuid];
 var dataset = getDataset();

 setNodeInfoPanel(dataset[index].name, index);

 }

 }*/

function onDblClick(event){
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    event.preventDefault();


    var intersectedObject = getIntersectedObject();

    removeElementsFromEdgePanel();


    if(intersectedObject) {
        var nodeIndex = sphereNodeDictionary[intersectedObject.object.uuid];

        drawShortestPath(nodeIndex);
    }
}

function onClick( event ){

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1

    event.preventDefault();



    var objectIntersected = getIntersectedObject();


    if (objectIntersected && visibleNodes[sphereNodeDictionary[objectIntersected.object.uuid]]) {

        var nodeIndex = sphereNodeDictionary[objectIntersected.object.uuid];

        var el = nodesSelected.indexOf(nodeIndex);

        if( el == -1 ){
            //if the node is not already selected -> draw edges and add in the nodesSelected Array
            objectIntersected.geometry = new THREE.SphereGeometry(1.5,10,10);

            if(thresholdModality) {
                drawEdgesGivenNode(nodeIndex);
            } else{
                drawTopNEdgesByNode(nodeIndex, getNumberOfEdges());
            }

            nodesSelected[nodesSelected.length] = nodeIndex;
            pointedObject = null;

        } else
        { //if the nodes is already selected, remove edges and remove from the nodeSelected Array

            objectIntersected.object.material.color = new THREE.Color(scaleColorGroup(getRegionByNode(nodeIndex)));
            objectIntersected.object.geometry = new THREE.SphereGeometry(1.0,10,10);

            nodesSelected.splice(el, 1);
            removeEdgesGivenNode(nodeIndex);
        }
    }
}
/**
 * This method should be called to init th canvas where we render the brain
 */

initCanvas = function () {

    addThresholdSlider();

    removeStartButton();
    removeUploadButtons();
    addGroupList();

    addModalityButton();


    setRegionsActivated();

    setThreshold(30);
    var light;

    //projector = new THREE.Projector();
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    //camera = new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth/ 2, window.innerHeight / 2, window.innerHeight/ - 2, 1, 1000 );
    camera.position.z = 50;
    spheres = [];

    canvas = document.getElementById('canvas');

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    canvas.addEventListener('dblclick', onDblClick , true);
    canvas.addEventListener( 'click', onClick, true );
    canvas.addEventListener( 'mousemove', onDocumentMouseMove, true );

    canvas.appendChild(renderer.domElement);


    controls = new THREE.TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 0.5;

    /*
     effect = new THREE.OculusRiftEffect( renderer, { worldScale: 1 } );
     effect.setSize( window.innerWidth, window.innerHeight );*/


    //oculuscontrol = new THREE.OculusControls( camera );

    //oculuscontrol.connect();

    var len = getConnectionMatrixDimension();

    for(var i =0; i < len; i++){
        visibleNodes[visibleNodes.length] = true;
    }

    drawRegions(getDataset());


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
    var l = spheres.length;
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

};


render = function() {

    //Use the following line to render normally on the screen of the pc
    renderer.render(scene, camera);

    // Use the following line to render the scene on the oculus rift
    //effect.render( scene, camera );
};



var createCentroidScale = function(d){
    var l = d.length;
    var allCoordinates = [];

    for(var i=0; i < l; i++) {
        allCoordinates[allCoordinates.length] = d[i].x;
        allCoordinates[allCoordinates.length] = d[i].y;
        allCoordinates[allCoordinates.length] = d[i].z;
    }

    centroidScale = d3.scale.linear().domain(
        [
            d3.min(allCoordinates, function(element){
                return element;
            })
            ,
            d3.max(allCoordinates, function(element){
                return element;
            })
        ]
    ).range([-200,+200]);

};

/*
 * This method draws all the regions of the brain as spheres.
 */

var drawRegions = function(dataset) {

    var l = dataset.length;
    var material;


    createCentroidScale(dataset);

    var geometry;

    var xCentroid = d3.mean(dataset, function(d){
        return centroidScale(d.x);
    });

    var yCentroid = d3.mean(dataset, function(d){
        return centroidScale(d.y);
    });

    var zCentroid = d3.mean(dataset, function(d){
        return centroidScale(d.z);
    });

    var geometry = new THREE.Geometry();
    for(var i=0; i < l; i++){
        if(isRegionActive(dataset[i].group)) {
            if(nodesSelected.indexOf(i) == -1) {
                //if the node is not selected
                material = new THREE.MeshPhongMaterial({
                    color: scaleColorGroup(dataset[i].group),
                    shininess: 15,
                    transparent: true,
                    opacity: 0.7
                });
                geometry = new THREE.SphereGeometry(1.0, 10, 10);

            } else {
                material = new THREE.MeshPhongMaterial({
                    color: scaleColorGroup(dataset[i].group),
                    shininess: 15
                });

                geometry = new THREE.SphereGeometry(2.0,10,10);
            }

            console.log(root);
            if(root && root == i){
                geometry = new THREE.SphereGeometry(3.0,10,10);
                material.transparent = false;
            }

            spheres[i] = new THREE.Mesh(geometry, material);

            var x = centroidScale(dataset[i].x) - xCentroid;
            var y = centroidScale(dataset[i].y) - yCentroid;
            var z = centroidScale(dataset[i].z) - zCentroid;

            spheres[i].position.set(x, y, z);

            sphereNodeDictionary[spheres[i].uuid] = i;

            if(visibleNodes[i]){
                scene.add(spheres[i]);
            }
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
    var row;
    for(var i= 0; i < nodesSelected.length; i++){
        if(isRegionActive(getRegionByNode(nodesSelected[i]))){
            if(thresholdModality){
                row = getConnectionMatrixRow(nodesSelected[i]);
                for(var j=0; j < row.length; j++) {
                    if (isRegionActive(getRegionByNode(j)) && row[j] > getThreshold() && visibleNodes[j]) {
                        var start = new THREE.Vector3(spheres[nodesSelected[i]].position.x, spheres[nodesSelected[i]].position.y, spheres[nodesSelected[i]].position.z);
                        var end = new THREE.Vector3(spheres[j].position.x, spheres[j].position.y, spheres[j].position.z);
                        var line = drawEdgeWithName(start, end, row[j]);
                        displayedEdges[displayedEdges.length] = line;
                    }
                }
            } else{
                drawTopNEdgesByNode(nodesSelected[i], getNumberOfEdges());
            }

        }
    }

    for(i=0; i < shortestPathEdges.length; i++){
        displayedEdges[displayedEdges.length] = shortestPathEdges[i];
        scene.add(shortestPathEdges[i]);
    }

    setEdgesColor();
};



var setEdgesColor = function () {
    var allDisplayedWeights =[];
    for(var i = 0; i < displayedEdges.length; i++){
        allDisplayedWeights[allDisplayedWeights.length] = displayedEdges[i].name;
    }

    var edgeColorScale =  d3.scale.linear().domain(
        [
            d3.min(allDisplayedWeights, function(element){
                return element;
            })
            ,
            d3.max(allDisplayedWeights, function(element){
                return element;
            })
        ]
    ).range(["#edf8fb", "#005824"]);

    var edgeOpacityScale = d3.scale.linear().domain(
        [
            d3.min(allDisplayedWeights, function(element){
                return element;
            })
            ,
            d3.max(allDisplayedWeights, function(element){
                return element;
            })
        ]
    ).range([0.1,1]);

    var edgeDimensionScale = d3.scale.linear().domain(
        [
            d3.min(allDisplayedWeights, function(e){
                return e;
            })
            ,
            d3.max(allDisplayedWeights, function(e) {
                return e;
            })
        ]
    ).range([1,15]);


    for(i = 0; i < displayedEdges.length; i++){
        var edgeColor = new THREE.Color(edgeColorScale(displayedEdges[i].name));
        var edgeWidth = edgeDimensionScale(displayedEdges[i].name);


        var material = new THREE.LineBasicMaterial(
            {
                opacity: edgeOpacityScale(displayedEdges[i].name),
                transparent: true,
                //color: edgeColor,
                linewidth: 2
            });

        displayedEdges[i].material = material;
    }

    updateEdgeLegend();

};

var drawEdgesGivenNode = function (indexNode) {

    var connectionRow = getConnectionMatrixRow(indexNode);


    var l = connectionRow.length;
    for(var i=0; i < l ; i++){
        if(connectionRow[i] > getThreshold()  && isRegionActive(getRegionByNode(i)) && visibleNodes[i]) {
            var start = new THREE.Vector3(spheres[indexNode].position.x, spheres[indexNode].position.y, spheres[indexNode].position.z);
            var end = new THREE.Vector3(spheres[i].position.x, spheres[i].position.y, spheres[i].position.z);
            var line = drawEdgeWithName(start,end, connectionRow[i]);
            displayedEdges[displayedEdges.length] = line;

        }
    }
    setEdgesColor();
};


var drawEdge = function (start,end, opacity) {

    var material = new THREE.LineBasicMaterial();


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

    var removedEdges = [];
    for(var i=0; i < l; i++){
        var edge = displayedEdges[i];

        var xStart = edge.geometry.vertices[0].x;
        var yStart = edge.geometry.vertices[0].y;
        var zStart = edge.geometry.vertices[0].z;

        //removing only the edges that starts from that node
        if(x == xStart && y == yStart && z == zStart && shortestPathEdges.indexOf(edge) == -1){
            removedEdges[removedEdges.length] = i;
            scene.remove(edge);
        }
    }

    var updatedDisplayEdges = [];

    for(i=0; i < displayedEdges.length; i++){
        //if the edge should not be removed
        if( removedEdges.indexOf(i) == -1){
            updatedDisplayEdges[updatedDisplayEdges.length] = displayedEdges[i];
        }
    }

    for(i=0; i < shortestPathEdges.length; i++){
        updatedDisplayEdges[updatedDisplayEdges.length] = shortestPathEdges[i];
    }

    displayedEdges = updatedDisplayEdges;

    setEdgesColor();
};


getIntersectedObject = function () {

    var vector = new THREE.Vector3(
        ( event.clientX / window.innerWidth ) * 2 - 1,
        - ( event.clientY / window.innerHeight ) * 2 + 1,
        0.5
    );
    vector = vector.unproject( camera );

    var ray = new THREE.Raycaster( camera.position,
        vector.sub( camera.position ).normalize() );


    //raycaster.setFromCamera( mouse, camera );


    var objectsIntersected = ray.intersectObjects( spheres );


    if(objectsIntersected[0]){
        return objectsIntersected[0];
    }

    return undefined;
};



drawShortestPath = function (nodeIndex) {
    var line;
    root = nodeIndex;



    var len = getConnectionMatrixDimension();
    var dist = computeShortestPathDistances(nodeIndex);

    distanceArray = [];
    for(var i=0; i < getConnectionMatrixDimension(); i++){
        distanceArray[distanceArray.length] = dist[i];
    }

    setDistanceArray(distanceArray);


    if(!document.getElementById("distanceThresholdSlider")){
        addDistanceSlider(distanceArray);
    }

    nodesSelected = [];
    shortestPathEdges = [];

    for(var i=0; i < len; i++){
        if(dist[i] < getDistanceThreshold()){
            visibleNodes[i] = true;
        }
        else
        {
            visibleNodes[i] = false;
        }
    }

    for(i=0; i < visibleNodes.length; i++){
        if(visibleNodes[i]){
            var prev = spheres[previousMap[i]];
            if(prev) {
                line = drawEdgeWithName(spheres[i].position, prev.position, getConnectionMatrix()[i][previousMap[i]]);
                shortestPathEdges[shortestPathEdges.length] = line;
            }
        }
    }

    setEdgesColor();
    updateScene();

};


resizeScene = function(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();


    renderer.setSize(window.innerWidth, window.innerHeight);


    animate();

};


drawTopNEdgesByNode = function (nodeIndex, n) {

    var row = getTopConnectionsByNode(nodeIndex, n);

    for (var obj in row) {
        if (isRegionActive(getRegionByNode(obj)) && visibleNodes[obj]) {
            var start = new THREE.Vector3(spheres[nodeIndex].position.x, spheres[nodeIndex].position.y, spheres[nodeIndex].position.z);
            var end = new THREE.Vector3(spheres[obj].position.x, spheres[obj].position.y, spheres[obj].position.z);
            var line = drawEdgeWithName(start, end, row[obj]);
            displayedEdges[displayedEdges.length] = line;
        }
    }

    setEdgesColor();
};



changeColorGroup = function (n) {
    activeGroup = n;

    setRegionsActivated();
    setColorGroupScale();

    for(var i=0; i < spheres.length; i++){
        scene.remove(spheres[i]);
    }
    spheres = [];
    updateScene();

};



setGeometryGivenNode = function(nodeIndex, geometry){
    spheres[nodeIndex].geometry = geometry;
}






