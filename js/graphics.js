/**
 * Created by giorgioconte on 31/01/15.
 *
 * Morris Chukhman Changelog:
 * 0.1 Change VR controls to WebVR
 * 0.2 Add Leap Hands
 * 0.3 Add Leap taffy pull movement gesture and movement keys
 * 0.4 Add Leap Hand centroid selection  6/1/16
 */

//var threshold = 30;

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
var touchedSphere, touchedSphereIndex,touchedSphereDistance;

var root;

var shortestPathEdges = [];

var distanceArray;

var thresholdModality = true;

var stats, frame, controller;

var mouse = new THREE.Vector2();

var spt = false;

var click = true;

var ballRot = false;

var ballScaLen = 0;

var HMDOffset = new THREE.Vector3(0,0,0);

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
            //pointedObject.geometry = new THREE.SphereGeometry(1,10,10);
            pointedObject.geometry = createNormalGeometryByObject(pointedObject);
        }



        pointedObject = intersectedObject.object;

        //pointedObject.geometry = new THREE.SphereGeometry(2,10,10);
        pointedObject.geometry = createSelectedGeometryByObject(pointedObject);

        //pointedObject.material.transparent = false;


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

            if(sphereNodeDictionary[pointedObject.uuid] == root) {
                //pointedObject.geometry = new THREE.SphereGeometry(3,10,10);
                console.log("root creation");
                pointedObject.geometry = createRootGeometryByObject(pointedObject);
            }
            else {
                //pointedObject.geometry = new THREE.SphereGeometry(1, 10, 10);
                pointedObject.geometry = createNormalGeometryByObject(pointedObject);
                //pointedObject.material.transparent = false;
            }


            if(nodesSelected.indexOf(sphereNodeDictionary[pointedObject.uuid]) == -1 ) {
                removeEdgesGivenNode(sphereNodeDictionary[pointedObject.uuid]);
            }
            pointedObject = null;
        }
    }

}

