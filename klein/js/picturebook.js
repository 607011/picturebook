//-*- coding: utf-8 -*-
// Copyright (c) 2012 by Oliver Lau <ola@ct.de>, Heise Zeitschriften Verlag
// Alle Rechte vorbehalten.
// $Id$


var PictureBook = (function() {

    var filenames = [];
    var picsVisible = undefined;
    var defaults = {
        picturepath: "../pictures"
    };
    var settings = defaults;


    function pauseAnimation() {
        $("#start-stop-button").text("Start");
        $("#picturebook-container").css("webkit-animation-play-state", "paused");
    }


    function startAnimation() {
        $("#start-stop-button").text("Stop");
        $("#picturebook-container").css("webkit-animation-play-state", "running");
    }


    function toggleAnimation() {
        if ($("#start-stop-button").text() == "Start")
            startAnimation();
        else
            pauseAnimation();
    }


    function showPicture(picNum) {
        pauseAnimation();
        $("#presentation-container").empty();
        $("#picture-presentation-data")
            .replaceWith("<style id=\"picture-presentation-data\" type=\"text/css\">\n" +
                         "#presented {\n" +
                         " -webkit-animation-name: presenter;\n" +
                         " -webkit-animation-timing-function: ease-in-out;\n" +
                         " -webkit-animation-iteration-count: 1;\n" +
                         " -webkit-animation-duration: 1s;\n" +
                         " -webkit-animation-fill-mode: forwards;\n" +
                         " -webkit-transform-style: preserve-3d;\n" +
                         "}\n" +
                         "@-webkit-keyframes presenter {\n" +
                         "from {\n" +
                         "  opacity: 0.65;\n" +
                         "  box-shadow: inset 0 0 25px rgba(0, 0, 0, 0.5);\n" +
                         "  -webkit-transform: " +
                         $("#picturebook-container").css("-webkit-transform") +
                         $("#picture-" + picNum).css("-webkit-transform") +
                         "  ;\n" +
                         " }\n" +
                         "to {\n" +
                         "  opacity: 1;\n" +
                         "  border-radius: 7px;\n" +
                         "  box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.5), 0 0 10px Black;\n" +
                         "  -webkit-transform: rotateY(0deg) scale(1.35) translateX(-50%)" +
                         "  ;\n" +
                         " }\n" +
                         "}\n" +
                         "</style>");
        $("#presentation-container")
            .append($("#picture-" + picNum).clone(true).attr("id", "presented").addClass("picture"));
        $("#presented")
            .click(function(e) {
                $("#presentation-container").empty();
                e.preventDefault();
                e.stopPropagation();
                startAnimation();
                return false;
            });
    }


    function insertPicContainer(picNum) {
        $("#picturebook-container")
            .append("<div class=\"picture\" title=\"Bild #" + picNum + "\" " +
                    "style=\"background-image: url(" + settings.picturepath + "/" + filenames[picNum] + ");\"" +
                    "id=\"picture-" + picNum + "\"></div>");
        $("#picture-" + picNum)
            .bind("click", picNum, function(e) { showPicture(e.data); });
    }


    function loadNPictures(N) {
        var i, src = filenames.slice(0, N), front, back;
        N = src.length;
        picsVisible = N - N % 2;
        for (i = 0; i < picsVisible; i += 2) {
            $("#picture-data")
                .append("#picture-" + i + " {\n" +
                        "-webkit-transform: " +
                        " rotateY(" + (360 / picsVisible * i) + "deg)" +
                        " translateX(4px)" +
                        ";\n" +
                        "}\n")
                .append("#picture-" + (i+1) + " {\n" +
                        "-webkit-transform: " +
                        " rotateY(" + (180 + 360 / picsVisible * i) + "deg)" +
                        " translateX(-100%)" +
                        " translateX(-4px)" +
                        " translateZ(+1px)" +
                        ";\n" +
                        "}\n");
            insertPicContainer(i);
            insertPicContainer(i+1);
        };
    }


    function getPictureFilenames() {
        $.ajax("../getpictures.php", { async: true })
            .done(function(data) {
                filenames = JSON.parse(data);
                loadNPictures(18);
                $("body").addClass("loaded");
            });
    }


    return {
        init: function() {
            getPictureFilenames();
            $("#start-stop-button").click(toggleAnimation);
            $("#perspective-slider").bind({
                change: function(e) {
                    $("#outer-container").css("-webkit-perspective", e.srcElement.value + "px");
                }
            });
        }
    }


})();