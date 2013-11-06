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
	socket.on('imgid', function(id) {
		var t = new Date().getTime();
		$('#' + id).fadeOut(function() {
			$('#' + id).attr('src', '/img/' + id + '?r=' + t);
			$('#' + id).fadeIn();
		});
	});
});
