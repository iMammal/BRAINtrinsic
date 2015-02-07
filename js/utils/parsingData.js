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
            //labelKeys = results;
            setLabelKeys(results);
            callback(null, null);
        }
    });
};

var loadConnections = function(callback){
    Papa.parse("data/avgNW.csv",{
        download: true,
        dynamicTyping: true,
        header: false,
        complete: function(results){
            setConnectionMatrix(results);
            callback(null,null);
        }
    })
};