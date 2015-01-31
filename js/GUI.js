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
                                updateRendering();
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


}