function sleep(miliseconds) {
           var currentTime = new Date().getTime();

           while (currentTime + miliseconds >= new Date().getTime()) {
           }
};

function captureSlide(page, carouselClass, number) {
	var sliderSelector = "." + carouselClass + " .slider";
	var trackSelector = sliderSelector + " .slick-track";

	var sliderWidth = page.evaluate(function(trackSelector) {
		return $(trackSelector).width();
	}, trackSelector);

	var sliderCount = page.evaluate(function(sliderSelector) {
		var mainCarousel = $(sliderSelector).getSlick();
		return mainCarousel.slideCount;
	}, sliderSelector);

	var offset = (number + 1) * -(sliderWidth / (sliderCount + 2));
	page.evaluate(function(offset, sliderSelector, trackSelector) {
		$(sliderSelector).slickSetOption("dots", false, true);
		$(sliderSelector).slickPause();
		$(trackSelector).css({"transform": "translate3d(" + offset + "px, 0px, 0px)"});
	}, offset, sliderSelector, trackSelector);
	var clipRect = page.evaluate(function(sliderSelector) {
		return document.querySelector(sliderSelector).getBoundingClientRect();
	}, sliderSelector);
	page.clipRect = {
		top: clipRect.top,
		left: clipRect.left,
		width: clipRect.width,
		height: clipRect.height
	};
	var filename = carouselClass + number + ".png";
	page.render(filename);
	console.log("Saved image " + filename);
};

function captureSlides(page, carouselClass) {
	var sliderSelector = "." + carouselClass + " .slider";
	var slideCount = page.evaluate(function(sliderSelector) {
		var mainCarousel = $(sliderSelector).getSlick();
		return mainCarousel.slideCount;
	}, sliderSelector);
	console.log(carouselClass + " slide count: " + slideCount);
	for(var i=0; i < slideCount; i++) {
		captureSlide(page,carouselClass,i);
	};
};

var page = require('webpage').create();
page.viewportSize = { width: 1024, height: 768 };
page.open('http://www.mercer.com', function(status) {
	console.log("Status: " + status);
	if(status === "success") {
		page.render('homepage.png');
		console.log("Saved homepage.png");
		captureSlides(page, "full-width-carousel");
		captureSlides(page, "promo-slider");
	}
	phantom.exit();
});
