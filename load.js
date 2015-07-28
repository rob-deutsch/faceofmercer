function captureSlides(page, carouselSelector) {
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

	console.log("Slide count: " + sliderCount);

	var slides = [];
	
	for (var number = 0; number < sliderCount; number++) {
		// Calculate the per-slide pixel offset
		// Assumed that half of cloned are first, and half are last
		var offset = (number + clonedCount / 2) * -(sliderWidth / (sliderCount + clonedCount));
		
		// Move the requested slide to be right in the middle
		// And get the exact location of the slide on the page
		var s = page.evaluate(function(i, offset, carouselSelector, trackSelector) {
			$(carouselSelector).slickSetOption("dots", false, true);
			$(carouselSelector).slickPause();
			$(trackSelector).css({"transform": "translate3d(" + offset + "px, 0px, 0px)"});
	
			var s = $(trackSelector + " .slick-slide").not(".slick-cloned")[i];
			return {
					clipRect: s.getBoundingClientRect(),
					innerText: s.innerText,
					innerHTML: s.innerHTML,
				};
		}, number, offset, carouselSelector, trackSelector);
		
		// Set the clipping to only be equal to the slide
		page.clipRect = {
			top: s.clipRect.top,
			left: s.clipRect.left,
			width: s.clipRect.width,
			height: s.clipRect.height
		};

		// Delete the bounding box info and add the image data
		delete s["clipRect"];
		s["screenshot"] = page.renderBase64('PNG');
		
		// Save theinfo
		slides.push(s);
	}
	return(slides);
};

function captureFeaturedArticles(page) {
	var divSelector = ".feat-articles";

	// Get the number of featured articles
	var articleCount = page.evaluate(function(divSelector) {
		return $(divSelector + " .feat-article").length;
	}, divSelector);

	console.log("Article count: " + articleCount);

	var articles = [];
	
	for (var number = 0; number < articleCount; number++) {
		// Move the requested slide to be right in the middle
		// And get the exact location of the slide on the page
		var a = page.evaluate(function(i, divSelector) {
			var a = $(divSelector + " .feat-article")[i];
			return {
					clipRect: a.getBoundingClientRect(),
					innerText: a.innerText,
					innerHTML: a.innerHTML,
				};
		}, number, divSelector);
		
		// Set the clipping to only be equal to the slide
		page.clipRect = {
			top: a.clipRect.top,
			left: a.clipRect.left,
			width: a.clipRect.width,
			height: a.clipRect.height
		};

		// Delete the bounding box info and add the image data
		delete a["clipRect"];
		a["screenshot"] = page.renderBase64('PNG');
		
		// Save theinfo
		articles.push(a);
	}
	return(articles);
};

var page = require('webpage').create();
page.viewportSize = { width: 1024, height: 768 };
page.open('http://www.mercer.com', function(status) {
	console.log("Status: " + status);
	if(status === "success") {
		console.log("Saving home page");
		var info = {
			screenshot: page.renderBase64('PNG'),
			html: page.content,
			slides: {
				main: captureSlides(page, ".full-width-carousel .slider"),
				feature: captureSlides(page, ".feature-carousel .carousel-panel"),
				articles: captureFeaturedArticles(page)
			}
		};
	};
	//console.log(info["html"]);
	phantom.exit();
});
