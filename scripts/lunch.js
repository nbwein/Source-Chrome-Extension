/*Lunch scheduler js */

var app_token;

function authAsApp(){
	$.ajax({
		type: 'POST',
		url: 'https://www.googleapis.com/oauth2/v3/token',
		contentType: 'application/x-www-form-urlencoded', 
		async: false,
	/*	grant_type: 'refresh_token',
		refresh_token: '1/7pr4yin3RqQicagZHus3QdwTww0wJZFJvjTkBdhdjJk',
		client_id: '61085756406-ss56flqs7gkje9l3f6rtvm5oo0ebqrqo.apps.googleusercontent.com',
                client_secret: 'WS2N42PIfZbKpojR3KG96CCX', */
		data: {
			'client_id': '61085756406-ss56flqs7gkje9l3f6rtvm5oo0ebqrqo.apps.googleusercontent.com',
			'client_secret': 'WS2N42PIfZbKpojR3KG96CCX',
			'refresh_token': '1/7pr4yin3RqQicagZHus3QdwTww0wJZFJvjTkBdhdjJk',
			'grant_type': 'refresh_token'
		},
		success: function(resp){
			app_token = resp.access_token;
		},
		error: function(resp){
			console.log(resp);
		}
	});
}

function createEvent(place, time, ampm){
	authAsApp();
	console.log(app_token);
	var id = Math.trunc( Math.random() * 100000);
        var elements = time.split(":");
        var miliseconds = elements[0]*60*60*1000;
        if( ampm == "pm" && elements[0] != 12){
                miliseconds = miliseconds + 12*60*60*1000;
        }
        miliseconds = miliseconds + elements[1]*60*1000;
        var today = new Date();
        today.setHours(0,0,0,0);
        var startTime = new Date(today.getTime() + miliseconds);
        miliseconds = miliseconds + 1*60*60*1000;
        var endTime = new Date(today.getTime() + miliseconds);
        var endstr = endTime.toISOString();
        var startstr = startTime.toISOString();
	var cal_event = JSON.stringify({
		'start' : {
                        'dateTime' : startstr,
                        'timeZone' : "America/New_York"
                },
                'end' : {
                        'dateTime': endstr,
                        'timeZone': "America/New_York"
                },
                'anyoneCanAddSelf' : true,
                'guestsCanModify' : true,
                'id': id,
                'location': place,
                'attendees' : [{'email' : email_global}],
                'summary' : place

	});
	$.ajax({
		type: 'POST', 
		url: 'https://www.googleapis.com/calendar/v3/calendars/stellaservice.com_bpkdnnmn30ddtc0e9pe96ekt8s@group.calendar.google.com/events?access_token=' + app_token,
		contentType: 'application/json',
		data: cal_event,
		success: function(resp){
			return id;
			
		},
		error: function(resp){
			console.log(resp);
		}
		
	});
}

/*function createEvent(place, time, ampm){
	var id = Math.trunc( Math.random() * 100000);
	var elements = time.split(":");
	var miliseconds = elements[0]*60*60*1000;
	if( ampm == "pm" && elements[0] != 12){
		miliseconds = miliseconds + 12*60*60*1000;
	}
	miliseconds = miliseconds + elements[1]*60*1000;
	var today = new Date();
	today.setHours(0,0,0,0);
	var startTime = new Date(today.getTime() + miliseconds);
	miliseconds = miliseconds + 1*60*60*1000;
	var endTime = new Date(today.getTime() + miliseconds);
	var endstr = endTime.toISOString();
	var startstr = startTime.toISOString();
	var request = gapi.client.calendar.events.insert({
		'calendarId' : 'stellaservice.com_bpkdnnmn30ddtc0e9pe96ekt8s@group.calendar.google.com',
		'start' : {
			'dateTime' : startstr,		
			'timeZone' : "America/New_York"
       		},
       		'end' : {
         		'dateTime': endstr,
         		'timeZone': "America/New_York"
     		},
     		'anyoneCanAddSelf' : true,
		'guestsCanModify' : true,	
     		'id': id,
     		'location': place,
     		'attendees' : [{'email' : email_global}],
     		'summary' : place
 });
	request.execute(function(resp) { 
	});
	return id;
} */

function refreshLunch(){
	$(".post-lunch").remove();
	fetchLunches();
}

function scheduleLunch(){
    if (($("#location").val() != '') && (typeof $("#time").val() != 'undefined')) {
       var timestr = $("#time").val();
       var len = timestr.length;
       var ampm = timestr[len-2] + timestr[len-1];
       var time = timestr.replace(ampm, '');
       var id = createEvent($("#location").val(), time, ampm);
       $("#location").val('');
       $("#time").val(''); 
       setTimeout(refreshLunch, 1000);
   }
    else {
        alert("Please fill out both forms.");
    }
}

