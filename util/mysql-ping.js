var mysql  = require('mysql');  //调用MySQL模块

//创建一个connection

module.exports = () => {
	var connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'root',
		password : '303585amd',
		database : 'hello_contact'
	});
	return connection;
}
