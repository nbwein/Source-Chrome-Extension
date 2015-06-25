function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getWeather);
    } else { 
        document.getElementById("weather").innerHTML = "Geolocation is not supported by this browser.";
    }
}

function getWeather(position) {
  var lat = position.coords.latitude;
  var lon = position.coords.longitude;
  var url = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon;
  console.log(url);
  var jsonObj;
  var icon;
  var http_request = new XMLHttpRequest();
  http_request.onreadystatechange = function(){

      if (http_request.readyState == 4)
      {
        jsonObj = JSON.parse(http_request.responseText);

        var img = document.createElement("img");
        img.src = "http://openweathermap.org/img/w/" + jsonObj.weather[0].icon + ".png";
        img.setAttribute("id", "weatherIcon");
        document.getElementById("weather-icon-div").appendChild(img);

        var fahrenheit = Math.round((parseInt(jsonObj.main.temp) * 1.8) - 459.67);
        document.getElementById("weather").innerHTML = fahrenheit + "&deg, " + jsonObj.weather[0].main;
      }
   }
   http_request.open("GET", url, true);
   http_request.send();
}

getLocation();