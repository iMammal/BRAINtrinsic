/**
 * Created by giorgioconte on 31/01/15.
 *
 * Morris Chukhman Changelog:
 * 0.1 Change VR controls to WebVR
 * 0.2 Add Leap Hands
 * 0.3 Add Leap taffy pull movement gesture and movement keys
 * 0.4 Add Leap Hand centroid selection  6/1/16
 * 0.4.5 Add keyboard controls for root, neighbors, and spanning tree expansion 6/20/16
 * 0.4.7 Add gestures for root, neighbots and spanning tree. ToDo: more stable gesture recognition
 * 0.4.8 Add rotation with one-hand fist grab and rotate
...
 * 0.4.11 Got the camera on a dolly and made some of the 1-hand rotation control dolly instead of camera
 * 0.4.12 Got the rest of the  1-hand rotation to control dolly instead of camera 
 * 0.4.13 Got the two hand taffy pull to move the dolly rather than the camera
 * 0.4.15 Text overlay displaying dolly position or region+index
*  0.4.16 Begin Cleanup
*  0.4.17 Enable toggling 10 strongest connections onTouch and onPoke; onPoke Feedback; Reverse taffy zoom
*  0.4.18 Checkpoint
*  0.4.19 Begin coding Inertial rotation
*  0.4.19a autosaved debugging partial edits line 556
*  0.4.20 fixed some typos so that is runs ToDo: Implement WebVR 1.0  
*  0.5.0  Adopted WebVR 1.1 Display through latest three.js as of 20161031; cleaned hand controls a bit
*  0.5.1  Fixed scaling and rotation bugs. (Mostly - rotation still wonky sometimes, maybe around poles.)
*  0.5.2  Started Experiment with distance varient camera rotation speed. Didn't work well. Added 'o' key to remove debug text.
*  0.5.3  Inertial rotation only when one hand is detected open.
*  0.5.4  Inertial rotation when hands removed or both hands present but paused when one hand is detected open.
*  0.5.5  Inertial rotation whether hands present or not until pinch and hold still to stop.
*  0.5.6  Inertial angular velocity calculated from averaging 3 samples from last 6 frames to smoothen leap motion tracking noise.
*  
*  
 */

//var threshold = 30;


//if ( WEBVR.isLatestAvailable() === false ) {
//	document.body.appendChild( WEBVR.getMessage() );
//}


var camera;
var canvas;
var amap,sp,spcanvas;
var namap,nsp,nspcanvas;
var text42="Threshold",text43="Top Edges",text44="Clear";
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
var labeledNodeIndex;
var circleCount = 0;

var root;

var shortestPathEdges = [];

var distanceArray;

var thresholdModality = false; //true;

var stats, frame, controller;

var mouse = new THREE.Vector2();

var spt = false;

var click = true;

var ballRot = false;

var ballScaLen = 0;

var HMDOffset = new THREE.Vector3(0,0,0);

var vr = 0;
var device, sensor;

var vGrabCamPos,grabScene,vGrabScenePoint;

var lastAxis, lastAngle5,lastAngle4,lastAngle3,lastAngle2,lastAngle1,lastAngle, dAngle;

var dbgZoom, dbgRot=1;

var dolly;

