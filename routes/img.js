var fs = require('fs');
var im = require('imagemagick');
var QRCode = require('qrcode');

exports.post = function(req, res, next) {
	function saveImg(path, gsData) {
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
							io.sockets.emit('imgid', {
								id : req.params.id,
								tag : req.body.tag
							});
							res.redirect(req.url);
						});
					});
				});
			});
		});
	}

	var gsData = {
		metadata : {
			qrid : req.params.id,
			tag : req.body.tag
		}
	};
	var path;

	if (req.body.imgBase64) {
		path = '/tmp/' + req.params.id + '.png';
		var base64Data = req.body.imgBase64.replace(/^data:image\/png;base64,/, "");
		fs.writeFile(path, base64Data, 'base64', function(err) {
			if (err) {
				console.log(err);
			} else {
				console.log("The file was saved!");
				saveImg(path, gsData);
			}
		});
	} else {
		gsData.content_type = req.files.image.headers['content-type'];
		gsData.metadata.originalFilename = req.files.image.originalFilename;
		var path = req.files.image.path;
		saveImg(path, gsData);
	}
};

exports.del = function(req, res) {
	db.gridfs().unlink(req.params.id, function(err, gs) {
		io.sockets.emit('imgid', {
			id : req.params.id,
			del : true
		});
		res.json({
			success : false
		});
	});
};

exports.get = function(req, res) {
	db.gridfs().open(req.params.id, 'r', function(err, gs) {
		if (err) {
			QRCode.draw('http://qi.bype.org/w/' + req.params.id, {
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
