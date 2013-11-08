requirejs.config({
	paths : {
		underscore : 'lib/underscore',
		bootstrap : 'lib/bootstrap',
		qrcode : 'lib/qrcode.min',
		socket : '/socket.io/socket.io'
	},
	shim : {
		'underscore' : {
			exports : '_'
		}
	}
});

require(['jquery', 'underscore', 'socket'], function($, _) {
	var socket = io.connect();
	socket.on('imgid', function(data) {
		var t = new Date().getTime();
		$('#' + data.id).fadeOut(function() {
			$('#' + data.id).attr('src', '/img/' + data.id + '?r=' + t);
			$('#' + data.id).fadeIn();
		});
	});
});
