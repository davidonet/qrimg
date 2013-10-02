var fs = require('fs');
var im = require('imagemagick');
var mongo = require('mongoskin');
var db = mongo.db("mongodb://dbserver/qrimg", {
	safe : false
})

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
		height : 320,
		strip : true,
		filter : 'Lagrange',
		sharpening : 0.2
	}, function(err, stdout, stderr) {
		if (err)
			throw err;
		db.gridfs().open(gsData.metadata.qrid, 'w', gsData, function(err, gs) {
			gs.writeFile(path, function(err, gs) {
				fs.unlink(path, function(err) {
					if (err)
						throw err;
					res.redirect(req.url);
				});
			});
		});

	});
};

exports.get = function(req, res, next) {
	db.gridfs().open(req.params.id, 'r', function(err, gs) {
		gs.read(function(err, reply) {
			if (err)
				next(err);
			else {
				res.writeHead('200', {
					'Content-Type' : gs.contentType,
					'Cache-Control' : 'public, max-age= 10'
				});
				res.end(reply, gs.contentType);
			}
		});
	});
};
