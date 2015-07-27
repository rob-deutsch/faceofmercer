function captureSlide(page, name, carouselSelector, number) {
	var trackSelector = carouselSelector + " .slick-track";

	// Get the width of the track
	var sliderWidth = page.evaluate(function(trackSelector) {
		return $(trackSelector).width();
	}, trackSelector);

	// Get the number of slides
	var sliderCount = page.evaluate(function(carouselSelector) {
		var carousel = $(carouselSelector).getSlick();
		return carousel.slideCount;
	}, carouselSelector);

	// Calculate the per-slide pixel offset
	var offset = (number + 1) * -(sliderWidth / (sliderCount + 2));
	
	// Move the requested slide to be right in the middle
	page.evaluate(function(offset, carouselSelector, trackSelector) {
		$(carouselSelector).slickSetOption("dots", false, true);
		$(carouselSelector).slickPause();
		$(trackSelector).css({"transform": "translate3d(" + offset + "px, 0px, 0px)"});
	}, offset, carouselSelector, trackSelector);
	
	// Get the exact location of the slide on the page
	var clipRect = page.evaluate(function(carouselSelector) {
		return document.querySelector(carouselSelector).getBoundingClientRect();
	}, carouselSelector);
	
	// Set the clipping to only be equal to the slide
	page.clipRect = {
		top: clipRect.top,
		left: clipRect.left,
		width: clipRect.width,
		height: clipRect.height
	};
	
	// Save the image
	var filename = name + number + ".png";
	page.render(filename);
	console.log("Saved image " + filename);
};

function captureSlides(page, name, carouselSelector) {
	// Get the number of slides
	var slideCount = page.evaluate(function(carouselSelector) {
		var mainCarousel = $(carouselSelector).getSlick();
		return mainCarousel.slideCount;
	}, carouselSelector);
	console.log(name + " slide count: " + slideCount);
	// Iterate through each slide and take a screenshot
	for(var i=0; i < slideCount; i++) {
		captureSlide(page,name, carouselSelector,i);
	};
};

var page = require('webpage').create();
page.viewportSize = { width: 1024, height: 768 };
page.open('http://www.mercer.com', function(status) {
	console.log("Status: " + status);
	if(status === "success") {
		page.render('homepage.png');
		console.log("Saved homepage.png");
		captureSlides(page, "main", ".full-width-carousel .slider");
		captureSlides(page, "feature", ".feature-carousel .carousel-panel");
	}
	phantom.exit();
});
