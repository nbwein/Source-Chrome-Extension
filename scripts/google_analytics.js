var google_analytics_account_num = 'UA-10032687-15';

var _gaq = _gaq || [];
_gaq.push(['_setAccount', google_analytics_account_num]);
_gaq.push(['_trackPageview']);

(function() {
	var ga = document.createElement('script');
	ga.type = 'text/javascript';
	ga.async = true;
	ga.src = 'https://ssl.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(ga, s);
})();

function trackButtonClick(e) {
	console.log(e);
	_gaq.push(['_trackEvent', e.target.id, 'clicked']);
}


document.addEventListener('DOMContentLoaded' , function(){
	//_gaq.push(['_trackPageview']);
	var icon_buttons = document.querySelectorAll('i.fa');
	for (var i = 0; i < icon_buttons.length; i++){
		icon_buttons[i].addEventListener('click', trackButtonClick);
	}
	var submit_buttons = document.querySelectorAll('a.btn');
	for (var j = 0; j < submit_buttons.length; j++) {
		submit_buttons[j].addEventListener('click', trackButtonClick);
	}
});
