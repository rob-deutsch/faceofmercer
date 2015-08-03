var exec = require('child_process').exec,
    fs   = require('fs');

var country = "Australia";
var lang = "English";
var url = "http://www.mercer.com.au";

var get_site = "site.json";
var get_site_cmd = "./phantomjs get_mercer_site.js " + url + " " + get_site;

exec(get_site_cmd, function(err, stdout, stderr) {
	console.log('stdout: ' + stdout);
	console.log('stderr: ' + stderr);
	var site = JSON.parse(fs.readFileSync(get_site));
	for (var section in site.slides) {
		if (site.slides.hasOwnProperty(section)) {
			for (var slide in sites.slide[section]) {
				if (sites.slide[section].hasOwnProperty(slide)) {
					console.log(sites.slide[section][slide].innerText);
				}
			}
		}
	};
});
