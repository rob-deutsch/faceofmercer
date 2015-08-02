var exec = require('child_process').exec,
    temp = require('temp'),
    fs   = require('fs');

var list_sites = "sites.json";
var list_sites_cmd = "./phantomjs list_mercer_sites.js " + list_sites;

exec(list_sites_cmd, function(err, stdout, stderr) {
	console.log('stdout: ' + stdout);
	console.log('stderr: ' + stderr);
	var sites = JSON.parse(fs.readFileSync(list_sites));	
	console.log(JSON.stringify(sites));
});
