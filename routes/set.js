var uuid = require('node-uuid');

db.bind('set');

exports.gen = function(req, res) {
	db.set.remove({
		"sid" : req.params.sid
	}, function(err, data) {
		var ids = new Array();
		for (var idx = 0; idx < req.params.count; idx++) {
			ids.push(uuid.v4());
		}
		var doc = {
			sid : req.params.sid,
			"ids" : ids
		};
		db.set.save(doc, function(err1, newset) {
			newset.success = true;
			res.json(newset);
		});
	});
};

exports.del = function(req, res) {
	db.set.findOne({
		"sid" : req.params.sid
	}, function(err, data) {
		var len = data.ids.length;
		for (var i = 0; i < len; i++) {
			(function(id) {
				db.gridfs().unlink(id, function(err, gs) {
					io.sockets.emit('imgid', id);
				});
			})(data.ids[i]);
		}
		db.set.remove({
			"sid" : req.params.sid
		}, function(err, data) {
			res.json(data);
		});
	});
};

exports.get = function(req, res) {
	db.set.findOne({
		"sid" : req.params.sid
	}, function(err, data) {
		if (err)
			res.json({
				success : false
			});
		res.json(data);
	});
};
