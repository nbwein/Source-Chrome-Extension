/* Changing Background Script */
var imgURLS = ["http://www.hdwallpapers.in/walls/windows_10_landscape-multi16.5.jpg", "http://www.hdwallpapers.in/walls/milky_way_lake-wide.jpg", "http://www.hdwallpapersinn.com/wp-content/uploads/2015/02/City-Landscape-Wallpaper-Eving-Time-Photo.jpg", "http://www.hdwallpapersinn.com/wp-content/uploads/2015/02/City-Landscape-Wallpapers.jpg", "http://www.hdwallpapers.in/walls/seljalandsfoss_waterfall-wide.jpg", "http://www.hdwallpapers.in/walls/stairway_to_heaven-wide.jpg", "http://www.hdwallpapers.in/walls/city_nightways-wide.jpg", "http://www.hdwallpapers.in/walls/horseshoe_bend_arizona-wide.jpg", "http://www.hdwallpapers.in/walls/hirosaki_castle_japan-wide.jpg" ];
var size = imgURLS.length;
var stellaURLS = [];
var stellsize = stellaURLS.length;
$(document).on("ready", function(){
var settings = $("#settings");
var dropDown = document.getElementById("settings-drop-down");
settings.on("click", function(){
//      dropDown.setAttribute("style", "display:block;");
        $("#solid").on("click", function(){
                setSolidBackground("#00ffff");
        });
        $("#random").on("click", setRandomPicBackground);
        $("#stella-life").on("click", stellaLifeBackground);
});
//dropDown.setAttribute("style", "display:none;");

});


function setSolidBackground(color){
        var background = document.getElementById("main");
        background.setAttribute("style", "background-color:" + color);
}

function setRandomPicBackground(){
        var idx = Math.floor(Math.random() * size);
        var img = imgURLS[idx]
        var background = document.getElementById("main");
        console.log(img);
        background.setAttribute("style", "background-image:url(\"" + img + "\");");
}

function stellaLifeBackground(){
        var idx = Math.floor(Math.random() * stellasizesize);
        var img = stellaURLS[idx]
        var background = document.getElementById("main");
        console.log(img);
        background.setAttribute("style", "background-image:url(\"" + img + "\");");
}
