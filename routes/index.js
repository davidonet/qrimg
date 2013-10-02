/*
 * GET home page.
 */

var uuid = require('node-uuid');
var QRCode = require('qrcode');

exports.index = function(req, res) {
	res.redirect('/qr/' + uuid.v1());
};

exports.qrcode = function(req, res) {
	QRCode.draw('http://qi.bype.org/u/' + req.params.id, {
		errorCorrectLevel : "high"
	}, function(err, canvas) {
		var stream = canvas.createPNGStream();
		res.writeHead('200', {
			'Content-Type' : 'image/png',
			'Cache-Control' : 'public, max-age= 10'
		});
		stream.pipe(res);
	});
};

exports.upload = function(req, res) {
	res.render('upload', {
		qrid : req.params.id
	});
};
