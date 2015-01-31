/**
 * Created by giorgioconte on 31/01/15.
 */


queue()
    .defer(loadCentroids)
    .defer(loadLabelKeys)
    .defer(loadLookUpTable)
    .awaitAll( function() {
        init();
    });



init = function () {
    initGUI();
    initCanvas();
}