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
        .attr("id", "centroids")
        .on("change", function () {
            var f = document.getElementById("centroids");
            if (f.files && f.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    var v = e.target.result;
                    Papa.parse(v, {
                            download: true,
                            delimiter: ",",
                            dynamicTyping: true,
                            complete: function (results) {
                                god = results;
                                console.log("complete uploading centroids");
                                setCentroids(results);
                                //updateScene();
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
        .attr("id","labelKey")
        .on("change", function () {
            var f = document.getElementById("labelKey");
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
                                setLabelKeys(results);
                            }
                        }
                    );
                };
                reader.readAsDataURL(f.files[0]);
            }
        });

    uploadMenu.append("button")
        .text("Upload LookUpTable")
        .attr("id", "groupUploadButton")
        .append("input")
        .attr("type","file")
        .attr("id","lookUpTable")
        .on("change", function(){
            console.log("on Change Event look up table");

            var f = document.getElementById("lookUpTable");

            if(f.files && f.files[0]){
                var reader = new FileReader();
                reader.onload = function(e){
                    console.log("On load event LookUpTable");
                    console.log(e);
                    console.log()
                    v = e.target.result;

                    console.log("Parsing LookUpTable");
                    Papa.parse(v, {
                        download: true,
                        delimiter: ";",
                        dynamicTyping: true,
                        header: true,
                        complete: function(results){
                            setLookUpTable(results);
                            console.log("look Up Table Uploaded");
                        }
                    })

                }
                reader.readAsDataURL(f.files[0]);
            }
        });

    uploadMenu.append("button")
        .text("Upload Connections")
        .attr("id","uploadConnectionsButton")
        .append("input")
        .attr("type","file")
        .attr("id","connections")
        .on("click", function() {
            var f = document.getElementById("connections");
            if (f.files && f.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    var v = e.target.result;
                    Papa.parse(v, {
                        download: true,
                        dynamicTyping: true,
                        header: false,
                        complete: function (results) {
                            setConnectionMatrix(results);
                            console.log("Connection Matrix uploaded");
                        }
                    })
                }
                reader.readAsDataURL(f.files[0]);
            }
        });

    uploadMenu.append("button")
        .text("Start Visualization")
        .attr("id", "startVisualization")
        .on("click", function() {
            if(lookUpTable && labelKeys && centroids && connectionMatrix){
                initCanvas();
            } else
            {
                console.log("data are missing");
            }

        })


};

/*
 * This method removes the start button so that is not possible to create more than one scene and
 * renderer.
 */
removeStartButton = function(){
    var elem = document.getElementById('startVisualization');
    elem.parentNode.removeChild(elem);
};

setNodeInfoPanel = function (regionName, index){
    var panel = document.getElementById('nodeInfoPanel');

    while (panel.firstChild) {
        panel.removeChild(panel.firstChild);
    }

    var connectionRow = getConnectionMatrixRow(index);

    var nodalStrength = computeNodalStrength(connectionRow);


    var para = document.createElement("p");
    var node = document.createTextNode(regionName + " " + nodalStrength);
    panel.appendChild(para)
        .appendChild(node);

};




/*
 * This method is used to create the legend panel.
 */
var createLegend = function () {

    //var scaleColorGroup = d3.scale.category20();
    var legendMenu = d3.select("#legend");
    var activeGroup = getActiveGroup();
    var l = activeGroup.length;
    document.getElementById("legend").style.height = 25*l+"px";
    for(var i=0; i < l; i++){
        var elementGroup = legendMenu.append("g")
            .attr("transform","translate(10,"+i*25+")")
            .attr("id",activeGroup[i])
            .on("click", function(){
                console.log(this);
                toggleRegion(this.id);
            });
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