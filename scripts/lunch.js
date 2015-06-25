<<<<<<< HEAD
/*Lunch scheduler js */

function fetchLunches(){
$.ajax({
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
					console.log("found one");
					var body = elements[1].split("<description>")[1].split("</description>")[0];
					var entry = body + "\n";
                                	var div = document.createElement("div");
                                	div.appendChild(document.createTextNode(entry));
					var join = document.createElement("button");
					var members = document.createElement("button");
					join.className = "join";
					join.setAttribute("id", "join");
					members.className = ".members";
					var joinText = document.createTextNode("Join");
					var memText = document.createTextNode("Members");
					join.appendChild(joinText);
					members.appendChild(memText);
					div.appendChild(join);
					div.appendChild(members);
					div.className = "post";
					container.appendChild(div);
					
				}
			}
		}
	});
}

function scheduleLunch(){
    console.log("clicked!");
    var message = $("#location").val() + " " + $("#time").val();
    var subject = "Lunch";
    console.log(subject);
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
    });
    $("#location").val('');
    $("#time").val('');
}

function addEvent(){
	console.log("click");
	return false;
	//console.log($(this).parents());		
}

//$("#join").on("click", addEvent($(this).parents()));
=======
function fetchLunches(){
  $.ajax({
    method: "GET",
    url: "https://groups.google.com/forum/feed/test-feed/msgs/rss_v2_0",
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
          console.log("found one");
          var body = elements[1].split("<description>")[1].split("</description>")[0];
          var entry = body;
          var div = document.createElement("div");
          div.appendChild(document.createTextNode(entry));
          div.className = "post";
          container.appendChild(div);

        }
      }
    }
  });
}

function scheduleLunch(){
  console.log("clicked!");
  var message = $("#location").val() + $("#time").val();
  var subject = "Lunch";
  console.log(subject);
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
  });
  $("#location").val('');
  $("#time").val('');
}
>>>>>>> e0c28472b5d77e64fe52f902f62ae59c7508ec49
