/*
 * GET home page.
 */

var uuid = require('node-uuid');

exports.index = function(req, res) {
	db.set.findOne({
		"sid" : req.params.sid
	}, function(err, data) {
		res.render('index',data);
	});
};

exports.upload = function(req, res) {
	res.render('upload', {
		qrid : req.params.id
	});
};
