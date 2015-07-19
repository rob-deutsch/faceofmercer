function sleep(miliseconds) {
           var currentTime = new Date().getTime();

           while (currentTime + miliseconds >= new Date().getTime()) {
           }
};



var page = require('webpage').create();
page.viewportSize = { width: 1280, height: 1024 };
page.open('http://www.mercer.com.au', function(status) {
	console.log("Status: " + status);
	if(status === "success") {
		page.render('homepage.png');
		console.log("Saved homepage.png")
		page.evaluate(function() {
			$(".full-width-carousel .slider").slickSetOption('dots',false,true);
			$(".full-width-carousel .slider").slickPause();
			$(".full-width-carousel .slider").slickGoTo(1, false);
		});
		sleep(3000);
			var clipRect = page.evaluate(function(){
				return document.querySelector('.full-width-carousel .slider').getBoundingClientRect();
			});
			page.clipRect = {
				top: clipRect.top,
				left: clipRect.left,
				width: clipRect.width,
				height: clipRect.height
			};
			page.render('1.png')
			console.log("Saved first image");
	}
	phantom.exit();
});
