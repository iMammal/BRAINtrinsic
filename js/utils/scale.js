/**
 * Created by giorgioconte on 02/02/15.
 */

var connectionMatrixScale;

scaleColorGroup = d3.scale.category20c();



getConnectionMatrixScale = function () {
    var connectionMatrix = getConnectionMatrix();
    var allCells = [];
    if(!connectionMatrixScale){
        //This code is optimized for symmetric matrices
        var rows = connectionMatrix.length;
        for(var i=0; i < rows; i++){
            for(var j = 0; j<i; j++){
                allCells[allCells.length] = connectionMatrix[i][j];
            }
        }
        connectionMatrixScale = d3.scale.pow().domain(
            [
                d3.min(allCells, function(element){
                    return element;
                })
                ,
                d3.max(allCells, function(element){
                    return element;
                })
            ]
        ).range(colorbrewer.Greys[6]);

    }

    return connectionMatrixScale;

};
