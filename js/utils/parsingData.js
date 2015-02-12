/**
 * Created by giorgioconte on 31/01/15.
 */


var loadCentroids = function (callback) {

    Papa.parse("data/xyz.csv", {
        download: true,
        delimiter: ",",
        dynamicTyping: true,
        complete: function (results) {
            setCentroids(results);
            callback(null, null);
        }
    });

};

var loadLookUpTable = function (callback) {
    Papa.parse("data/LookupTable.csv", {
        download: true,
        delimiter: ";",
        dynamicTyping: true,
        header: true,
        complete: function (results) {
            setLookUpTable(results);
            callback(null, null);
        }
    });

};

var loadLabelKeys = function (callback) {
    Papa.parse("data/labelKey.csv", {
        download: true,
        dynamicTyping: true,
        complete: function (results) {
            setLabelKeys(results);
            callback(null, null);
        }
    });
};

var loadConnections = function(callback){
    Papa.parse("data/NW.csv",{
        download: true,
        dynamicTyping: true,
        delimiter: ',',
        header: false,
        complete: function(results){
            setConnectionMatrix(results);
            computeDistanceMatrix();
            callback(null,null);
        }
    })
};


var loadColorMap = function(callback){
    Papa.parse("data/colorMap.csv", {
        download: true,
        delimiter: ',',
        dynamicTyping: true,
        header: false,
        complete: function(results){
            setGroup(results);
            callback(null,null);
        }
    })
}