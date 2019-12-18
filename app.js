var app = require('./server.js');
var config = require('./config/config');

/*
 * Start node server
 */
app.listen(config.port, '0.0.0.0');
app.timeout = 1000;
console.log("Server started on " + config.port);