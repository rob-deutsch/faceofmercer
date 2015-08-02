var mysql      = require('mysql');
var credentials     = require('./credentials');
var connection = mysql.createConnection({
  host     : credentials.host,
  user     : credentials.user,
  password : credentials.password,
  database : credentials.database,
});

connection.connect(function(err) {
	if (err) {
		console.log(err.stack);
		return;
	}
	console.log("connected as id " + connection.threadId);
	process.exit();
});
