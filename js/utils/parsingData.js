/**
 * Created by giorgioconte on 31/01/15.
 */


var loadCentroids = function (callback) {

    Papa.parse("data/xyz.csv", {
        download: true,
        delimiter: ",",
        dynamicTyping: true,
        header: true,
        complete: function (results) {
            positions = results;
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
            lookUpTable = results;
            callback(null, null);
        }
    });

};

var loadLabelKeys = function (callback) {
    Papa.parse("data/labelKey.csv", {
        download: true,
        dynamicTyping: true,
        header: true,
        complete: function (results) {
            //labelKeys = results;
            setLabelKeys(results);
            callback(null, null);
        }
    });
};