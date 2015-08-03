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
});
