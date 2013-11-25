/**
 * Module dependencies.
 */

var express = require('express'), routes = require('./routes'), http = require('http'), path = require('path');

var mongo = require('mongoskin');
global.db = mongo.db("mongodb://dbserver/qrimg", {
	safe : false
});

var img = require('./routes/img'), set = require('./routes/set');

var app = express();

app.configure(function() {
	app.set('port', process.env.PORT || 5070);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'hjs');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(require('less-middleware')({
		src : __dirname + '/public'
	}));
	app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
	app.use(express.errorHandler());
});

global.auth = express.basicAuth(function(user, pass, callback) {
	var result = (user === 'admin' && pass === 'dummy');
	callback(null/* error */, result);
});

app.get('/:sid', routes.index);
app.post('/img/:id', img.post);
app.get('/img/:id', img.get);
app.get('/del/:id', img.del);
app.get('/set/gen/:sid/:count', set.gen);
app.get('/set/get/:sid', set.get);
app.get('/set/del/:sid', set.del);
app.get('/u/:id', routes.upload);
app.get('/w/:id', routes.webcam);
app.get('/tag/:tag', routes.tag);
app.get('/admin/:tag', auth, routes.admin);
app.get('/admin/del/:id/:tag', auth, img.admindel);

var server = http.createServer(app).listen(app.get('port'), function() {
	console.log("Express server listening on port " + app.get('port'));
});

var socket = require('socket.io');
global.io = socket.listen(server, {
	log : false
});

global.io.configure(function() {
	io.set('log level', 0);
	io.set('origins', '*:*');
});

io.sockets.on('connection', function(socket) {
	socket.on('imgid', function(data) {
		socket.broadcast.emit('imgid', data);
	});
	this.setMaxListeners(0);
});

