/**
 * Created by giorgioconte on 31/01/15.
 */
/*
private variables
 */

var spheres;
var groups;
var labelKeys;
var brainData;




/*
PUBLIC METHODS
 */

/*
Getter and setters
 */

/**
 * Label Keys setter
 */

setLabelKeys = function(labels){
    labelKeys = labels.data;
};

/**
 * Label keys getter.
 * @returns an array of label keys
 */

 function getLabelKeys(){
    l = labelKeys.length;
    result = [];
    //Cloning the array

    for(var i =0; i < l; i++){
        result[result.length] = labelKeys[i].labelKey;
    }

    return result;
};
