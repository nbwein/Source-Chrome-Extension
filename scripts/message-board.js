/* Javascript for the message board */
/*function loadXMLDoc(url)
{i
var xmlhttp;
xmlhttp = new XMLHttpRequest();
if (xmlhttp.readyState==4 && xmlhttp.status==200) {
	console.log("got it");
}
xmlhttp.open("GET",url,true);
xmlhttp.send();
}*/
 
function loadFeed(){
	var rand = Math.trunc(Math.random() * 1000);
	console.log(rand);
	var url = 'https://groups.google.com/forum/feed/test-feed/msgs/rss_v2_0';
	var url = url + '?nocache=' + rand.toString();
	var feed = new google.feeds.Feed(url);
	console.log(feed);
	feed.load(function(result) {
		if(!result.error){
			console.log(result);
			var container = document.getElementById("message-board");
			for (var i = 0; i < result.feed.entries.length; i++) {
				console.log("in loop");
				var entry = result.feed.entries[i];
				var div = document.createElement("div");
				div.appendChild(document.createTextNode(entry.content));
				container.appendChild(div);
			}
		}
		else{
		console.log(":(", result.error);
		}
	});	
}


