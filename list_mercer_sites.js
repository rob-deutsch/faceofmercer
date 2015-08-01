// Set up page
var page = require('webpage').create();
page.viewportSize = { width: 1024, height: 768 };

// Open Mercer homepage
page.open('http://www.mercer.com', function(status) {
	var sites = page.evaluate(function () {
		// Get all of the <p>s containing links to countries' websites
		var countries = $(".mrc-country").find("p:has(a)");
		
		// Put each of the <p> into an appropriate dictionary
		// { country: { lang: url,  },  }
		var sites = {};
		countries.each(function(index) {
			// Remove child nodes (e.g. flags)
			countryName = $(this).clone().children().remove().end().text().trim();
			var langs = {};
			$(this).find("a").each(function(index) {
				var lang = $(this).text().trim();
				// Need this line to get full http://... link
				var url = $(this).get(0).href;
				langs[lang] = url;
			});
			sites[countryName] = langs;
		});
		return(sites);
	});
	console.log(JSON.stringify(sites));
	phantom.exit();
});

