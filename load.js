function sleep(miliseconds) {
           var currentTime = new Date().getTime();

           while (currentTime + miliseconds >= new Date().getTime()) {
           }
};

function captureSlide(page, number) {
	page.evaluate(function(number) {
		$(".full-width-carousel .slider").slickSetOption("dots", false, true);
		//$(".full-width-carousel .slider").slickPause();
		$(".full-width-carousel .slider").slickGoTo(number, false);
	}, number);
	sleep(2000);
	var clipRect = page.evaluate(function() {
		return document.querySelector(".full-width-carousel .slider").getBoundingClientRect();
	});
	page.clipRect = {
		top: clipRect.top,
		left: clipRect.left,
		width: clipRect.width,
		height: clipRect.height
	};
	page.render(number + '.png');
	console.log("Saved image " + number);
};

var page = require('webpage').create();
page.viewportSize = { width: 1280, height: 1024 };
page.open('http://www.mercer.com', function(status) {
	console.log("Status: " + status);
	if(status === "success") {
		page.render('homepage.png');
		console.log("Saved homepage.png");
		var slideCount = page.evaluate(function() {
			var mainCarousel = $(".full-width-carousel .slider").getSlick();
			return mainCarousel.slideCount;
		});
		console.log("slide count: " + slideCount);
		for(var i=0; i < slideCount; i++) {
			captureSlide(page,i);
		};		
	}
	phantom.exit();
});
