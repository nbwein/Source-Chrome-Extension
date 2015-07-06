/* js for stellaservice daily values. Make editable by elise? */

var values = ["Practice what we preach", "Demand and deliver excellence", "Build creatively, measure intelligently and learn fast", "Foster fun and positivity", "Act like an owner", "Communicate openly, honestly and constructively", "Work hard to keep it simple", "Take initiative and be accountable" ];

function loadValues(){
  // var index = Math.floor(Math.random() * 8);
  var index = 2;
  console.log(values[index]);
  document.getElementById("stella-daily-value").innerHTML = "<i>" + values[index] + "</i>";
}