function onTouch( index, object ) {
        //var index = sphereNodeDictionary[intersectedObject.object.uuid];
    if (index && object) {

        if(pointedObject){
            //pointedObject.geometry = new THREE.SphereGeometry(1,10,10);
            pointedObject.geometry = createNormalGeometryByObject(pointedObject);
        }



        pointedObject = object; //intersectedObject.object;

        //pointedObject.geometry = new THREE.SphereGeometry(2,10,10);
        pointedObject.geometry = createSelectedGeometryByObject(pointedObject);

        //pointedObject.material.transparent = false;


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

            if(sphereNodeDictionary[pointedObject.uuid] == root) {
                //pointedObject.geometry = new THREE.SphereGeometry(3,10,10);
                console.log("root creation");
                pointedObject.geometry = createRootGeometryByObject(pointedObject);
            }
            else {
                //pointedObject.geometry = new THREE.SphereGeometry(1, 10, 10);
                pointedObject.geometry = createNormalGeometryByObject(pointedObject);
                //pointedObject.material.transparent = false;
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


    if(intersectedObject) {
        removeElementsFromEdgePanel();
        var nodeIndex = sphereNodeDictionary[intersectedObject.object.uuid];

        spt = true;
        drawShortestPath(nodeIndex);

    }
}

function onClick( event ){

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    event.preventDefault();


    var objectIntersected = getIntersectedObject();


    if (objectIntersected && visibleNodes[sphereNodeDictionary[objectIntersected.object.uuid]]) {

        if(!spt) {
            var nodeIndex = sphereNodeDictionary[objectIntersected.object.uuid];

            var el = nodesSelected.indexOf(nodeIndex);

            if (el == -1) {
                //if the node is not already selected -> draw edges and add in the nodesSelected Array
                /*

                objectIntersected.geometry = createSelectedGeometryByObject(objectIntersected.object);
                if (thresholdModality) {
                    drawEdgesGivenNode(nodeIndex);
                } else {
                    drawTopNEdgesByNode(nodeIndex, getNumberOfEdges());
                }
                nodesSelected[nodesSelected.length] = nodeIndex; */

                objectIntersected.geometry = drawSelectedNode(nodeIndex,objectIntersected.object);
                
                pointedObject = null;

            } else { //if the nodes is already selected, remove edges and remove from the nodeSelected Array

                objectIntersected.object.material.color = new THREE.Color(scaleColorGroup(getRegionByNode(nodeIndex),nodeIndex));
                //objectIntersected.object.geometry = new THREE.SphereGeometry(1.0,10,10);

                objectIntersected.object.geometry = createNormalGeometryByObject(objectIntersected.object);


                nodesSelected.splice(el, 1);
                removeEdgesGivenNode(nodeIndex);
            }
        } else{
            nodeIndex = sphereNodeDictionary[objectIntersected.object.uuid];
            getShortestPathBetweenNodes(root,nodeIndex);
        }
    }
}

updatePinchPoint = function (){
    if( frame.tools.length > 0 ){

        console.log("tool: ",frame.tools[0].tipPosition);

    }

    if( frame.hands ){
	switch (frame.hands.length){
		case 0:
			break;
		case 1:
			if(Math.random()<0.01)console.log("hand: ",frame.hands[0].palmPosition,frame.hands[0].pinchStrength);
		        var hand = frame.hands[0];
			break;
		case 2:
			if(Math.random()<0.1){
				console.log("hand1: ",frame.hands[0].palmPosition,frame.hands[0].pinchStrength);
				console.log("hand2: ",frame.hands[1].palmPosition,frame.hands[1].pinchStrength);
			}
		        var hand = frame.hands[0];
		        var hand2 = frame.hands[1];

        var hand1Pos = new THREE.Vector3(0,0,0);
        var hand2Pos = new THREE.Vector3(0,0,0);
        hand1Pos.fromArray(hand.palmPosition);
        hand2Pos.fromArray(hand2.palmPosition);

        var handvec = new THREE.Vector3(1.0,0.0,0.0);
        handvec.subVectors(hand2Pos, hand1Pos);

        var handvecLen = handvec.length();
        //var halfHandvecLen = handvec.multiplyScalar(0.5);
      pinchStrength = (hand.pinchStrength + hand2.pinchStrength) / 2;
      if (pinchStrength > 0.8) {

         if (!ballRot) {
            //ballRotAngle.copy(handvec);
            //ballRotCam.copy(camera.rotation);
            ballScaLen = handvecLen;
            //ballScaCam.copy(camera.scale);
            ballRot = true;
          } else {

	    var diffBallScale;
            if (ballScaLen != 0) diffBallScale = handvecLen - ballScaLen;

            if (diffBallScale != 0) {

              var zoomdir = new THREE.Vector3(0,0,1.0);
              zoomdir.applyQuaternion(camera.quaternion);
              zoomdir.multiplyScalar(diffBallScale);
              //camera.position.sub(zoomdir);
              HMDOffset.sub(zoomdir);
              //camera.matrixWorldNeedsUpdate = true;
		//console.log("zoom: ",zoomdir,camera.position,diffBallScale);
		console.log("zoom: ",zoomdir,HMDOffset,diffBallScale);
            }

	  } // if (!ballRot) 

	}
	else {
		ballrot = false;
        } // if (pinchStrength
	
      } // switch


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
    addGeometryRadioButton();
    addSkyboxButton();
    addDimensionFactorSlider();
    addFslRadioButton();
    addSearchPanel();

    setDimensionFactor(0.0231);

    setRegionsActivated();

    //setThreshold(30);
    computeDistanceMatrix();
    var light;


    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000);

    camera.position.z = 50;
    spheres = [];

    canvas = document.getElementById('canvas');

    renderer = new THREE.WebGLRenderer({antialias: true}); //, canvas: canvas});
    renderer.setSize(window.innerWidth, window.innerHeight);

    canvas.addEventListener('dblclick', onDblClick , true);

    canvas.addEventListener( 'mousedown', function(e){
        click = true;
        switch (e.button) {
            case 0:
                onClick(e);
                break;
            case 2:
                setTimeout(function () {
                  click = false;
                },200);
                break;
        }
    }, true);

    canvas.addEventListener('mouseup', function(e){
        if(e.button == 2 && click){
            toggleFslMenu();
        }
    });

    canvas.addEventListener( 'mousemove', onDocumentMouseMove, true );

    canvas.appendChild(renderer.domElement);


    controls = new THREE.TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 0.5;



    // Connect to localhost and start getting frames
    controller = Leap.loop();

    // Docs: http://leapmotion.github.io/leapjs-plugins/main/transform/
    Leap.loopController.use('transform', {

      // This matrix flips the x, y, and z axis, scales to meters, and offsets the hands by -8cm.
      vr: true,

      // This causes the camera's matrix transforms (position, rotation, scale) to be applied to the hands themselves
      // The parent of the bones remain the scene, allowing the data to remain in easy-to-work-with world space.
      // (As the hands will usually interact with multiple objects in the scene.)
      effectiveParent: camera

    });

    // Docs: http://leapmotion.github.io/leapjs-plugins/main/bone-hand/
    Leap.loopController.use('boneHand', {

      // If you already have a scene or want to create it yourself, you can pass it in here
      // Alternatively, you can pass it in whenever you want by doing
      // Leap.loopController.plugins.boneHand.scene = myScene.
      scene: scene,

      // Display the arm
      arm: true

    });
         


    //effect = new THREE.OculusRiftEffect( renderer, { worldScale: 1 } );
    //effect.setSize( window.innerWidth, window.innerHeight );

    effect = new THREE.VREffect(renderer, function(message){
    	console.log(message);
    });

    effect.setSize(window.innerWidth, window.innerHeight);
      

    var HDM;
    vr = parseInt(vr);
    switch (vr) {
        case 1:
            HDM = {
                hResolution: 1280,
                vResolution: 800,
                hScreenSize: 0.14976,
                vScreenSize: 0.0936,
                interpupillaryDistance: 0.064,
                lensSeparationDistance: 0.064,
                eyeToScreenDistance: 0.041,
                distortionK: [1.0, 0.22, 0.24, 0.0],
                chromaAbParameter: [0.996, -0.004, 1.014, 0.0]
            };
            break;
        case 2:
            HDM = {
                hResolution: 1920,
                vResolution: 1080,
                hScreenSize: 0.12576,
                vScreenSize: 0.07074,
                interpupillaryDistance: 0.0635,
                lensSeparationDistance: 0.0635,
                eyeToScreenDistance: 0.041,
                distortionK: [1.0, 0.22, 0.24, 0.0],
                chromaAbParameter: [0.996, -0.004, 1.014, 0.0]
            };
            break;



    }
    if (vr > 0) {
        //oculuscontrol = new THREE.OculusControls(camera);

        //oculuscontrol.connect();
        //effect.setHMD(HDM);
        //effect.setSize(window.innerWidth, window.innerHeight);
        //
  //
  //  // ADD VIRTUAL REALITY
  //    //
  //      //
  //
  //        // Moves (translates and rotates) the camera
  //
        oculuscontrol = new THREE.VRControls(camera, function(message){
    		console.log("VRControls:",message);
  	});

  	effect = new THREE.VREffect(renderer, function(message){
      		console.log("VREffect",message);
    	});

	effect.setSize(window.innerWidth, window.innerHeight);


  var onkey = function(event) {
    if (event.key === 'z' || event.keyCode === 122) {
      oculuscontrol.zeroSensor();
    }
    if (event.key === 'f' || event.keyCode === 102) {
      console.log('f');
      return effect.setFullScreen(true);
    }
    if (event.key === 'a' || event.keyCode === 97) {
	console.log('a:',camera.position);
	var movedir = new THREE.Vector3(0,0,1);
	//camera.position.sub(movedir);
	//camera.matrixWorldNeedsUpdate = true;
	HMDOffset.sub(movedir);
    }
    if (event.key === 'd' || event.keyCode === 100) {
	console.log('d:',camera.position);
	var movedir = new THREE.Vector3(0,0,-1);
	//camera.position.sub(movedir);
	//camera.matrixWorldNeedsUpdate = true;
	HMDOffset.sub(movedir);
    }
    if (event.key === 'w' || event.keyCode === 119) {
	console.log('w:',camera.position);
	var movedir = new THREE.Vector3(0,1,0);
	//camera.position.sub(movedir);
	//camera.matrixWorldNeedsUpdate = true;
	HMDOffset.sub(movedir);
    }
    if (event.key === 'x' || event.keyCode === 120) {
	console.log('x:',camera.position);
	var movedir = new THREE.Vector3(0,-1.0,0);
	//camera.position.sub(movedir);
	//camera.matrixWorldNeedsUpdate = true;
	HMDOffset.sub(movedir);
    }
    if (event.key === 'e' || event.keyCode === 101) {
	console.log('e:',camera.position);
	var movedir = new THREE.Vector3(1.0,0,0);
	//camera.position.sub(movedir);
	//camera.matrixWorldNeedsUpdate = true;
	HMDOffset.sub(movedir);
    }
    if (event.key === 'c' || event.keyCode === 99) {
	console.log('c:',camera.position);
	var movedir = new THREE.Vector3(-1.0,0,0);
	//camera.position.sub(movedir);
	//camera.matrixWorldNeedsUpdate = true;
	HMDOffset.sub(movedir);
    }
    if (event.key === 's' || event.keyCode === 115) {
	console.log('s:',camera.position);
	//var movedir = new THREE.Vector3(0,0,0.1);
              var zoomdir = new THREE.Vector3(0,0,1.0);
              zoomdir.applyQuaternion(camera.quaternion);
              //zoomdir.multiplyScalar(diffBallScale);
              //camera.position.sub(zoomdir);
              HMDOffset.sub(zoomdir);
	//camera.position.sub(movedir);
	//camera.matrixWorldNeedsUpdate = true;
	//HMDOffset.sub(movedir);
    }
  };

  window.addEventListener("keypress", onkey, true);

    }  // if (vr




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

    var axisHelper = new THREE.AxisHelper( 5 );
    scene.add( axisHelper );

    createLegend(activeGroup);

    addSkybox();
    animate();

};

 //
 /// Add a debug message Real quick
 // Prints out when receiving oculus data.
 //      //
 //        //
 
  var receivingPositionalData = false;
  var receivingOrientationData = false;

  var timerID = setInterval(function(){

    if (camera.position.x !== 0 && !receivingPositionalData){
      receivingPositionalData = true;
      console.log("receiving positional data");
    }

    if (camera.quaternion.x !== 0 && !receivingOrientationData){
      receivingOrientationData = true;
      console.log("receiving orientation data");
    }

    if (receivingOrientationData && receivingPositionalData){
      clearInterval(timerID);
    }

  }, 12000);





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
    createLegend(activeGroup);
};




animate = function () {

    requestAnimationFrame(animate);
    controls.update();

    //controls.update(  );
    if(vr > 0 ) {
        oculuscontrol.update();
	frame = controller.frame();
	var handposition = updatePinchPoint();
	camera.position.add(HMDOffset);

	camera.matrixWorldNeedsUpdate = true;

    //}

    var tempDist,nearestSphereIndex,nearestSphere,nearestSphereDist = 18.0;

    if (!handposition) handposition = camera.position;
 
    for(var i = 0; i < spheres.length; i++){
        if (spheres[i].visible) {
		spheres[i].lookAt(camera.position);
		if ( //(vr > 0) && 
		    ((tempDist = spheres[i].position.distanceTo(handposition)) <  nearestSphereDist) ) {
			nearestSphereDist = tempDist;
			nearestSphere = spheres[i];
			nearestSphereIndex = i;
		}
	}
    } 

    
    if ( nearestSphereDist < 0.333 ) {
	// select this one
		touchedSphere = nearestSphere;
		touchedSphereDist = nearestSphereDist;
	if (nearestSphereIndex != touchedSphereIndex) {
	//} else { // the touched SPhere has changed

		touchedSphereIndex = nearestSphereIndex;
		onTouch (touchedSphereIndex,touchedSphere);
	}
    } else {  
	if ( (touchedSphere != null) || (touchedSphereIndex != null) ) {
			nearestSphere = nearestSphereIndex = null;
			nearestSphereDist = 18;
			touchedSphereIndex = touchedSphere = null; // spheres[i];
			touchedSphereDist = 18;
			onTouch(null, null);	
	}
    }
  } else {
    for(var i = 0; i < spheres.length; i++){
        if (spheres[i].visible) {
		spheres[i].lookAt(camera.position);
	}
    }	
  } // if (vr			
    

    render();

};


render = function() {

    //Use the following line to render normally on the screen of the pc
    //renderer.render(scene, camera);

    // Use the following line to render the scene on the oculus rift
    //effect.render( scene, camera );

    if(vr == 0){
        renderer.render(scene, camera);
    }else{
        effect.render( scene, camera );
    }
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
    ).range([-5.0,+5.0]);   // MC 6/1/16
    //).range([-500,+500]);
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

    var geometry = new THREE.CircleGeometry( 1.0, 10);
    //var geometry = new THREE.CircleGeometry( .1, 10);
    for(var i=0; i < l; i++){
        spheres[i] = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());
        if(shouldDrawRegion(dataset[i])) {
            if(nodesSelected.indexOf(i) == -1) {
                //if the node is not selected
                /*material = new THREE.MeshPhongMaterial({
                    color: scaleColorGroup(dataset[i].group),
                    shininess: 15,
                    transparent: false,
                    opacity: 0.7
                });*/

                material = getNormalMaterial(dataset[i].group,i);

                //geometry = new THREE.SphereGeometry(1.0, 10, 10);
                geometry = createNormalGeometry(dataset[i].hemisphere);

            } else {
                /*
                material = new THREE.MeshPhongMaterial({
                    color: scaleColorGroup(dataset[i].group),
                    shininess: 15
                });*/

                material = getNormalMaterial(dataset[i].group,i);


                geometry = createSelectedGeometry(dataset[i].hemisphere);
            }

            if(root && root == i){
                //geometry = new THREE.SphereGeometry(3.0,10,10);
                geometry = createRootGeometry(dataset[i].hemisphere);
                material.transparent = false;
            }

            spheres[i] = new THREE.Mesh(geometry, material);
            spheres[i].userData.hemisphere = dataset[i].hemisphere;


            var x = centroidScale(dataset[i].x) - xCentroid;
            var y = centroidScale(dataset[i].y) - yCentroid;
            var z = centroidScale(dataset[i].z) - zCentroid;

            spheres[i].position.set(x, y, z);

            sphereNodeDictionary[spheres[i].uuid] = i;

            if(visibleNodes[i]){
                //spheres[i].lookAt( camera.position);
                scene.add(spheres[i]);
            }
        }
        spheres[i].userData.hemisphere = dataset[i].hemisphere;
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
    //var dist = computeShortestPathDistances(nodeIndex);

    var dist = getShortestPathDistances(nodeIndex);
    distanceArray = [];
    for(var i=0; i < getConnectionMatrixDimension(); i++){
        distanceArray[distanceArray.length] = dist[i];
    }

    setDistanceArray(distanceArray);


    if(!document.getElementById("distanceThresholdSlider")){
        addDistanceSlider(distanceArray);
    }

    shortestPathDistanceUI();

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
                //line = drawEdgeWithName(spheres[i].position, prev.position, getConnectionMatrix()[i][previousMap[i]]);
                var start = new THREE.Vector3(spheres[i].position.x, spheres[i].position.y, spheres[i].position.z);
                var end = new THREE.Vector3(prev.position.x, prev.position.y, prev.position.z);
                line = createLine(start,end,getConnectionMatrix()[i][previousMap[i]] );
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
    activeGroup = parseInt(n);

    setRegionsActivated();

    setColorGroupScale();

    for(var i=0; i < spheres.length; i++){
        scene.remove(spheres[i]);
    }

    spheres = [];
    updateScene();

};


