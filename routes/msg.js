db.bind('msg');

exports.newTxt = function(req, res) {
	req.body['date'] = new Date();
	db.msg.insert(req.body, function(err, data) {
		global.io.sockets.emit('newtxt', req.body.txt);
		res.json(req.body);
	});
};

exports.getTxt = function(req, res) {
	db.msg.find({
		"$query" : {},
		"$orderby" : {
			"date" : -1
		}
	}, {
		"txt" : 1,
		"date" : 1
	}).toArray(function(err, msgs) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		res.json(msgs);
	});
};

exports.delTxt = function(req, res) {
	db.msg.remove({
		"_id" : new db.msg.ObjectID(req.params.id)
	}, function(err) {
		res.redirect('/admin/txts');
	});
};
