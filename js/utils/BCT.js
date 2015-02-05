/**
 * Created by giorgioconte on 05/02/15.
 */


var computeNodalStrength = function (connectionRow) {
    return d3.mean(connectionRow);
};