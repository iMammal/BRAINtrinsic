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
    centroids = d.data;
}


setLookUpTable = function (d) {
    lookUpTable = d.data;
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
        result[result.length] = labelKeys[i].labelKey;
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
}

