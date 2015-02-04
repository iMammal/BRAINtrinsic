/**
 * Created by giorgioconte on 31/01/15.
 */

/*
queue()
    .defer(loadCentroids)
    .defer(loadLabelKeys)
    .defer(loadLookUpTable)
    .defer(loadConnections)
    .awaitAll( function() {
        init();
    });*/




init = function () {
    initGUI();
    //initCanvas();
};

$( document ).ready(function() {
    init();
});