/*
 * GET home page.
 */

var uuid = require('node-uuid');

exports.index = function(req, res) {
	db.set.findOne({
		"sid" : req.params.sid
	}, function(err, data) {
		res.render('index', data);
	});
};

exports.upload = function(req, res) {
	res.render('upload', {
		qrid : req.params.id
	});
};

exports.webcam = function(req, res) {
	res.render('webcam', {
		qrid : req.params.id
	});
};

exports.tag = function(req, res) {
	db.collection('fs.files').find({
		"metadata.tag" : '#' + req.params.tag
	}, {
		filename : 1
	}).toArray(function(err, imgs) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		res.json(imgs);
	});
};
