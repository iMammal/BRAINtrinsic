/**
 * Created by giorgioconte on 31/01/15.
 */
/*
private variables
 */

var spheres;
var groups = [];
var labelKeys;
var centroids;
var lookUpTable;
var activeGroup = 0;
var connectionMatrix;
var regionsActivated = [];

var newLookUpTable = [];



var distanceThreshold;
var threshold;
var distanceArray;
var numberOfEdges = 5;




/*
Setters
 */


setDistanceArray = function(array){
    distanceArray = array;
}


getMaximumDistance = function(){
    return d3.max(distanceArray);
}

/**
 * Label Keys setter
 */

setLabelKeys = function(labels){
    labelKeys = labels.data;
};

/**
 *  Centroid Setter
 */


setCentroids = function (d) {
    var data = d.data;
    var len = data.length;
    centroids = [];
    for(var i=0; i < len; i++){
        var element = {};
        element.x = data[i][0];
        element.y = data[i][1];
        element.z = data[i][2];
        centroids[centroids.length] = element;
    }
};

setDistanceThreshold = function (dt) {
    if(document.getElementById("distanceThresholdOutput")){
        var percentage = dt/getMaximumDistance();
        var value = Math.floor(percentage*100)/100;
        document.getElementById("distanceThresholdOutput").value = value+ " %";
    }
    distanceThreshold = dt;
};


getDistanceThreshold = function () {
    return distanceThreshold;
};

setThreshold = function (t) {
    document.getElementById("thresholdOutput").value = t;
    threshold = t;
};

getThreshold = function () {
    return threshold;
}

setLookUpTable = function (d) {
    var i, el;


    lookUpTable = d.data;

    for(i = 0; i < d.data.length ; i++){
        el = {"group": d.data[i].group,
            "place" : d.data[i].place,
            "rich_club":d.data[i].rich_club,
            "region_name":d.data[i].region_name
        };

    newLookUpTable[d.data[i].label] = el;
    }

};


setConnectionMatrix = function(d){
    connectionMatrix = d.data;
};

/**
 * Setter for group
 */

setGroup = function (d) {
    groups[groups.length] = d.data;
}

/*
 * GETTERS
 */
/**
 * Label keys getter.
 * @returns an array of label keys
 */

getLabelKeys = function(){
    var l = labelKeys.length;
    var result = [];
    //Cloning the array

    for(var i =0; i < l; i++){
        result[result.length] = labelKeys[i];
    }

    return result;
};


/**
 *  Centroid getters
 *  @return an array of objects with three fields named "x","y","z"
 */

getCentroids = function(){
    var l = centroids.length;
    var results = [];
    for(var i=0; i < l; i++){
        var element = {};
        element.x = centroids[i].x;
        element.y = centroids[i].y;
        element.z = centroids[i].z;
        results[results.length] = element;
    }

    return results;
};


/**
 * Get the entire dataset to render the scene
 */
/*
getDataset = function () {
    var row;
    var arrayLength = labelKeys.length;
    var result =[];
    var group = [];

    for(var i=0; i < arrayLength; i++ ){
        row ={};
        row.x = centroids[i].x;
        row.y = centroids[i].y;
        row.z = centroids[i].z;
        var label = labelKeys[i];
        var lengthLookUpTable= lookUpTable.length;
        var index;
        //Looking for the right element in the lookup table

        for(var j = 0,found = 0; j < lengthLookUpTable && found == 0; j++){

            if(lookUpTable[j].label === label){
                found == 1;
                index = j;
            }
        }
        row.group = groups[activeGroup][index];

        //row.name = lookUpTable[index].region_name;

        result[result.length] = row;
        /*
        var groupIndex = group.indexOf(row.group);

        if(groupIndex == -1){
            group [group.length] = row.group;
        }
    }

    //groups[groups.length] = group;

    //activeGroup = group;


    return result;
};*/


getDataset = function () {
    var row;
    var arrayLength = labelKeys.length;
    //var index;
    var result = [];

    for (var i = 0; i < arrayLength; i++) {
        row = {};

        //getting Centroids
        row.x = centroids[i].x;
        row.y = centroids[i].y;
        row.z = centroids[i].z;


        var label = labelKeys[i];
        var lengthLookUpTable= lookUpTable.length;

        //Looking for the right element in the lookup table

        for (var j = 0, found = false; j < lengthLookUpTable && !found; j++) {

            if (lookUpTable[j].label == label) {
                found = true;
                row.name = lookUpTable[j].region_name;
            }
        }

        row.group = groups[activeGroup][i];

        result[result.length] = row;
    }
    return result;
};