var isMobile = function () {
  var check = false;
  (function (a) {
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) {
      check = true;
    }
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};




function onDocumentMouseMove( event )
{
    // the following line would stop any other event handler from firing
    // (such as the mouse's TrackballControls)
    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1

    var intersectedObject = getIntersectedObject(event);

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
	updateNodeLabel(regionName+index.toString(),spheres[index].position);
	labeledNodeIndex = index;

        if( thresholdModality) {
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


    var intersectedObject = getIntersectedObject(event);


    if(intersectedObject) {
        removeElementsFromEdgePanel();
        var nodeIndex = sphereNodeDictionary[intersectedObject.object.uuid];

        spt = true;
        drawShortestPath(nodeIndex);

    }
}

function onCircle(){

	circleCount++;
	
     text42 = "CIRCLE!"+circleCount.toString();
    //if ( (touchedSphere != null) || (touchedSphereIndex != null) ) {
     //updateTextbox(circleCount);
     updateTextbox("Circle:"+circleCount.toString());

        if(!spt) {
            //var nodeIndex = touchedSphereIndex; //sphereNodeDictionary[objectIntersected.object.uuid];


	    //updateNodeLabel(nodeIndex.toString()+"POKE!"+el.toString(),spheres[nodeIndex].position);



	    if(labeledNodeIndex && ( circleCount > 2)) { //(false && touchedSphere) {
		updateNodeLabel(labeledNodeIndex.toString()+"CIRCLE!",spheres[labeledNodeIndex].position);
        	removeElementsFromEdgePanel();
        	//var nodeIndex = touchedSphereIndex; //sphereNodeDictionary[touchedSphere.uuid];

        	spt = true;
		circleCount = 0;
     		updateTextbox("Circle:"+circleCount.toString());
        	drawShortestPath(labeledNodeIndex);
	    }
      } else {
	    if (circleCount > 2) {
		spt = false;
        	removeElementsFromEdgePanel();
	     text42 = "Circle!+spt";
		circleCount = 0;
     		text42="Circle:"+circleCount.toString();

	    if(labeledNodeIndex){
		updateNodeLabel(labeledNodeIndex.toString()+"Circle!",spheres[labeledNodeIndex].position);
	    } else {
		test42 = "Circle!";
	    }
      }
    }
    
}

function onClick( event ){

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    event.preventDefault();


    var objectIntersected = getIntersectedObject(event);


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

// Poke or 'n' key shows selected node's neighbors
function onPoke(  ){

    //event.preventDefault();


    //var objectIntersected = getIntersectedObject();

    circleCount = 0;
     
     text42="Circle:"+circleCount.toString();

    //if (objectIntersected && visibleNodes[sphereNodeDictionary[objectIntersected.object.uuid]]) {
    if ( (touchedSphere != null) || (touchedSphereIndex != null) ) {

        if(!spt) {
            var nodeIndex = touchedSphereIndex; //sphereNodeDictionary[objectIntersected.object.uuid];

            var el = nodesSelected.indexOf(nodeIndex);

	    //updateNodeLabel(regionName+index.toString()+"POKEL"+el.toString(),spheres[nodeIndex].position);
	    updateNodeLabel(nodeIndex.toString()+"POKE!"+el.toString(),spheres[nodeIndex].position);

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

                touchedSphere.geometry = drawSelectedNode(nodeIndex,touchedSphere);
                
                pointedObject = null;

            } else { //if the nodes is already selected, remove edges and remove from the nodeSelected Array

                touchedSphere.material.color = new THREE.Color(scaleColorGroup(getRegionByNode(nodeIndex),nodeIndex));
                //objectIntersected.object.geometry = new THREE.SphereGeometry(1.0,10,10);

                touchedSphere.geometry = createNormalGeometryByObject(touchedSphere);


                nodesSelected.splice(el, 1);
                removeEdgesGivenNode(nodeIndex);
            }
        } else{
            nodeIndex = sphereNodeDictionary[touchedSphere.uuid];
            getShortestPathBetweenNodes(root,nodeIndex);
        }
    }
}


var GESTUREDEBUG = true;

function onGesture(gesture,frame)
{

   if (GESTUREDEBUG) console.log(gesture.type + " with ID " + gesture.id + " in frame " + frame.id);

   if ( false || true || (gesture.type == "screenTap") || (gesture.type == "keyTap") ){
     //console.log("screenTap:"+indexPoint.position.distanceTo(middlePoint) );
     //console.log(pointedObject);
     //if(indexPoint && indexPoint.position && middlePoint && (indexPoint.position.distanceTo(middlePoint) < 0.025)) {
     console.log("poke:");
     if (pointedObject) {
	console.log(pointedObject);
	//onCircle();
        onPoke();
     } else {
        console.log("Poke:NULL");
     }
     //} else {
     //   onPoke();
     //}
   }
   if (gesture.type == "circle") {
     console.log("circle:");
     if (pointedObject) {
	console.log(pointedObject);
	onCircle();
     } else {
        console.log("Circle:NULL");
     }
   }
}

/*//////////////////////////////////////
 * updatePinchPoint: Implement Leap Motion hands
 * for taffy pull gesture for movement in VR space
 * Written by Morris CHukhman 6/1/16
*///////////////////////////////////////

var ONEHANDCONTROL = true;

updatePinchPoint = function (){
    if( frame.tools.length > 0 ){

        console.log("tool: ",frame.tools[0].tipPosition);

    }

		          var origin = new THREE.Vector3(0,0,0);
    if( frame.hands ){
	switch (frame.hands.length){
		case 0:
			break;
		case 1:
			if((Math.random()<0.01)&&(frame.hands))console.log("hand: ",frame.hands[0].palmPosition,frame.hands[0].pinchStrength);
		        var hand = frame.hands[0];
			var vHandPosition = new THREE.Vector3 (0,0,0);
			if(hand && hand.palmPosition) {
				vHandPosition.fromArray(hand.palmPosition);
                                console.log("hand position:",vHandPosition);
				if(dbgRot) {
				    updateTextbox('hx:'+vHandPosition.x.toString(), 
					"hy:"+vHandPosition.y.toString(),
					"hz:"+vHandPosition.z.toString(),
					grabScene?"grabScene+":"grabScene-",
					"hand0");
				    }
			} else {
                		console.log("hand but no palmPosition:");
				return 0;
			}
    //if ( (touchedSphere != null) || (touchedSphereIndex != null) ) {
			
			var dollyDistOffset = 1.1;// dolly.position.lengthSq()/50.0; //Sq();

            		if (hand && grabScene && vGrabScenePoint) {
			  // if(ONEHANDMOVE) {
		          //  var vGrabSceneDifference = new THREE.Vector3(0,0,0);

		          //  vGrabSceneDifference.subVectors(vHandPosition, vGrabScenePoint );
        		  //  vGrabSceneDifference.multiplyScalar(speed);
			  //}
		          var _rotateStart = vGrabScenePoint;
		          var _rotateEnd = vHandPosition;
		          var angle = Math.acos( _rotateStart.dot( _rotateEnd ) / _rotateStart.length() / _rotateEnd.length() );

                	  if ( angle > 0.000) {

                          	var axis = ( new THREE.Vector3() ).crossVectors( _rotateStart, _rotateEnd ).normalize(),
                                quaternion = new THREE.Quaternion();
	                        angle *= controls.rotateSpeed * 1.81 * dollyDistOffset;
        	                quaternion.setFromAxisAngle( axis, -angle );
	                        if(0) {
					HMDOffset.copy(vGrabCamPos.applyQuaternion(quaternion));
				} else {
					//camera.position.copy(vGrabCamPos.applyQuaternion(quaternion));
					dolly.position.copy(vGrabCamPos.applyQuaternion(quaternion));
				}

				lastAxis.copy(axis);
				//dAngle = lastAngle - angle;
				dAngle = ((lastAngle5 - lastAngle4) + (lastAngle3-lastAngle2) + (lastAngle1-lastAngle))/3.0;
				lastAngle5 = lastAngle4;
				lastAngle4 = lastAngle3;
				lastAngle3 = lastAngle2;
				lastAngle2 = lastAngle1;
				lastAngle1 = lastAngle;
				lastAngle = angle;

				if(dbgRot && lastAngle5) {
				    text42 = "lastAngle5:"+lastAngle5.toString();
				    text43 = "angle:"+angle.toString();
				    text44 = "dAngle:"+dAngle.toString();
				    //text44 = "dollyDistOffset:"+dollyDistOffset; //grabScene?"grabScene+":"grabScene-";
                                    updateTextbox('hx:'+vHandPosition.x.toString(),
                                        "hy:"+vHandPosition.y.toString(),
                                        "hz:"+vHandPosition.z.toString(),
                                        "lx:"+lastAxis.x.toString(),
                                        "ly:"+lastAxis.y.toString(),
                                        "lz:"+lastAxis.z.toString(),
                                        "hand0open");
     				}
	                        //camera.lookAt( origin );
			  } // if ( angle > 0.000) ...

			  if (hand && hand.pinchStrength < 0.5) grabScene = false;



			} else {  //  if (hand && grabScene && vGrabScenePoint) ...
			    if (hand &&  (!touchedSphere)  && (hand.pinchStrength > 0.5) ) {
                		grabScene = true;

                		vGrabCamPos = new THREE.Vector3( 0,0,0 );
                		//vGrabCamPos.copy( 0?HMDOffset:camera.position ) ;
                		vGrabCamPos.copy( 0?HMDOffset:dolly.position ) ;
                		vGrabScenePoint = new THREE.Vector3 ( 0,0,0 );
                		vGrabScenePoint.copy( vHandPosition );
                		console.log("grabScenePoint:");
                		console.log(vGrabScenePoint);
                		console.log("grabCamPos:");
                		console.log(vGrabCamPos);
			    } else { //  if (hand...
			// Inertial rotation (When one open hand detected)
                	      if ( (dAngle > 0.0001) || (dAngle < 0.0001) ) {

				if(0 && dbgRot) {
	                            updateTextbox(//"h:"+vHandPosition.y.toString(),
				        "hx:"+vHandPosition.x.toString(),
                                        "hy:"+vHandPosition.y.toString(),
                                        "hz:"+vHandPosition.z.toString(),
					grabScene?"grabScene+":"grabScene-",
                                        "hand0");
				}

                          	//var axis = ( new THREE.Vector3() ).crossVectors( _rotateStart, _rotateEnd ).normalize(),
                                quaternion = new THREE.Quaternion();
	                        //angle *= controls.rotateSpeed * 1.81;
        	                quaternion.setFromAxisAngle( lastAxis, -dAngle );
					//HMDOffset.copy(vGrabCamPos.applyQuaternion(quaternion));
					//camera.position.copy(vGrabCamPos.applyQuaternion(quaternion));
				dolly.position.applyQuaternion(quaternion);

				//dolly.position.	
			      } // if ( dAngle...

            		    } // else 
	
			if (hand && hand.pinchStrength < 0.5) grabScene = false;
			

			return hand?hand.palmPosition:0;
			//break;
		   }
		case 2:
			if(Math.random()<0.1){
				console.log("hand1: ",frame.hands[0].palmPosition,frame.hands[0].pinchStrength);
				console.log("hand2: ",frame.hands[1].palmPosition,frame.hands[1].pinchStrength);
			}
		        var hand = frame.hands[0];
		        var hand2 = frame.hands[1];

        var hand1Pos = new THREE.Vector3(0,0,0);
        var hand2Pos = new THREE.Vector3(0,0,0);
        if(hand) {
		hand1Pos.fromArray(hand.palmPosition);
	} else { return 0; }

        if(hand2) {
		 hand2Pos.fromArray(hand2.palmPosition);
	} else { return 0; }

        var handvec = new THREE.Vector3(1.0,0.0,0.0);
        handvec.subVectors(hand2Pos, hand1Pos);

        var handvecLen = handvec.length();
        //var halfHandvecLen = handvec.multiplyScalar(0.5);
        pinchStrength = (hand.pinchStrength + hand2.pinchStrength) / 2;
	if((Math.random()<0.1) && dbgZoom) {
				text42 = "handvecLen:"+handvec.length();
				text43 = "ballScaLen:"+ballScaLen;
				text44 = "pinchStrength:"+pinchStrength;
				updateTextbox('h1x:'+hand1Pos.x.toString(), 
					"h1y:"+hand1Pos.y.toString(),
					"h1z:"+hand1Pos.z.toString(),
					"h2x:"+hand2Pos.x.toString(),
					"h2y:"+hand2Pos.y.toString(),
					"h2z:"+hand2Pos.z.toString(),
					ballRot?"ballRot":"!ballRot");
					//"hand0");

	}

      if (pinchStrength > 0.8) {

         if (!ballRot) {
            //ballRotAngle.copy(handvec);
            //ballRotCam.copy(camera.rotation);
            ballScaLen = handvecLen;
            //ballScaCam.copy(camera.scale);
            ballRot = true;
	    grabScene = false; 
          } else {

	    var diffBallScale;
            if (ballScaLen != 0) diffBallScale = handvecLen - ballScaLen;

            if (( diffBallScale != 0) && (dolly.position.distanceTo(origin)>0.3)) {

              var zoomdir = new THREE.Vector3(0,0,-1.0);
              zoomdir.applyQuaternion(dolly.quaternion);
              zoomdir.multiplyScalar(diffBallScale*5);
              if (vr == 0) {
                camera.position.sub(zoomdir);
                camera.matrixWorldNeedsUpdate = true;
                console.log("zoom: ",zoomdir,camera.position,diffBallScale);
	      } else {
                HMDOffset.sub(zoomdir);
                console.log("zoom: ",zoomdir,HMDOffset,diffBallScale);
	      }
            }

	  } // if  (!ballRot)  ... else ...

	} else {
		ballRot = false;
		grabScene = false; 
        } // if (pinchStrength
	
      } // switch

			// Inertial rotation (When no or both hands detected)
                	      //if ( dAngle > 0.000) {
                	      if ( (dAngle > 0.0001) || (dAngle < 0.0001) ) {

				if(0 && dbgRot) {
	                            updateTextbox(//"h:"+vHandPosition.y.toString(),
				        "hx:"+vHandPosition.x.toString(),
                                        "hy:"+vHandPosition.y.toString(),
                                        "hz:"+vHandPosition.z.toString(),
					grabScene?"grabScene+":"grabScene-",
                                        "hand0");
				}

                          	//var axis = ( new THREE.Vector3() ).crossVectors( _rotateStart, _rotateEnd ).normalize(),
                                quaternion = new THREE.Quaternion();
	                        //angle *= controls.rotateSpeed * 1.81;
        	                quaternion.setFromAxisAngle( lastAxis, -dAngle );
					//HMDOffset.copy(vGrabCamPos.applyQuaternion(quaternion));
					//camera.position.copy(vGrabCamPos.applyQuaternion(quaternion));
				dolly.position.applyQuaternion(quaternion);

				//dolly.position.	
			      } // if ( dAngle...

    } //     if( frame.hands )...

} // function



function requestFullscreen() {
  var el = renderer.domElement;

  if (!isMobile()) {
    effect.setFullScreen(true);
    return;
  }

  if (el.requestFullscreen) {
    el.requestFullscreen();//{vrDisplay: hmd});
  } else if (el.mozRequestFullScreen) {
    el.mozRequestFullScreen();
  } else if (el.webkitRequestFullscreen) {
    el.webkitRequestFullscreen();
  }
}

parseDev =	function (devices) {
			for (var i = 0; i < devices.length; i++) {
				if (devices[i] instanceof HMDVRDevice) {
					device = devices[i];
				}
				if (devices[i] instanceof PositionSensorVRDevice) {
					sensor = devices[i];
				}
			}
			if (!device || !sensor) {
				reject("No HMD or HMD Position Sensor");
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
    setNumberOfEdges(10);

    //setThreshold(30);
    computeDistanceMatrix();
    var light;

    scene = new THREE.Scene();
  
    // setup dolly that camera rides on.
    dolly = new THREE.Group();
    dolly.position.set(0000, 0000, 00050);
    scene.add(dolly);
        
    lastAxis = new THREE.Vector3 (0,0,0);
 
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000);

    camera.position.z = -0.00050;
    spheres = [];

    dolly.add(camera);

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


    controls = new THREE.TrackballControls(dolly, renderer.domElement);
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
         

    controller.on('gesture', onGesture);

    //effect = new THREE.OculusRiftEffect( renderer, { worldScale: 1 } );
    //effect.setSize( window.innerWidth, window.innerHeight );

    // This is done again below. I just noticed this is in here twice
    //effect = new THREE.VREffect(renderer, function(message){
    //	console.log(message);
    //});

    /* For Oculus Development Kits, rendering was done to display because they presented as displays.
 *
 *  CV1 presents as a device so that is handled differently.
 *
 
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



    } // switch (vr)

    */

    if (true) { //(vr > 0) {
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

	// The size was already set in the renderer definition above
	//effect.setSize(window.innerWidth, window.innerHeight);

	//manager = new WebVRManager(renderer, effect, {hideButton: false});
	navigator = window.navigator;
/*
	if (navigator.mozGetVRDevices) {
		console.log( "moz navigator");
	} else if (navigator.getVRDevices) {
		console.log( "chrome navigator");
		vrdevs = navigator.getVRDevices( function (devices) {
			for (var i = 0; i < devices.length; i++) {
				if (devices[i] instanceof HMDVRDevice) {
					device = devices[i];
				}
				if (devices[i] instanceof PositionSensorVRDevice) {
					sensor = devices[i];
				}
			}
			if (!device || !sensor) {
				reject("No HMD or HMD Position Sensor");
			}
		});
		if (vrdevs[0] instanceof HMDVRDevice) {
			//device = vrdevs[0];
			console.log( "dev0: HMD");
		}
		if (vrdevs[0] instanceof PositionSensorVRDevice) {
			//sensor = vrdevs[0];
			console.log( "dev0: Sens");
		}
		if (vrdevs[1] instanceof HMDVRDevice) {
			//device = vrdevs[1];
			console.log( "dev1: HMD");
		}
		if (vrdevs[1] instanceof PositionSensorVRDevice) {
			//sensor = vrdevs[1];
			console.log( "dev1: Sense");
		}
	
	} else {
		console.log( "no navigator");
	}
			if (!device || !sensor) {
				console.log("No HMD or HMD Position Sensor",sensor,device);
			}
*/


	if ( navigator.getVRDisplays ) {
		navigator.getVRDisplays()
			.then( function ( displays ) {
				effect.setVRDisplay( displays[ 0 ] );
				controls.setVRDisplay( displays[ 0 ] );
			} )
			.catch( function () {
				// no displays
				//vr = 0;
			} );
		
		if (vr > 0) {
			document.body.appendChild( WEBVR.getButton( effect ) );
		}
	}
							//
							//


  var onkey = function(event) {
    if (event.key === 'z' || event.keyCode === 122) {
      oculuscontrol.zeroSensor();
    }
    if (event.key === 'f' || event.keyCode === 102) {
      console.log('f');
      return effect.setFullScreen(true);
    }
    if (event.key === 'a' || event.keyCode === 97) {
	console.log('a:',dolly.position);
	var movedir = new THREE.Vector3(0,0,1);
	//dolly.position.sub(movedir);
	//dolly.matrixWorldNeedsUpdate = true;
	HMDOffset.sub(movedir);
	updateTextbox('x:'+dolly.position.x.toString(), 
			"y:"+dolly.position.y.toString(),
			"z:"+dolly.position.z.toString(),
			"a = 0,0,1",movedir);
    }
    if (event.key === 'd' || event.keyCode === 100) {
	console.log('d:',dolly.position);
	var movedir = new THREE.Vector3(0,0,-1);
	//dolly.position.sub(movedir);
	//dolly.matrixWorldNeedsUpdate = true;
	HMDOffset.sub(movedir);
	updateTextbox('x:'+dolly.position.x.toString(), 
			"y:"+dolly.position.y.toString(),
			"z:"+dolly.position.z.toString(),
			"d = 0,0,-1",movedir);
    }
    if (event.key === 'w' || event.keyCode === 119) {
	console.log('w:',dolly.position);
	var movedir = new THREE.Vector3(0,1,0);
	//dolly.position.sub(movedir);
	//dolly.matrixWorldNeedsUpdate = true;
	HMDOffset.sub(movedir);
	updateTextbox('x:'+dolly.position.x.toString(), 
			"y:"+dolly.position.y.toString(),
			"z:"+dolly.position.z.toString(),
			"w = 0,1,0",movedir);
    }
    if (event.key === 'x' || event.keyCode === 120) {
	console.log('x:',dolly.position);
	var movedir = new THREE.Vector3(0,-1.0,0);
	//dolly.position.sub(movedir);
	//dolly.matrixWorldNeedsUpdate = true;
	HMDOffset.sub(movedir);
	updateTextbox('x:'+dolly.position.x.toString(), 
			"y:"+dolly.position.y.toString(),
			"z:"+dolly.position.z.toString(),
			"x = 0,-1,0",movedir);
    }
    if (event.key === 'e' || event.keyCode === 101) {
	console.log('e:',dolly.position);
	var movedir = new THREE.Vector3(1.0,0,0);
	//dolly.position.sub(movedir);
	//dolly.matrixWorldNeedsUpdate = true;
	HMDOffset.sub(movedir);
	updateTextbox('x:'+dolly.position.x.toString(), 
			"y:"+dolly.position.y.toString(),
			"z:"+dolly.position.z.toString(),
			"e = 1,0,0",movedir);
    }
    if (event.key === 'c' || event.keyCode === 99) {
	console.log('c:',dolly.position);
	var movedir = new THREE.Vector3(-1.0,0,0);
	//dolly.position.sub(movedir);
	//dolly.matrixWorldNeedsUpdate = true;
	HMDOffset.sub(movedir);
	updateTextbox('x:'+dolly.position.x.toString(), 
			"y:"+dolly.position.y.toString(),
			"z:"+dolly.position.z.toString(),
			"c = -1,0,0",movedir);
    }
    if (event.key === 's' || event.keyCode === 115) {
	console.log('s:',dolly.position);
	//var movedir = new THREE.Vector3(0,0,0.1);
              var zoomdir = new THREE.Vector3(0,0,1.0);
              //zoomdir.applyQuaternion(camera.quaternion);
              zoomdir.applyQuaternion(dolly.quaternion);
              //zoomdir.multiplyScalar(diffBallScale);
              //dolly.position.sub(zoomdir);
              HMDOffset.sub(zoomdir);
	updateTextbox('x:'+dolly.position.x.toString(), 
			"y:"+dolly.position.y.toString(),
			"z:"+dolly.position.z.toString(),
			"s = quat:0,0,1");
	//dolly.position.sub(movedir);
	//dolly.matrixWorldNeedsUpdate = true;
	//HMDOffset.sub(movedir);
    }
    if (event.key === 'q' || event.keyCode === 113) {
	console.log('q:',dolly.position);
	//var movedir = new THREE.Vector3(0,0,0.1);
              var zoomdir = new THREE.Vector3(0,0,-1.0);
              //zoomdir.applyQuaternion(camera.quaternion);
              zoomdir.applyQuaternion(dolly.quaternion);
              //zoomdir.multiplyScalar(diffBallScale);
              //dolly.position.sub(zoomdir);
              HMDOffset.sub(zoomdir);
	updateTextbox('x:'+dolly.position.x.toString(), 
			"y:"+dolly.position.y.toString(),
			"z:"+dolly.position.z.toString(),
			"q = quat:0,0,-1");
	//dolly.position.sub(movedir);
	//dolly.matrixWorldNeedsUpdate = true;
	//HMDOffset.sub(movedir);
    }
    if (event.key === 'n' || event.keyCode === 110) {
	console.log('n:',dolly.position);
	onPoke();	
    }
    if (event.key === 'm' || event.keyCode === 109) {
	console.log('m:',dolly.position);
	onCircle();
    }
    if (event.key === 'b' || event.keyCode === 98) {
	console.log('b:',dolly.position);
    }
    if (event.key === 'v' || event.keyCode === 118) {
	console.log('b:',dolly.position);
	requestFullscreen();
    }

    if (event.key === 'o' || event.keyCode === 111) {
	if(dbgRot){
		dbgRot=0;
		dbgZoom=1;
		console.log('Debugging Zoom');
	} else if (dbgZoom) {
		dbgRot=0;
		dbgZoom=0;
		text42 = "";
		text43 = "";
		text44 = "";
		updateTextbox("","","","","","","");//+vHandPosition.y.toString(),
		console.log('Debugging Off');
	}
	 else {
		dbgRot=1;
		dbgZoom=0;
		console.log('Debugging Rotation');
	}
	requestFullscreen();
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

    addNodeLabel(); 
    addTextbox();
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

  if (true) {
    //controls.update(  );
    if(vr > 0 ) {
        oculuscontrol.update();
    }
    frame = controller.frame();
    var handpositionArray = 0;
    handpositionArray = updatePinchPoint();
    var handposition = new THREE.Vector3(0,0,0);
    if(vr > 0 ) {
	//camera.position.add(HMDOffset);
	dolly.position.add(HMDOffset);
	HMDOffset.copy(handposition);
	//camera.matrixWorldNeedsUpdate = true;
	dolly.matrixWorldNeedsUpdate = true;
    }
    

    var handposition = new THREE.Vector3(0,0,0);
    var tempDist,nearestSphereIndex,nearestSphere,nearestSphereDist = 18.0;

    // If no hands are in the scene use camera position as selection cursor
    if (!handpositionArray) {
	handposition = camera.position;
    } else {
	handposition.fromArray(handpositionArray);
    } 

    for(var i = 0; i < spheres.length; i++){
        if (spheres[i].visible) {
		//spheres[i].lookAt(camera.position);
		spheres[i].lookAt(dolly.position);
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
		//spheres[i].lookAt(camera.position);
		spheres[i].lookAt(dolly.position);
	}

    }	
  } // if (true			
    

    render();  // before manager
    //manager.render(scene, camera, timestamp);

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
                spheres[i].lookAt( dolly.position);
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


getIntersectedObject = function (myevent) {

    var vector = new THREE.Vector3(
        ( myevent.clientX / window.innerWidth ) * 2 - 1,
        - ( myevent.clientY / window.innerHeight ) * 2 + 1,
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

updateTextbox = function(text1,text2,text3,text4,text5,text6,movedir) {
        var context = spcanvas.getContext('2d');
        //context.fillStyle = '#ff0000'; // CHANGED
        context.textAlign = 'left'; //'center';
        //context.font = '24px Arial';
	context.clearRect(0,0,500,550);
        if(text1)context.fillText(text1, 10, 20);
        if(text2)context.fillText(text2, 10, 50);
        if(text3)context.fillText(text3, 10, 80);
        if(text4)context.fillText(text4, 10, 110);
        if(text5)context.fillText(text5, 10, 140);
        else if(text42) context.fillText(text42, 10, 140);
        if(text6)context.fillText(text6, 10, 170);
        if(text42)context.fillText(text42, 10, 200);
        if(text43)context.fillText(text43, 10, 230);
        if(text44)context.fillText(text44, 10, 260);
        amap.needsUpdate = true;
	//if(movedir)sp.position.set(movedir.x,movedir.y,movedir.z);
        sp.needsUpdate = true;

}

updateNodeLabel = function(text1,movedir) {
        var context = nspcanvas.getContext('2d');
        //context.fillStyle = '#ff0000'; // CHANGED
        context.textAlign = 'left'; //'center';	//'right'
        //context.font = '24px Arial';
	context.clearRect(0,0,500,500);
        //if(text1)context.fillText(text1, 10, 20);
        if(text1)context.fillText(text1, 10, 120);
        namap.needsUpdate = true;
	if(movedir){nsp.position.set(movedir.x,movedir.y,movedir.z);
        		//context.fillText("x:"+movedir.x.toString(), 10, 50);
        		//context.fillText("y:"+movedir.y.toString(), 10, 80);
        		//context.fillText("z:"+movedir.z.toString(), 10, 110);
        }
	nsp.needsUpdate = true;

	

}

addTextbox = function() {

	spcanvas = document.createElement('canvas');
	var size = 256; // CHANGED
	spcanvas.width = size*2;
	spcanvas.height = size;
	var context = spcanvas.getContext('2d');
	context.fillStyle = '#ff0000'; // CHANGED
	context.textAlign = 'center';
	context.font = '24px Arial';
	context.fillText("some text", size / 2, size / 2);

	amap = new THREE.Texture(spcanvas);
	amap.needsUpdate = true;

	var mat = new THREE.SpriteMaterial({
	    map: amap,
	    transparent: false,
	    useScreenCoordinates: false,
	    color: 0xffffff // CHANGED
	});

	sp = new THREE.Sprite(mat);
	sp.scale.set( 3, 3, 1 ); // CHANGED
	sp.position.set( 0, -2, 2 ); // CHANGED
	//scene.add(sp);   
	dolly.add(sp);   

}

addNodeLabel = function() {

	nspcanvas = document.createElement('canvas');
	var size = 256; // CHANGED
	nspcanvas.width = size*2;
	nspcanvas.height = size;
	var context = nspcanvas.getContext('2d');
	context.fillStyle = '#ff0000'; // CHANGED
	context.textAlign = 'center';
	context.font = '24px Arial';
	context.fillText("Node Label", size / 2, size / 2);

	namap = new THREE.Texture(nspcanvas);
	namap.needsUpdate = true;

	var mat = new THREE.SpriteMaterial({
	    map: namap,
	    trannsparent: false,
	    useScreenCoordinates: false,
	    color: 0xffffff // CHANGED
	});

	nsp = new THREE.Sprite(mat);
	nsp.scale.set( 1, 1, 1 ); // CHANGED
	nsp.position.set( 0, 0, 2 ); // CHANGED
	//scene.add(nsp);   
	scene.add(nsp);   

}

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
