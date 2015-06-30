/*Lunch scheduler js */


/* OLD IMPLEMENTATION THAT USES GOOGLE GROUPS */
/*function fetchLUnches(){
/*$.ajax({
                method: "GET",
                url: "https://groups.google.com/forum/feed/test-feed/msgs/rss_v2_0" ,
                dataType: "html",
                success:function(data){
			data.replace('</item>', '');
                        var items = data.split("<item>");
                        delete items[0];
			var container = document.getElementById("lunch");
			for (var i = 1; i < items.length; i++){
                                var elements = items[i].split("</title>");
				var subject = elements[0].replace("<title>", "");
				if (subject == "Lunch"){
					var body = elements[1].split("<description>")[1].split("</description>")[0];
					console.log(body);
					var params = body.split("(id)");
					var message = params[0];
					var id = params[1];
					console.log(id);
					var entry = message + "\n";
                                	var div = document.createElement("div");
                                	div.appendChild(document.createTextNode(entry));
					var join = document.createElement("button");
					var members = document.createElement("button");
					join.className = "join";
					join.setAttribute("id", "join");
					members.className = "members";
					var joinText = document.createTextNode("Join");
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
		}
	}); */

/* Add an event to the Lunch google calendar */
function createEvent(place, time, ampm){
	var id = Math.trunc( Math.random() * 100000);
	var elements = time.split(":");
	var miliseconds = elements[0]*60*60*1000;
	if (ampm == "pm" & elements[0] != 12){
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
	request.execute(function(resp) {});
	return id;
}

/* Triggered when schedule is clicked, creates an event and clears when and where fields*/
function scheduleLunch(){
    var timestr = $("#time").val();
    var len = timestr.length;
    var ampm = timestr[len-2] + timestr[len-1];
    var time = timestr.replace(ampm, '');
    console.log(time);
    var id = createEvent($("#location").val(), time, ampm);
    $("#location").val('');
    $("#time").val(''); 
    $("#lunch").empty();
    fetchLunches();
}

/* Triggered when a user joins an event, adds the member as a guest to the pre0existing event and adds it to their personal calendar */
function addEvent(id){
        var req = gapi.client.calendar.events.get({
                'calendarId' : 'stellaservice.com_bpkdnnmn30ddtc0e9pe96ekt8s@group.calendar.google.com',
                'eventId' : id
        });
        req.execute(function(resp) {	
		var attendees = [{'email': email_global}];
                var members_list = resp.attendees;
		var all = attendees.concat(resp.attendees);
		console.log(all);
		var request = gapi.client.calendar.events.patch({
			'calendarId' : 'stellaservice.com_bpkdnnmn30ddtc0e9pe96ekt8s@group.calendar.google.com',
                	'eventId' : id,
			'attendees': all
		});
		request.execute( function(resp) {
		console.log(resp);});
		});
}

/* Triggered when view members is clicked, queries the calendar and lists members attending the event clicked*/
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

