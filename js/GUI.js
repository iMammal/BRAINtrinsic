/**
 * Created by giorgioconte on 31/01/15.
 */

initGUI = function() {
    var uploadMenu = d3.select("#upload");

    uploadMenu.append("button")
        .text("Upload Centroids")
        .attr("id", "centroidUploadBtn")
        .append("input")
        .attr("type", "file")
        .attr("id", "file-name")
        .on("change", function () {
            var f = document.getElementById("file-name");
            if (f.files && f.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    console.log("On load event");
                    console.log(e);
                    v = e.target.result;
                    Papa.parse(v, {
                            download: true,
                            delimiter: " ",
                            dynamicTyping: true,
                            header: true,
                            complete: function (results) {
                                positions = results;
                                console.log("complete uploading");
                                setCentroids(results);
                                updateScene();
                            }
                        }
                    );
                };
                reader.readAsDataURL(f.files[0]);
            }
        });


    uploadMenu.append("button")
        .text("Upload labelKey")
        .attr("id", "labelKeyUploadBtn")
        .append("input")
        .attr("type", "file")
        .on("change", function () {
            var f = document.getElementById("file-name");
            if (f.files && f.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    console.log("On load event");
                    console.log(e);
                    var v = e.target.result;
                    Papa.parse(v, {
                            download: true,
                            delimiter: " ",
                            dynamicTyping: true,
                            header: true,
                            complete: function (results) {
                                console.log("complete Uploading Label Keys ");
                            }
                        }
                    );
                };
                reader.readAsDataURL(f.files[0]);
            }
        });

    uploadMenu.append("button")
        .text("Upload Groups")
        .attr("id", "groupUploadButton");

    uploadMenu.append("button")
        .text("Start Visualization")
        .attr("id", "startVisualization")
        .on("click", function() {
            initCanvas();
        })


}


var createLegend = function () {

    //var scaleColorGroup = d3.scale.category20();
    var legendMenu = d3.select("#legend");
    var activeGroup = getActiveGroup();
    var l = activeGroup.length;
    document.getElementById("legend").style.height = 25*l+"px";
    for(var i=0; i < l; i++){
        var elementGroup = legendMenu.append("g").attr("transform","translate(10,"+i*25+")");
        elementGroup.append("circle")
            .attr("cx",5)
            .attr("cy",10)
            .attr("fill",scaleColorGroup(activeGroup[i]))
            .attr("r",8);
        elementGroup.append("text")
            .text(activeGroup[i])
            .attr("font-family","'Open Sans',sans-serif")
            .attr("font-size","15px")
            .attr("x",20)
            .attr("y",10)
            .attr("text-anchor","left")
            .attr("dy",5)
            .attr("fill","rgb(191, 191, 191)");
    }
};