/* Birthdays and Anniversaries */
	
var party_popper = "<img src=\"http://cdn.shopify.com/s/files/1/0185/5092/products/objects-0017_medium.png?v=1369543805\"/>";

function getCalendar() {
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


function getSpecialEvents(){
	request = getCalendar();
	request.execute(function(resp){
		events = resp.items;
		var bday_list = "";
		var today = new Date();
		today.setHours(0,0,0,0);
		var curr_date = today;
		for (var i = 0; i < events.length; i++){
			var date_parse = events[i].start.date.split("-");
			var date = (new Date(date_parse[0] , (date_parse[1]-1), date_parse[2]));
			if (date.getTime() != curr_date.getTime()){
				if (date == today){
					bday_list = bday_list + "today: </br>"
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
			bday_list = bday_list + events[i].summary + "</br>";
		}
		var span = document.createElement("span");
		span.setAttribute("id", "bdays");
		document.getElementById("bdays-annivs").appendChild(span);
		span.innerHTML = bday_list;

	});
	
}
