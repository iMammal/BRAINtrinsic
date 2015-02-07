/**
 * Created by giorgioconte on 31/01/15.
 */
/*
private variables
 */

var spheres;
var groups = [];
var labelKeys;
var brainData;
var centroids;
var lookUpTable;
var activeGroup;
var connectionMatrix;
var regionsActivated = [];




/*
PUBLIC METHODS
 */

/*
Setters
 */

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
        element.x = data[0][0];
        element.y = data[0][1];
        element.z = data[0][2];
        centroids[centroids.length] = element;
    }
};


setLookUpTable = function (d) {
    lookUpTable = d.data;
}


setConnectionMatrix = function(d){
    connectionMatrix = d.data;
}

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
        var label = labelKeys[i].labelKey;
        var lengthLookUpTable= lookUpTable.length;
        var index;
        //Looking for the right element in the lookup table

        for(var j = 0,found = 0; j < lengthLookUpTable && found == 0; j++){

            if(lookUpTable[j].label === label){
                found == 1;
                index = j;
            }
        }
        row.group = lookUpTable[index].group;
        row.name = lookUpTable[index].region_name;

        result[result.length] = row;

        var groupIndex = group.indexOf(row.group);

        if(groupIndex == -1){
            group [group.length] = row.group;
        }
    }

    groups[groups.length] = group;

    activeGroup = group;


    return result;
};


getActiveGroup = function () {
    var l = activeGroup.length;
    var result = [];

    for(var i=0; i < l; i++){
        result[result.length] = activeGroup[i];
    }
    return result;
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
    return connectionMatrix[index];
};


toggleRegion = function (regionName){
    if(regionsActivated[regionName]){
        regionsActivated[regionName] = false;
    } else {
        regionsActivated[regionName] = true;
    }
    console.log(regionsActivated);
    console.log("toggled region");
    updateScene();
};

setRegionsActivated = function (){
    var l = activeGroup.length;
    for(var i =0; i < l; i++){
        regionsActivated[activeGroup[i]] = true;
    }
}

