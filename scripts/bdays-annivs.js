/* Birthdays and Anniversaries */

function getCalendar() {
                var midnight = new Date((new Date().getTime() + 24*60*60*1000));
                midnight.setHours(0,0,0,0);
		var today = new Date();
		today.setHours(0,0,0,0);
		console.log(today);
                var request = gapi.client.calendar.events.list({
                        'calendarId': 'stellaservice.com_8scj4nlafijk1llee3anm383dk@group.calendar.google.com',
                        'timeMin': today.toISOString(),
                        'showDeleted': false,
                        'singleEvents': true,
                        'maxResults': 5,
                        'timeMax' : midnight.toISOString(),
                        'orderBy': 'startTime'
                });
                return request;
        }


function getSpecialEvents(){
	request = getCalendar();
	request.execute(function(resp){
		events = resp.items;
		var bday_list = "";
		for (var i = 0; i < events.length; i++){
			bday_list = bday_list + "<br>" + rep.items[1].description + "</br>";
		}
		document.getElementById("bdays-annivs").appendChild = bday_list;

	});
	
}
