function getJobs(){	
	getNewHireInfo();
	makeRequest().done(function(data) {
		var nycjobs = data.offices[2];
		var joblist = "";
		for (var i = 0; i < nycjobs.departments.length; i++){
			var dep = nycjobs.departments[i];
			if (dep.jobs.length > 0){
				joblist = joblist + "<br><b>" + dep.name + "</b><br>";
				for (var j = 0; j < dep.jobs.length; j++){
					joblist = joblist + "<a style=\"color:white;\" href =\"" + dep.jobs[j].absolute_url + "\">" + dep.jobs[j].title + "</a><br>";
				}

			}
		}
		joblist = joblist + "<br><br>"
		document.getElementById("job-list").innerHTML = joblist;
	});

}

function makeRequest(){
        return $.ajax({
                method: "GET",
                url: "https://api.greenhouse.io/v1/boards/stellaservice/embed/offices",
                datatype: "json"
        });


}

function getNewHireInfo(){
	$.ajax({
		method: "GET",
		url: "https://docs.google.com/spreadsheets/d/1eeOhUe8TJg2P9oFe9pWXh7YQfjFTYihHQEf9VZOBJ6Q/pub?gid=268625726&single=true&output=csv",
		error: function(resp){
			console.log(resp);
		},
		success: function(resp){
			var parts = resp.split("\n");
			var info = parts[parts.length - 1];
			info = info.split(",");
			var start_date = info[2].split("/");
			var start = new Date(start_date[2] , start_date[0], start_date[1]);
			var end = new Date(start.getTime() + 1000*3600*24*7);
			var now = new Date().getTime();
			if (now < end.getTime()){
				$("#new_hire_welcome").text("Welcome, " + info[0] + "!");
				$("#new_hire_text").text(info[1]);
			}
			else{
				$("#new_hire_info").css("display", "none");
			}
		}
	});
}