changeActiveGeometry = function(n){
    activeCentroids = n;
    if(n == 'isomap'){
        activeMatrix = 'isomap';
    }else{
        activeMatrix = 'normal';
    }

    updateNeeded = true;
    computeDistanceMatrix();


    for(var i=0; i < spheres.length; i++){
        scene.remove(spheres[i]);
    }
    spheres = [];
    //TODO: switch according to spt

    if(spt) {
        drawShortestPath(root);
        console.log("drawing spt");
    }
    updateScene();
};



setGeometryGivenNode = function(nodeIndex, geometry){
    spheres[nodeIndex].geometry = geometry;
}


drawShortestPathHops = function (rootNode,hops){
    var hierarchy = getHierarchy(rootNode);

    shortestPathEdges = [];
    for(var i = 0; i < hierarchy.length; i++){
        if( i < hops + 1 ) {
            //Visible node branch
            for(var j=0; j < hierarchy[i].length; j++){
                visibleNodes[hierarchy[i][j]] = true;
                var prev = spheres[previousMap[hierarchy[i][j]]];
                if(prev){
                    var start = new THREE.Vector3(spheres[hierarchy[i][j]].position.x, spheres[hierarchy[i][j]].position.y, spheres[hierarchy[i][j]].position.z);
                    var end = new THREE.Vector3(prev.position.x, prev.position.y, prev.position.z);
                    var line = createLine(start, end, getConnectionMatrix()[hierarchy[i][j]][previousMap[hierarchy[i][j]]]);
                    shortestPathEdges[shortestPathEdges.length] = line;
                }
            }

        } else{
            for(var j=0; j < hierarchy[i].length; j++){
                visibleNodes[hierarchy[i][j]] = false;
            }
        }
    }

    shortestPathSliderHops();

    updateScene();
};


