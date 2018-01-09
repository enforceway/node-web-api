var express = require('express');
var router = express.Router();
var dbConnector = require("../util/mysql-ping");

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.post('/api/getContactList', function(req, res, next) {
	var connectInst = dbConnector();
	connectInst.connect();
	connectInst.query('select id, name, mobile_number from contacts', function(error, results, fields) {
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

module.exports = router;