function addEvent(id){
     authAsApp();
     var request = gapi.client.calendar.events.get({
        'calendarId' : 'stellaservice.com_bpkdnnmn30ddtc0e9pe96ekt8s@group.calendar.google.com',
        'eventId' : id
      });
	request.execute(function(resp) {
	var attendees = [{'email': email_global}];
        var all = attendees.concat(resp.attendees);
	var body = JSON.stringify({'attendees':all});
	$.ajax({
		type: 'PATCH', 
		url: 'https://www.googleapis.com/calendar/v3/calendars/stellaservice.com_bpkdnnmn30ddtc0e9pe96ekt8s@group.calendar.google.com/events/' + id + '?access_token=' + app_token,
		contentType : 'application/json',
		data: body, 
		success: function(resp){
			console.log(resp);
		},
		error: function(resp){
			console.log(resp);
		}
	});
	});
}
/*function addEvent(id){
    var request = gapi.client.calendar.events.get({
        'calendarId' : 'stellaservice.com_bpkdnnmn30ddtc0e9pe96ekt8s@group.calendar.google.com',
        'eventId' : id
    });
    request.execute(function(resp) {	
        var attendees = [{'email': email_global}];
        var all = attendees.concat(resp.attendees);
        var req = gapi.client.calendar.events.patch({
         'calendarId' : 'stellaservice.com_bpkdnnmn30ddtc0e9pe96ekt8s@group.calendar.google.com',
         'eventId' : id,
         'attendees': all
     });
        req.execute( function(resp) {});
    });
} */

function viewMembers(id) {
    var request = gapi.client.calendar.events.get({
      'calendarId' : 'stellaservice.com_bpkdnnmn30ddtc0e9pe96ekt8s@group.calendar.google.com',
      'eventId' : id
  });	
    request.execute(function(resp) {
        var members = (typeof resp.attendees != 'undefined') ? resp.attendees : [];
        var names = '';
        for (var i = 0; i < members.length; i++) {
          	var name = members[i].displayName;
		if (typeof name == 'undefined'){
			name = members[i].email;
		}
		names = names + name + "\n";
     }
     alert(names);
 });
}

function removeMember(id, name) {
    var request = gapi.client.calendar.events.get({
        'calendarId' : 'stellaservice.com_bpkdnnmn30ddtc0e9pe96ekt8s@group.calendar.google.com',
        'eventId' : id
    }); 
    // console.log("id: " + id);
    request.execute(function(resp) {
	authAsApp();
        var members = (typeof resp.attendees != 'undefined') ? resp.attendees : [];
        var names = '';
        for (var i = 0; i < members.length; i++){
            if (members[i].displayName == name || members[i].email == email_global) {
                members.splice(i, 1);
                continue;
            }
            names = names + members[i].displayName + "\n";
        }
	var body = JSON.stringify({'attendees':members});
	$.ajax({
                type: 'PATCH',
                url: 'https://www.googleapis.com/calendar/v3/calendars/stellaservice.com_bpkdnnmn30ddtc0e9pe96ekt8s@group.calendar.google.com/events/' + id + '?access_token=' + app_token,
                contentType : 'application/json',
                data: body,
                success: function(resp){
                },
                error: function(resp){
                }
        });
       /* var req = gapi.client.calendar.events.patch({
         'calendarId' : 'stellaservice.com_bpkdnnmn30ddtc0e9pe96ekt8s@group.calendar.google.com',
         'eventId' : id,
         'attendees': members
     });
        req.execute( function(resp) {}); */
    });
}


/* FETCH LUCHES ATTEMP */
function getLunchCalendar() {
    var midnight = new Date((new Date().getTime() + 24*60*60*1000));
    var now = new Date((new Date().getTime() + 1000*3600));
    midnight.setHours(0,0,0,0);
    var request = gapi.client.calendar.events.list({
        'calendarId': 'stellaservice.com_bpkdnnmn30ddtc0e9pe96ekt8s@group.calendar.google.com',
        'timeMin': now.toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 5,
        'timeMax' : midnight.toISOString(),
        'orderBy': 'startTime'
    });
    return request;

}


function fetchLunches(){
    var request = getLunchCalendar(); 
    request.execute(function(resp){
        var events = resp.items;
        if (events.length > 0) {
            var container = document.getElementById("lunch");
            for (var i = 0; i < events.length; i++) {
                var id = events[i].id;
                var time = events[i].start.dateTime;
                var times = ((time.split("T")[1]).split("-")[0]).split(":");
                var ampm = "am";
                if (times[0] > 12) {
                    times[0] = times[0] - 12;
                    ampm = "pm"
                }
                else if (times[0] == 12){
                    ampm = "pm"
                }
                time = times[0] + ":" + times[1];
                var entry = events[i].location + " " + time + " " + ampm + " ";
                var div = document.createElement("div");
                div.appendChild(document.createTextNode(entry));

                var join = document.createElement("a");
                join.setAttribute("id", "join");
                join.setAttribute("href", "#");
                join.setAttribute("style", "float: right");

                var members = document.createElement("a");
                members.setAttribute("id", "members");
                members.setAttribute("href", "#");
                members.setAttribute("style", "float: right");

                var joinText = document.createTextNode("Join");

                /*if (events[i].creator.email == email_global) {
                    join.className = "join-clicked";
                    joinText = document.createTextNode("Joined!");
                } */
                //else {
                    join.className = "join";

                    for (var person in events[i].attendees) {
                        if (events[i].attendees[person].email == email_global) {
                            join.className = "join-clicked";
                            joinText = document.createTextNode("Joined!");
                        }
                    }
                //}

                members.className = "members";
                var memText = document.createTextNode("Members");
                join.appendChild(joinText);
                members.appendChild(memText);

                var br = document.createElement("br");
                div.appendChild(br);

                var buttonsDiv = document.createElement("div");
                buttonsDiv.setAttribute("class", "buttonsDiv");
		            buttonsDiv.setAttribute("id", id);
                buttonsDiv.appendChild(members);
                buttonsDiv.appendChild(join);
                div.appendChild(buttonsDiv);
                div.className = "post post-lunch";
                div.setAttribute("id", id);
                container.appendChild(div);
            }

        }
    });

        //nextMeeting();
    } 

