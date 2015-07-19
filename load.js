function sleep(miliseconds) {
           var currentTime = new Date().getTime();

           while (currentTime + miliseconds >= new Date().getTime()) {
           }
};

function captureSlide(page, number) {
	var sliderWidth = page.evaluate(function() {
		return $(".full-width-carousel .slider .slick-track").width();
	});
	var sliderCount = page.evaluate(function() {
		var mainCarousel = $(".full-width-carousel .slider").getSlick();
		return mainCarousel.slideCount;
	});
	var offset = (number + 1) * -(sliderWidth / (sliderCount + 2));
	page.evaluate(function(offset) {
		$(".full-width-carousel .slider").slickSetOption("dots", false, true);
		$(".full-width-carousel .slider").slickPause();
		$(".full-width-carousel .slider .slick-track").css({"transform": "translate3d(" + offset + "px, 0px, 0px)"});
	}, offset);
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
page.viewportSize = { width: 1024, height: 768 };
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
