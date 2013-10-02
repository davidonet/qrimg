requirejs.config({
	paths : {
		underscore : 'lib/underscore',
		bootstrap : 'lib/bootstrap',
		qrcode : 'lib/qrcode.min'
	},
	shim : {
		'underscore' : {
			exports : '_'
		}
	}
});

require(['jquery', 'underscore', 'bootstrap', 'qrcode'], function($, _) {
	$(function() {
		var qrcode = new QRCode("qrcode", {
			text : "http://qi.bype.org/u/",
			width : 256,
			height : 256,
			colorDark : "#000000",
			colorLight : "#ffffff",
			correctLevel : QRCode.CorrectLevel.M
		});
	});
});
