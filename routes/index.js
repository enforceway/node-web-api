var express = require('express');
var router = express.Router();
var dbConnector = require("../util/mysql-ping");
var newResponse = require("../util/responseGenerator");

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
        console.log(results);
	});
	connectInst.end();
});

router.get('/api/getContactById', function(req, res, next) {
	var responseObj = newResponse();
	if(!req.query.id) {
		responseObj.ifSuccess = false;
		// responseObj.code = '';
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


module.exports = router;
