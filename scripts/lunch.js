/*Lunch scheduler js */

function createEvent(place, time){
	var id = Math.trunc( Math.random() * 100000);
	var elements = time.split(":");
	var miliseconds = elements[0]*60*60*1000;
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
		'attendees' : [{'email' : email_global}]
	});
	request.execute(function(resp) {});
	return id;
}


function scheduleLunch(){
    console.log("clicked!");
    var id = createEvent($("#location").val(), $("#time").val());
    $("#location").val('');
    $("#time").val(''); 
}

function addEvent(id){
  var req = gapi.client.calendar.events.get({
    'calendarId' : 'stellaservice.com_bpkdnnmn30ddtc0e9pe96ekt8s@group.calendar.google.com',
    'eventId' : id
  });
  req.execute(function(resp) {	
    var attendees = [{'email': email_global}];
    console.log(email_global);
    var members_list = resp.attendees;
    var all = attendees.concat(resp.attendees);
    console.log(all);
    var request = gapi.client.calendar.events.patch({
     'calendarId' : 'stellaservice.com_bpkdnnmn30ddtc0e9pe96ekt8s@group.calendar.google.com',
     'eventId' : id,
     'attendees': all
   });
    request.execute( function(resp) {});
  });
}

function viewMembers(id){
	var request = gapi.client.calendar.events.get({
		'calendarId' : 'stellaservice.com_bpkdnnmn30ddtc0e9pe96ekt8s@group.calendar.google.com',
		'eventId' : id
	});	
	request.execute(function(resp) {
		var members = resp.attendees;
		console.log(members);
		var names = '';
		for (var i = 0; i < members.length; i++){
			console.log(members[i].displayName);
			names = names + members[i].displayName + "\n";
		}
		alert(names);
	});
}