createLine = function (start,end, name){
    var material = new THREE.LineBasicMaterial();


    var geometry = new THREE.Geometry();
    geometry.vertices.push(
        start,
        end
    );


    var line  = new THREE.Line(geometry, material);
    line.name = name;

    return line;
};


addSkybox = function(){
    var folder = 'darkgrid';
   var images = [
        'images/'+folder+'/negx.png',
        'images/'+folder+'/negy.png',
        'images/'+folder+'/negz.png',
        'images/'+folder+'/posx.png',
        'images/'+folder+'/posy.png',
        'images/'+folder+'/posz.png'
    ];


    var cubemap = THREE.ImageUtils.loadTextureCube(images); // load textures
    cubemap.format = THREE.RGBFormat;

    var shader = THREE.ShaderLib['cube']; // init cube shader from built-in lib
    shader.uniforms['tCube'].value = cubemap; // apply textures to shader

// create shader material
    var skyBoxMaterial = new THREE.ShaderMaterial( {
        fragmentShader: shader.fragmentShader,
        vertexShader: shader.vertexShader,
        uniforms: shader.uniforms,
        depthWrite: false,
        side: THREE.BackSide
    });

// create skybox mesh
    var skybox = new THREE.Mesh(
        new THREE.CubeGeometry(1500, 1500, 1500),
        skyBoxMaterial
    );

    skybox.name = "skybox";

    scene.add(skybox);
};


setSkyboxVisibility = function(visible){
    var results = scene.children.filter(function(d) {return d.name == "skybox"})
    var skybox = results[0];

    skybox.visible = visible;

};

shouldDrawRegion = function(region) {
    if(isRegionActive(region.group) && getLabelVisibility(region.label))
        return true;

    return false;
};

drawSelectedNode = function (nodeIndex, mesh) {
    //objectIntersected.geometry = createSelectedGeometryByObject(objectIntersected.object);

    if(nodesSelected.indexOf(nodeIndex) == -1) {
        if (thresholdModality) {
            drawEdgesGivenNode(nodeIndex);
        } else {
            drawTopNEdgesByNode(nodeIndex, getNumberOfEdges());
        }
        nodesSelected[nodesSelected.length] = nodeIndex;
    }

    return createSelectedGeometry(mesh.userData['hemisphere'])
};
