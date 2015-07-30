/* Birthdays and Anniversaries */
	
var party_popper = "<img src=\"http://cdn.shopify.com/s/files/1/0185/5092/products/objects-0017_medium.png?v=1369543805\" height=15px width=15px/>";
var calendar_emoji = "<img src=\"http://worldemojiday.com/wp-content/uploads/2014/07/17-july.png\" height=15px width=15px/>";
function getBDayCalendar() {
                var week = new Date((new Date().getTime() + 7*24*60*60*1000));
                week.setHours(0,0,0,0);
		var today = new Date();
		today.setHours(0,0,0,0);
                var request = gapi.client.calendar.events.list({
                        'calendarId': 'stellaservice.com_8scj4nlafijk1llee3anm383dk@group.calendar.google.com',
                        'timeMin': today.toISOString(),
                        'showDeleted': false,
                        'singleEvents': true,
                        'maxResults': 5,
                        'timeMax' : week.toISOString(),
                        'orderBy': 'startTime'
                });
                return request;
        }

function getEventsCalendar() {
		var week = new Date((new Date().getTime() + 7*24*60*60*1000));
                week.setHours(0,0,0,0);
                var today = new Date();
                today.setHours(0,0,0,0);
                var request = gapi.client.calendar.events.list({
                        'calendarId': 'stellaservice.com_abt6mg0nmf0bntgtrgbn16bl3s@group.calendar.google.com',
                        'timeMin': today.toISOString(),
                        'showDeleted': false,
                        'singleEvents': true,
                        'maxResults': 5,
                        'timeMax' : week.toISOString(),
                        'orderBy': 'startTime'
                });
		return request;
}

/* True if event1 starts before event2, false if start time greater than or equal
PRECONDITION: event1 must be from the birthday calendar, event 2 must be from the events calendar. Required because they use different date formats.*/
function lessThan(event1, event2){
	if (typeof(event1) == 'undefined'){
                return false;
        }
	else if(typeof(event2) == 'undefined'){
		return true;
	}
	var t1 = event1.start.date;
	t1 = t1.split("-");
	t1 = new Date(t1[0], t1[1], t1[2]);
	t1 = t1.getTime();
	var t2 = event2.start.dateTime;
	t2 = t2.split("T");
	t2 = t2[0].split("-");
	t2 = new Date(t2[0], t2[1], t2[2]);
	t2 = t2.getTime();
	return (t1 < t2);
}

function mergeSort(bdayList, eventList){
	var events = [];
	console.log(bdayList);
	console.log(eventList);
        while (bdayList.length != 0 || eventList.length != 0){
		if (lessThan((bdayList[0]), (eventList[0]))){
			events.push(bdayList.shift());
		}
		else{
			events.push(eventList.shift());	
		}
	}
	console.log(events); 
	return events;
}

function getSpecialEvents(){
	var request = getBDayCalendar();
	request.execute(function(resp){
		console.log(resp);
		var bdays = resp.items;
		var events_request = getEventsCalendar();
		events_request.execute(function(event_resp){
		var special_events = event_resp.items;
		var events = mergeSort(bdays, special_events);
		var bday_list = "";
		var today = new Date();
		today.setHours(0,0,0,0);
		var curr_date = new Date(0);
		for (var i = 0; i < events.length; i++){
			try {
				var date_parse = events[i].start.date.split("-");
			}
			catch(e){
				var date_parse = events[i].start.dateTime.split("T")[0].split("-");
			}
			var date = (new Date(date_parse[0] , (date_parse[1]-1), date_parse[2]));
			if (date.getTime() != curr_date.getTime()){
				if (date.setHours(0,0,0,0) == today.getTime()){
					bday_list = bday_list + "Today: </br>"
					curr_date = date;
				}
				else{
					if (bday_list != ""){
						bday_list += "</br>";
					}
					var disp_date = date.toString().split(/\d{4}/);
					bday_list = bday_list + disp_date[0] + ": </br>";
					curr_date = date;
				}
			}
			if (events[i].summary.indexOf("Birthday") != -1){
				bday_list = bday_list + "<img src = \"http://cdn.shopify.com/s/files/1/0185/5092/products/objects-0019_large.png?v=1369543279\" height=15px width=10px/>  "
			}
			else if (events[i].summary.indexOf("Anniversary") != -1){
				bday_list = bday_list + party_popper + "  ";
			}
			else {
				bday_list = bday_list + calendar_emoji + "  ";
			}
			bday_list = bday_list + events[i].summary + "</br>";
		}
		var span = document.createElement("span");
		span.setAttribute("id", "bdays");
		document.getElementById("bdays-annivs").appendChild(span);
		//console.log(bday_list);
		span.innerHTML = bday_list; 

	}); 
	});
	
}
