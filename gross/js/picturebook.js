//-*- coding: utf-8 -*-
// Copyright (c) 2012 by Oliver Lau <ola@ct.de>, Heise Zeitschriften Verlag
// Alle Rechte vorbehalten.
// $Id$


var PictureBook = (function() {

    var filenames = [];
    var defaults = {
        picture: {
            path: "../pictures",
            width: 754,
            height: 480,
            rotation: 270 // 0 | 90 | 180 | 270 
        }
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
        var scale = (100/parseFloat($("#scale-slider").val()));
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
                         " -webkit-transform-origin: center center;\n" +
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
                         "  -webkit-transform:\n" +
                         "    rotateZ(" + (-parseFloat($("#rotate-z-slider").val())) + "deg)\n" +
                         "    translateX(-50%)\n" +
                         "    scale(" + scale + ")\n" +
                         "    translateY(" + (scale * 10) + "%)\n" +
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


    function loadNPictures(N) {
        var src = filenames.slice(0, N),
        n = src.length,
        d = 360 / n,
        radius = ((settings.picture.rotation % 180 == 0)
                  ? settings.picture.width
                  : settings.picture.height) / 2 / Math.tan(Math.PI / n) + 10,
        i, deg;
        for (i = 0; i < N; ++i) {
            deg = d * i;
            $("#picture-data")
                .append("#picture-" + i + " {\n" +
                        "-webkit-transform-origin: center center;\n" +
                        "-webkit-transform: " +
                        " translateX(-50%)" +
                        " rotateY(" + deg + "deg)" +
                        " translateZ(" + radius + "px)" +
                        " rotateZ(" + settings.picture.rotation + "deg)" +
                        ";\n" +
                        "}\n");
            $("#picturebook-container")
                .append("<div class=\"picture\" title=\"Bild #" + i + "\" " +
                        "style=\"background-image: url(" + settings.picture.path + "/" + filenames[i] + ");\"" +
                        "id=\"picture-" + i + "\"></div>")
                .addClass("large");
            $("#picture-" + i)
                .bind("click", i, function(e) { showPicture(e.data); });
        };
    }


    function loadPictures(n) {
        loadNPictures((typeof n === "undefined")? filenames.length : n);
    }


    function getPictureFilenames() {
        $.ajax("../getpictures.php", { async: true })
            .done(function(data) {
                filenames = JSON.parse(data);
                loadPictures(18);
                $("body").addClass("loaded");
            });
    }


    function transformOuterContainer() {
        $("#outer-container")
            .css("-webkit-transform",
                 "translateZ(" + $("#distance-slider").val() + "px)" +
                         "rotateZ(" + $("#rotate-z-slider").val() + "deg)" +
                 "scale(" + (parseInt($("#scale-slider").val())/100) + ")"
                );
    }
    

    return {
        init: function() {
            getPictureFilenames();
            $("#start-stop-button").click(toggleAnimation);
            $("#perspective-slider").bind({
                change: function(e) {
                    $("#outer-container").css("-webkit-perspective", $("#perspective-slider").val() + "px");
                }
            });
            $("#perspective-slider").trigger("change");

            $("#rotate-z-slider").bind({
                change: transformOuterContainer
            });
            $("#rotate-z-slider").trigger("change");

            $("#scale-slider").bind({
                change: transformOuterContainer
            });
            $("#scale-slider").trigger("change");
            
            $("#distance-slider").bind({
                change: transformOuterContainer
            });
            $("#distance-slider").trigger("change");
        }
    }


})();