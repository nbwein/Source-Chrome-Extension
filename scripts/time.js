function get_date_time() { 
	var date = new Date();
	var time = date.getHours() + ":" + date.getMinutes();
	document.getElementById("current_time").innerHTML = time;
}