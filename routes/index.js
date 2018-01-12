var express = require('express');
var router = express.Router();
var dbConnector = require("../util/mysql-ping");
var newResponse = require("../util/responseGenerator");
var request = require('request');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/api/getContactList', function(req, res, next) {
	var connectInst = dbConnector();
	connectInst.connect();
	connectInst.query('select id, name, mobile_number from contact_t', function(error, results, fields) {
		var responseObj = {
			code: 0,
			msg: "",
			data: null
		};
		if(error) {
			responseObj.code = 1;
			responseObj.msg = error;
			res.json(responseObj);
			return;
        }


        responseObj.data = results;
        res.json(responseObj);
	});
	connectInst.end();
});

router.get('/api/getContactById', function(req, res, next) {
	var responseObj = newResponse();
	if(!req.query.id) {
		responseObj.msg = "缺少参数";
		responseObj.code = 1;
		res.json(responseObj);
		return;
	}

	var connectInst = dbConnector();
	connectInst.connect();
	connectInst.query('select id, name, mobile_number, address, email, birthday, description from contact_t where id = ?',[req.query.id], function(error, results, fields) {
		if(error) {
			responseObj.ifSuccess = false;
			responseObj.msg = error;
			res.json(responseObj);
			return;
        }
        if(results.length == 1) {
        	responseObj.data = results[0];	
        }
        res.json(responseObj);
	});
	connectInst.end();
});

router.post('/api/updateContact', function(req, res, next) {
	var responseObj = newResponse();
	// console.log("updateContact:", req.body, req.params, req.param);
	if(!req.body.id) {
		responseObj.code = 1;
		responseObj.msg = "缺少参数";
		res.json(responseObj);
		return;
	}

	var connectInst = dbConnector();
	connectInst.connect();
	connectInst.query('update contact_t set name = ?, mobile_number = ?, address = ?, email = ?, description = ? where id = ?',
					[req.body.name, req.body.mobile_number, req.body.address, req.body.email, req.body.description, req.body.id], function(error, results, fields) {
		if(error) {
			responseObj.ifSuccess = false;
			responseObj.msg = error;
			res.json(responseObj);
			return;
        }
        if(results.changedRows != 1) {
        	responseObj.code == 1; // 对应的id不存在对应的数据
        }
        res.json(responseObj);
	});
	connectInst.end();
});

router.post('/api/addContact', function(req, res, next) {
	var responseObj = newResponse();
	var connectInst = dbConnector();
	connectInst.connect();
	connectInst.query('insert into contact_t(name, mobile_number, address, email, description) values(?,?,?,?,?)',
					[req.body.name, req.body.mobile_number, req.body.address, req.body.email, req.body.description, req.body.id], function(error, results, fields) {
		if(error) {
			responseObj.code = 1;
			responseObj.msg = error;
			res.json(responseObj);
			return;
        }
        if(results.affectedRows == 0) {
        	responseObj.code == 1;
        }
        if(results.insertId) {
        	responseObj.data = {id: results.insertId};
        }
        res.json(responseObj);
	});
	connectInst.end();
});
// 收藏的联系人接口
router.post('/api/setFavorite', function(req, res, next) {
	var responseObj = newResponse();
	var connectInst = dbConnector();
	connectInst.connect();

	if(!req.body.contactId) {
		responseObj.code = 1;
		responseObj.msg = "缺少参数";
		res.json(responseObj);
		return;
	}
	var sql = 'select id, contact_id, if_like from favorite_contact_t where contact_id = ?';
	var pendoParam;
	connectInst.query(sql, [req.body.contactId], function(error, results, fields) {
		if(error) {
			responseObj.code = 1;
			responseObj.msg = error;
			res.json(responseObj);
			return;
        }
        if(results.length == 1) {
        	// 更新联系人收藏
        	responseObj.data = results[0];
        	responseObj.data.if_like = 1 ^ responseObj.data.if_like;
        	sql = 'update favorite_contact_t set if_like = ? where id = ?';
        	pendoParam = [responseObj.data.if_like, responseObj.data.id];
        } else {
        	// 新增收藏联系人
			sql = 'insert into favorite_contact_t(contact_id, if_like) values(?,?)';
			pendoParam = [req.body.contactId, 1];
        }
		connectInst.query(sql, pendoParam, function(error, results, fields) {
			if(error) {
				responseObj.code = 1;
				responseObj.msg = error;
				res.json(responseObj);
				return;
	        }
	        //{"fieldCount":0,"affectedRows":1,"insertId":0,"serverStatus":2,"warningCount":0,"message":"(Rows matched: 1  Changed: 1  Warnings: 0","protocol41":true,"changedRows":1}
	        if(results.insertId) {
	        	responseObj.data = {id: results.insertId, if_like: 1};
	        } else if(results.changedRows == 1) {
	        	responseObj.data = {id: req.body.contactId, if_like: responseObj.data.if_like};
	        } else {
	        	responseObj.data = null;
	        	responseObj.code == 1;
	        	responseObj.msg = "数据核对不齐";
	        }
	        res.json(responseObj);
		});
		connectInst.end();
	});
});

// 收藏的联系人接口
router.get('/api/getContactWithLikes', function(req, res, next) {
	var responseObj = newResponse();
	var connectInst = dbConnector();
	connectInst.connect();

	if(!req.query.id) {
		responseObj.code = 1;
		responseObj.msg = "缺少参数";
		res.json(responseObj);
		return;
	}
	var sql = 'select contact_t.id, contact_t.mobile_number, contact_t.name, contact_t.address, contact_t.email, contact_t.birthday, favorite_contact_t.if_like ' + 
				'from hello_contact.contact_t left join hello_contact.favorite_contact_t ' + 
				'on favorite_contact_t.contact_id = contact_t.id where contact_t.id = ?';
	connectInst.query(sql, [req.query.id], function(error, results, fields) {
		if(error) {
			responseObj.code = 1;
			responseObj.msg = error;
			res.json(responseObj);
			return;
        }
        if(results.length == 1) {
        	responseObj.data = results[0]
        	// 更新联系人收藏
        }
        res.json(responseObj);
	});
	connectInst.end();
});

module.exports = router;