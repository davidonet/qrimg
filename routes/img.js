var fs = require('fs');
var im = require('imagemagick');
var QRCode = require('qrcode');

exports.post = function(req, res, next) {
	var gsData = {
		content_type : req.files.image.headers['content-type'],
		metadata : {
			qrid : req.params.id,
			originalFilename : req.files.image.originalFilename
		}
	};
	var path = req.files.image.path;

	im.resize({
		srcPath : path,
		dstPath : path,
		progressive : false,
		height : 238,
		strip : true,
		filter : 'Lagrange',
		sharpening : 0.2
	}, function(err, stdout, stderr) {
		im.crop({
			srcPath : path,
			dstPath : path,
			width : 238,
			height : 238,
			quality : 1,
			gravity : "Center"
		}, function(err, stdout, stderr) {
			if (err)
				throw err;
			db.gridfs().open(gsData.metadata.qrid, 'w', gsData, function(err, gs) {
				gs.writeFile(path, function(err, gs) {
					fs.unlink(path, function(err) {
						if (err)
							throw err;
						io.sockets.emit('imgid', req.params.id);
						res.redirect(req.url);
					});
				});
			});
		});
	});
};

exports.del = function(req, res) {
	db.gridfs().unlink(req.params.id, function(err, gs) {
		io.sockets.emit('imgid', req.params.id);
		res.json({
			success : false
		});
	});
};

exports.get = function(req, res) {
	db.gridfs().open(req.params.id, 'r', function(err, gs) {
		if (err) {
			QRCode.draw('http://qi.bype.org/u/' + req.params.id, {
				errorCorrectLevel : "high",
				scale : 3
			}, function(err, canvas) {
				var stream = canvas.createPNGStream();
				res.writeHead('200', {
					'Content-Type' : 'image/png',
					'Cache-Control' : 'no-cache, private'
				});
				stream.pipe(res);
			});
		} else {
			gs.read(function(err, reply) {
				if (err)
					res.redirect('http://www.placehold.it/320x320/EFEFEF/AAAAAA');
				else {
					res.writeHead('200', {
						'Content-Type' : gs.contentType,
						'Cache-Control' : 'public, max-age=1800'
					});

					res.end(reply, gs.contentType);
				}
			});
		}
	});
};
