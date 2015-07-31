var page = require('webpage').create();
page.viewportSize = { width: 1024, height: 768 };
page.open('http://www.mercer.com', function(status) {
	var sites = page.evaluate(function () {
		var countries = $(".mrc-country").find("p:has(a)");
		var sites = {};
		countries.each(function(index) {
			countryName = $(this).clone().children().remove().end().text().trim();
			var langs = {};
			$(this).find("a").each(function(index) {
				var lang = $(this).text().trim();
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

