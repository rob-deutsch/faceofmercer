var page = require('webpage').create();
page.viewportSize = { width: 1280, height: 1024 };
page.open('http://www.mercer.com.au', function(status) {
	console.log("Status: " + status);
	if(status === "success") {
		page.render('example.png');
	}
	phantom.exit();
});
