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


function createEvent(place, time){
	/*Event event = new Event()
		.setSummary(place);
		.setLocation(place); */
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
    /*var message = $("#location").val() + " " + $("#time").val() + "(id)" + id;
    var subject = "Lunch";
    console.log(message);
    var params = (btoa("From: me\r\nTo:" + "test-feed@googlegroups.com" + "\r\nSubject:"+ subject + "\r\n\r\n" + message));
    var numBytes = (params.length).toString();
    $.ajax({
      type: "POST",
      url: "https://www.googleapis.com/gmail/v1/users/me/messages/send",
      contentType: "application/json",
      dataType: "json",
      beforeSend: function(xhr, settings) {
        xhr.setRequestHeader('Authorization','Bearer ' + access_global);
      },
      data: JSON.stringify({"raw": params})
    }); */
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
                var members_list = resp.attendees;
		console.log(members_list);
		for (var i = 0; i < members_list.length; i++){
			attendees = attendees.push(members_list[i]);

		}
		var end = resp.end;
		var start = resp.start
		var request = gapi.client.calendar.events.patch({
			'calendarId' : 'stellaservice.com_bpkdnnmn30ddtc0e9pe96ekt8s@group.calendar.google.com',
                	'eventId' : id,
			'attendees': attendees,
			'start' : start,
			'end': end
			

		});
		request.execute( function(resp) { console.log(resp);});

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
		for (var i = 0; i < members.length; i++){
			console.log(members[i].displayName);
		}
	});
}

//$("#join").on("click", addEvent($(this).parents()));
