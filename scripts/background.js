/* Changing Background Script */
var imgURLS = ["http://www.hdwallpapers.in/walls/windows_10_landscape-multi16.5.jpg", "http://www.hdwallpapers.in/walls/milky_way_lake-wide.jpg", "http://www.hdwallpapersinn.com/wp-content/uploads/2015/02/City-Landscape-Wallpaper-Eving-Time-Photo.jpg", "http://www.hdwallpapers.in/walls/stairway_to_heaven-wide.jpg", "http://www.hdwallpapers.in/walls/horseshoe_bend_arizona-wide.jpg", "http://www.hdwallpapers.in/walls/hirosaki_castle_japan-wide.jpg", "http://www.hdwallpapers.in/walls/aurlandsfjord_norway-multi16.5.jpg", "http://www.hdwallpapers.in/walls/path_green_fields-wide.jpg", "http://www.hdwallpapers.in/walls/countryside_fisherman-wide.jpg", "http://www.hdwallpapers.in/walls/port_sunset-wide.jpg", "http://www.hdwallpapers.in/walls/wooden_path-wide.jpg", "http://www.hdwallpapers.in/walls/stockholm_reflections-wide.jpg", "http://www.hdwallpapers.in/walls/shanghai_sunset-wide.jpg", "http://www.hdwallpapers.net/previews/colorful-spiral-783.jpg", "http://www.hdwallpapers.in/walls/new_york_city_colors-wide.jpg", "http://www.hdwallpapers.in/walls/bisti_badlands_new_mexico-wide.jpg", "http://www.hdwallpapers.in/walls/machu_picchu-wide.jpg", "http://www.hdwallpapers.in/walls/glen_canyon_utah-wide.jpg", "http://www.hdwallpapers.in/walls/beauty_of_venice-wide.jpg", "http://www.hdwallpapers.in/walls/great_wall_beijing_china-normal.jpg", "http://www.hdwallpapers.in/walls/manarola_italy-normal.jpg", "http://www.hdwallpapers.in/walls/val_di_funes_dolomites_italy-normal.jpg", "http://www.hdwallpapers.in/walls/consuegra_la_mancha_spain-normal.jpg", "http://www.hdwallpapers.in/walls/valley_house-wide.jpg", "http://www.hdwallpapers.in/walls/green_seascape-wide.jpg", "http://www.hdwallpapers.in/walls/vernal_fall_yosemite_national_park-wide.jpg", "http://www.hdwallpapers.in/walls/sunny_fields-wide.jpg", "http://www.hdwallpapers.in/walls/fall_foliage-wide.jpg", "http://www.hdwallpapers.in/walls/village_corsica_france-normal.jpg", "http://www.hdwallpapers.in/walls/red_village-wide.jpg", "http://www.hdwallpapers.in/walls/noord_holland_province_the_netherlands-normal.jpg" ];
var size = imgURLS.length;
var colors = ["#6080bb"];
var colorsize = colors.length;
var stellasize = 8;
$(document).on("ready", function(){
var settings = document.getElementById("settings");
var dropDown = document.getElementById("settings-drop-down");
$("#settings").on("click", function(){
	if ($("#settings-drop-down").is(":visible")){
	dropDown.setAttribute("style", "display:none;");
	document.getElementById("date-time").setAttribute("style", "display:block");
	document.getElementById("settings").className = "settings fa fa-cog";
	}
	else{
        dropDown.setAttribute("style", "display:block;");
	var current = localStorage.getItem("background");
	if (current == "stella"){
		document.getElementById("stella-life").setAttribute("selected", "selected");
	}
	else if (current == "solid"){
		document.getElementById("solid").setAttribute("selected", "selected");
	}
	document.getElementById("date-time").setAttribute("style", "display:none");
	document.getElementById("settings").className = "settings-done fa fa-check-circle";

	}
	});


        $("#settings-drop-down").change(function(){
                if ($("#settings-drop-down").val() == "Solid Background"){
			localStorage.setItem("background", "solid");
                        setSolidBackground();
                 }
                else if ($("#settings-drop-down").val() == "Random Landscape"){
                        setRandomPicBackground();
			localStorage.setItem("background", "landscape");
                }
                else if ($("#settings-drop-down").val() == "Stella Life Background"){
                        stellaLifeBackground();
			localStorage.setItem("background", "stella");
                }
        });

	// $("#coffee-button").on("click", function(){
	// 	if ($("#coffee").is(":visible")){
	// 		$("coffee").css("display":"none");
	// 		$(".coffee-button").class = "fa fa-coffee";	
	// 	}	
	// 	else{
	// 		$("cofee").css("display": "block");
	// 		$(
	// 	}
	// });

// TODO: refactor all these click events, they are all basically the same
	$("#lunch-collapse").on("click", function(){
		if (!lunchHidden){
			$("#lunch").css("visibility", "hidden");
			$("#lunch-collapse").css("visibility", "visible");
			$("#lunch-header").css("visibility", "visible");
			document.getElementById("lunch-collapse").className = "collapse fa fa-plus-circle fa-lg";
			lunchHidden = true;
			
		}
		else{
			$("#lunch").css("visibility", "");
                        document.getElementById("lunch-collapse").className = "collapse fa fa-minus-circle fa-lg";
			lunchHidden = false;

		}
		localStorage.setItem('lunchHidden',lunchHidden);
	});     

	 $("#submit-collapse").on("click", function(){
                if (!submitHidden){
                        $("#submissions").css("visibility", "hidden");
                        $("#submit-collapse").css("visibility", "visible");
			$("#submissions-text").css("visibility", "visible");
                        document.getElementById("submit-collapse").className = "collapse fa fa-plus-circle fa-lg";
                        submitHidden = true;

                }
                else{
                        $("#submissions").css("visibility", "");
                        document.getElementById("submit-collapse").className = "collapse fa fa-minus-circle fa-lg";
                        submitHidden = false;

                }
		localStorage.setItem('submitHidden',submitHidden);
        });
	
	$("#message-collapse").on("click", function(){
                if (!messageHidden){
                        $("#message-board").css("visibility", "hidden");
                        $("#message-collapse").css("visibility", "visible");
			$("#message-header-text").css("visibility", "visible");
                        document.getElementById("message-collapse").className = "collapse fa fa-plus-circle fa-lg";
                        messageHidden = true;

                }
                else{
                        $("#message-board").css("visibility", "");
                        document.getElementById("message-collapse").className = "collapse fa fa-minus-circle fa-lg";
                        messageHidden = false;

                }
		localStorage.setItem('messageHidden',messageHidden);
        });

        $("#bday-collapse").on("click", function(){
                if (!bdayHidden){
                        $("#bdays-annivs").css("visibility", "hidden");
                        $("#bday-collapse").css("visibility", "visible");
                        $("#bdays-text").css("visibility", "visible");
                        document.getElementById("bday-collapse").className = "collapse fa fa-plus-circle fa-lg";
                        bdayHidden = true;

                }
                else{
                        $("#bdays-annivs").css("visibility", "");
                        document.getElementById("bday-collapse").className = "collapse fa fa-minus-circle fa-lg";
                        bdayHidden = false;

                }
		localStorage.setItem('bdayHidden',bdayHidden);
        });

        $("#jobs-collapse").on("click", function(){
                if (!jobsHidden){
                        $("#jobs").css("visibility", "hidden");
                        $("#jobs-collapse").css("visibility", "visible");
                        $("#jobs-text").css("visibility", "visible");
                        document.getElementById("jobs-collapse").className = "collapse fa fa-plus-circle fa-lg";
                        jobsHidden = true;

                }
                else{
                        $("#jobs").css("visibility", "");
                        document.getElementById("jobs-collapse").className = "collapse fa fa-minus-circle fa-lg";
                        jobsHidden = false;

                }
		localStorage.setItem('jobsHidden',jobsHidden);
        });

var today = new Date();
today.setHours(0,0,0,0);
//localStorage.clear();
//RESET TO SHOW ALL DIVS WHEN DAY CHANGES. otherwise, get values from storage.
if (localStorage.getItem('setupTime') == null || localStorage.getItem('setupTime') < today.getTime()){
	localStorage.setItem('setupTime', today.getTime());
        localStorage.setItem('lunchHidden', false);
        localStorage.setItem('submitHidden', false);
        localStorage.setItem('messageHidden', false);
        localStorage.setItem('bdayHidden', false);
        localStorage.setItem('jobsHidden', false);
}
else {
        var lunchHidden = !JSON.parse(localStorage.getItem('lunchHidden'));
        $("#lunch-collapse").trigger("click");
        var submitHidden = !JSON.parse(localStorage.getItem('submitHidden'));
        document.getElementById("submit-collapse").click();
        var messageHidden = !JSON.parse(localStorage.getItem('messageHidden'));
        document.getElementById("message-collapse").click();
        var bdayHidden = !JSON.parse(localStorage.getItem('bdayHidden'));
        document.getElementById("bday-collapse").click();
        var jobsHidden = !JSON.parse(localStorage.getItem('jobsHidden'));
        document.getElementById("jobs-collapse").click();
}


});

function setSolidBackground(){
	var idx = Math.floor(Math.random() * colorsize);
        var color = colors[idx]
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
        var idx = Math.floor(Math.random() * stellasize);
        var img = "/scripts/stella-backgrounds/" + idx + ".jpg"
        var background = document.getElementById("main");
        console.log(img);
        background.setAttribute("style", "background-image:url(\"" +  img + "\");");
}

function setBackground(){
	var type = localStorage.getItem("background");
	if (type == "solid"){
		setSolidBackground();	
	}
	else if (type == "stella"){
		stellaLifeBackground();
	}
	//type is either landscape or Null
	else{
		setRandomPicBackground();		
	}
}
