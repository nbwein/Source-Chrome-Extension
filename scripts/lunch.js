/*Lunch scheduler js */

function createEvent(place, time, ampm){
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
     		'id': id,
     		'location': place,
     		'attendees' : [{'email' : email_global}],
     		'summary' : place
 });
	request.execute(function(resp) { console.log(resp); location.reload();});
	return id;
}


function scheduleLunch(){
    if (($("#location").val() != '') && ($("#time").val() != '')) {
       var timestr = $("#time").val();
       var len = timestr.length;
       var ampm = timestr[len-2] + timestr[len-1];
       var time = timestr.replace(ampm, '');
       var id = createEvent($("#location").val(), time, ampm);
       $("#location").val('');
       $("#time").val(''); 
      // location.reload();
   }
    else {
        alert("Please fill out both forms.");
    }
}

function addEvent(id){
    console.log("addEvent: " + id);
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
}

function viewMembers(id) {
    console.log("viewmembers: " + id);
    var request = gapi.client.calendar.events.get({
      'calendarId' : 'stellaservice.com_bpkdnnmn30ddtc0e9pe96ekt8s@group.calendar.google.com',
      'eventId' : id
  });	
    request.execute(function(resp) {
        var members = (typeof resp.attendees != 'undefined') ? resp.attendees : [];
        var names = '';
        for (var i = 0; i < members.length; i++) {
            names = names + members[i].displayName + "\n";
     }
     alert(names);
 });
}

function removeMember(id, name) {
    console.log("removeMember: " + id);
    var request = gapi.client.calendar.events.get({
        'calendarId' : 'stellaservice.com_bpkdnnmn30ddtc0e9pe96ekt8s@group.calendar.google.com',
        'eventId' : id
    }); 
    // console.log("id: " + id);
    request.execute(function(resp) {
        var members = (typeof resp.attendees != 'undefined') ? resp.attendees : [];
        var names = '';
        for (var i = 0; i < members.length; i++){
            if (members[i].displayName == name) {
                members.splice(i, 1);
                continue;
            }
            names = names + members[i].displayName + "\n";
        }

        var req = gapi.client.calendar.events.patch({
         'calendarId' : 'stellaservice.com_bpkdnnmn30ddtc0e9pe96ekt8s@group.calendar.google.com',
         'eventId' : id,
         'attendees': members
     });
        req.execute( function(resp) {});
    });
}


/* FETCH LUCHES ATTEMP */
function getLunchCalendar() {
                var midnight = new Date((new Date().getTime() + 24*60*60*1000));
                midnight.setHours(0,0,0,0);
                var request = gapi.client.calendar.events.list({
                        'calendarId': 'stellaservice.com_bpkdnnmn30ddtc0e9pe96ekt8s@group.calendar.google.com',
                        'timeMin': (new Date()).toISOString(),
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

                                        var members = document.createElement("a");
                                        members.setAttribute("id", "members");
                                        members.setAttribute("href", "#");

                                        var joinText = document.createTextNode("Join");

                                        if (events[i].creator.email == email_global) {
                                                join.className = "join-clicked";
                                                joinText = document.createTextNode("Joined!");
                                        }
                                        else {
                                                join.className = "btn join";

                                                for (var person in events[i].attendees) {
                                                        console.log(events[i].attendees[person]);
                                                        if (events[i].attendees[person].email == email_global) {
                                                                join.className = "join-clicked";
                                                                joinText = document.createTextNode("Joined!");
                                                        }
                                                }
                                        }

                                        members.className = "btn members";
                                        var memText = document.createTextNode("Members");
					join.appendChild(joinText);
                                        members.appendChild(memText);
                                        div.appendChild(join);
                                        div.appendChild(members);
                                        div.className = "post";
                                        div.setAttribute("id", id);
                                        container.appendChild(div);
                                }

                        }
                });

        //nextMeeting();
} 