getNewDataset = function() {
    var row;
    var arrayLength = labelKeys.length;
    //var index;
    var result = [];

    for (var i = 0; i < arrayLength; i++) {
        row = {};

        //getting Centroids
        row.x = centroids[i].x;
        row.y = centroids[i].y;
        row.z = centroids[i].z;


        var label = labelKeys[i];

        row.name = newLookUpTable[label].region_name;

        row.group = groups[activeGroup][i];

        result[result.length] = row;
    }
    return result;
};


getActiveGroup = function () {
    /*
    var l = activeGroup.length;
    var result = [];

    for(var i=0; i < l; i++){
        result[result.length] = activeGroup[i];
    }
    return result;*/


    var l = groups[activeGroup].length;
    var results = [];
    for(var i = 0; i < l; i++){
        var element = groups[activeGroup][i];
        if(results.indexOf(element) == -1){
            results[results.length] = element;
        }
    }
    return results;
};

/**
 * This method gets the data about the connection matrix.
 * @returns a matrix of connections.
 */

getConnectionMatrix = function () {
    /* For performance reasons it is not possible to clone the entire object. Since the matrix is symmetric, and idea could be
    to clone just one half of the entire matrix. Now.. are we dealing always with symmetric matrices?
     */

    /*
    var clone = [];
    var clonedRow = [];
    var l = connectionMatrix.length;
    for(var i = 0; i < l; i++ ){
        var l_inner = connectionMatrix;
        for (var j = 0; j < l_inner; j++ ){
            clonedRow[clonedRow.length] = connectionMatrix[i][j];
        }
        clone[clone.length] = clonedRow;
    }

    return clone;*/
    return connectionMatrix;
};


getConnectionMatrixRow = function(index){
    var row = [];
    for(var i=0; i < connectionMatrix.length; i++){
        row[row.length] = connectionMatrix[index][i]
    }
    return row;
};


getRegionByNode = function (nodeIndex) {
    return groups[activeGroup][nodeIndex];
};



isRegionActive = function(region){
    return regionsActivated[region];
};

toggleRegion = function (regionName){
    if(regionsActivated[regionName]){
        regionsActivated[regionName] = false;
    } else {
        regionsActivated[regionName] = true;
    }
    updateScene();
};

setRegionsActivated = function (){
    /*regionsActivated = [];

    var l = groups[activeGroup].length;;
    for(var i =0; i < l; i++){
        var element = groups[activeGroup][i];
        regionsActivated[element] = true;
    }*/

    regionsActivated = {};

    var l = groups[activeGroup].length;;
    for(var i = 0; i < l; i++){
        var element = groups[activeGroup][i];
        regionsActivated[element] = true;
    }

};


getConnectionMatrixDimension = function(){
    return connectionMatrix.length;
}


getTopConnectionsByNode = function(indexNode, n){
    var row = getConnectionMatrixRow(indexNode);
    var sortedRow = row.sort(function(a, b){return b-a}); //sort in a descending flavor

    var res = {};
    for(var i=0; i < n; i++){
        res[getConnectionMatrixRow(indexNode).indexOf(sortedRow[i])] = sortedRow[i];
    }

    return res;
}


getMaximumWeight = function () {

    var max = d3.max(connectionMatrix, function(d){
        return d3.max(d, function(d){
            return d;
        })
    });

    return max;
};


getNumberOfEdges = function () {
  return numberOfEdges;
};

setNumberOfEdges = function(n){
    if(document.getElementById("topNThresholdSliderOutput")){
        document.getElementById("topNThresholdSliderOutput").value = n;
    }

    numberOfEdges = n;
};



createGroups = function () {
    var anatomicalGroup = [];
    var richClubGroup = [];
    var placeGroup = [];

    for(var i=0; i < labelKeys.length; i++){
        var labelKey = labelKeys[i];

        for(var j = 0, found = false; j < lookUpTable.length && !found; j++){
            if(lookUpTable[j].label == labelKey){
                found = true;
                anatomicalGroup[anatomicalGroup.length] = lookUpTable[j].group;
                placeGroup[placeGroup.length] = lookUpTable[j].place;
                richClubGroup[richClubGroup.length] = lookUpTable[j].rich_club;
            }
        }

    }
    groups[groups.length] = anatomicalGroup;
    groups[groups.length] = placeGroup;
    groups[groups.length] = richClubGroup;
};


getRegionNameByIndex = function(index){

    var labelKey = labelKeys[index];
    var name;
    for(var i = 0, found = false; i < lookUpTable.length && !found; i++){
        if(lookUpTable[i].label == labelKey){
            found = true;
            name = lookUpTable[i].region_name;
        }
    }

    return name;
}





