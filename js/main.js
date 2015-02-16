/**
 * Created by giorgioconte on 31/01/15.
 */


queue()
    .defer(loadCentroids)
    .defer(loadLabelKeys)
    .defer(loadLookUpTable)
    .defer(loadConnections)
    //.defer(loadColorMap)
    .awaitAll( function() {
        init();
    });


init = function () {
    $(window).resize(function(e){
        e.preventDefault();
        console.log("on resize event");
        resizeScene();
    });
    createGroups();
    initGUI();
    initCanvas();
};

/*
 queue()
 .defer(loadLookUpTable)
 .awaitAll(function(){
 init();
 });


init = function () {
    initGUI();
};*/







/*
 $( document ).ready(function() {
 init();
 });*/