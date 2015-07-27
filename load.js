function captureSlides(page, name, carouselSelector) {
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

	var clonedCount = page.evaluate(function(trackSelector) {
		return $(trackSelector + " .slick-cloned").length;
	}, trackSelector);

	console.log(name + " slide count: " + sliderCount);

	var hashes = [];
	
	for (var number = 0; number < sliderCount; number++) {
		// Calculate the per-slide pixel offset
		// Assumed that half of cloned are first, and half are last
		var offset = (number + clonedCount / 2) * -(sliderWidth / (sliderCount + clonedCount));
		
		// Move the requested slide to be right in the middle
		// And get the exact location of the slide on the page
		var clipRect = page.evaluate(function(offset, carouselSelector, trackSelector) {
			$(carouselSelector).slickSetOption("dots", false, true);
			$(carouselSelector).slickPause();
			$(trackSelector).css({"transform": "translate3d(" + offset + "px, 0px, 0px)"});
	
			slide = $(trackSelector + " .slick-slide").not(".slick-cloned")[i]
			return slide.getBoundingClientRect();
		}, offset, carouselSelector, trackSelector);
		
		// Set the clipping to only be equal to the slide
		page.clipRect = {
			top: clipRect.top,
			left: clipRect.left,
			width: clipRect.width,
			height: clipRect.height
		};
		
		// Save the image
		hashes.push(page.renderBase64('PNG'));
	}
	return(hashes);
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
