var exec = require('child_process').exec,
    fs   = require('fs'),
    AWS  = require('aws-sdk');

AWS.config.loadFromPath('./credentials_aws.json');
var s3 = new AWS.S3({params: {Bucket: 'faceofmercer'} });

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
			for (var slide in site.slides[section]) {
				if (site.slides[section].hasOwnProperty(slide)) {
					slide = site.slides[section][slide];
					uploadSlideToS3(slide);
				}
			}
		}
	};
});

function uploadSlideToS3(slide) {
	var buf = new Buffer(data, 'base64');
	var params = {
		Key: Math.floor(Math.random()*10000).toString() + '.png',
		Body: slide.screenshot,
		ContentEncoding: 'base64',
		ContentType: 'image/png',
	};

	s3.putObject(params, function(err, data) {
		if (err)
			console.log(err)
		else
			console.log("Successful upload");
	});
};
