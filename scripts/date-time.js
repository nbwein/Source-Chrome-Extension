function formatDate(date_str){
	var elements = date_str.split("/");	
	var result = "";
	switch(parseInt(elements[0])) {
		case 1:
			result = "January";
			break;
		case 2:
                        result = "February";
			break;
		case 3:
                        result = "March";
			break;
		case 4: 
			result = "April";
			break;
		case 5:
			result = "May";
			break;
		case 6:
			result = "June";
			break;
		case 7:
			result = "July";
			break;
		case 8:
                        result = "August";
			break;
		case 9:
                        result = "September";
			break;
		case 10:
                        result = "October";
			break;
		case 11:
                        result = "November";
			break;
		case 12:
                        result = "December";
			break;
	}
	result = result + " " + elements[1];
	return result;
}	
function formatTime(time_str){
	var elements = time_str.split(" ");
	var time = elements[1].split(":");
	var result = time[0] + ":" + time[1] + " " + elements[2];
	return result
}

function showTime(){
	var date = new Date();
        date = date.toLocaleString();
        var elements = date.split(",");
        var time = elements[1];
        var date = elements[0];
	document.getElementById("time").innerHTML = formatTime(time);
	document.getElementById("date").innerHTML = formatDate(date);
	t = setTimeout(showTime, 1000);
}


