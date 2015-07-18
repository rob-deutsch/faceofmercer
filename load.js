var page = require('webpage').create();
page.viewportSize = { width: 1280, height: 1024 };
page.open('http://www.mercer.com.au', function(status) {
	console.log("Status: " + status);
	if(status === "success") {
		page.evaluate(function() {
			$(".full-width-carousel .slider").slickPause();
			$(".full-width-carousel .slider").slickGoTo(3, false);
		});
		window.setTimeout(function() {page.render('homepage.png');}, 3000);
		//page.render('homepage.png');
	}
	//phantom.exit();
});
