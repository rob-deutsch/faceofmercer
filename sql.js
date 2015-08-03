var mysql       = require('mysql');
var credentials = require('./credentials');
var fs          = require('fs');

var connection = mysql.createConnection({
  host     : credentials.host,
  user     : credentials.user,
  password : credentials.password,
  database : credentials.database,
  ssl      : {
    ca   : fs.readFileSync(__dirname + '/server-ca.pem'),
    cert : fs.readFileSync(__dirname + '/client-cert.pem'),
    key  : fs.readFileSync(__dirname + '/client-key.pem')
  }
});

connection.connect(function(err) {
	if (err) {
		console.log(err.stack);
		return;
	}
	console.log("connected as id " + connection.threadId);
	process.exit();
});
