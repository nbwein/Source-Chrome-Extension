/* Javascript for the message board */

function loadFeed(){
	var rand = Math.trunc(Math.random() * 10000);
	console.log(rand);
	$.ajax({
		method: "GET",
		url: "https://groups.google.com/forum/feed/test-feed/msgs/rss_v2_0",
		dataType: "html",
		success:function(data){
			data.replace('</item>', '');
			var items = data.split("<item>");
			delete items[0];
			var container = document.getElementById("message-board");
			for (var i = 1; i < items.length; i++){
				var elements = items[i].split("</title>");
				var subject = elements[0].replace("<title>", "");
				if (subject != "Lunch"){
					var description = elements[1].split("<description>")[1].split("</description>")[0];
					var entry = description;
					var div = document.createElement("div");
					div.appendChild(document.createTextNode(entry));
					div.className = "post";
					if (i == 0){
						div.setAttribute("style", "border-top-left-radius: 15px; border-top-right-radius: 15px");
					}
					container.appendChild(div);
				}
			}
		}
	});
}


function addMessage(msg) {
	var container = document.getElementById("message-board");
	var div = document.createElement("div");
	div.appendChild(document.createTextNode(msg));
	div.className = "post";
	container.appendChild(div);
}