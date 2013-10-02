/*
 * GET home page.
 */

var uuid = require('node-uuid');


exports.index = function(req, res) {
	res.redirect('/img/' + uuid.v1());
};

exports.upload = function(req, res) {
	res.render('upload', {
		qrid : req.params.id
	});
};
