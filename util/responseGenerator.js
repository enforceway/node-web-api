module.exports = ()=>{
	var responseObj = {
		code: 0, // code是0代表请求在系统上执行成功,是其他字符串代表在系统上执行失败时候推送的失败类型
		ifSuccess: true,  // ifSuccess是true代表请求本身成功，无论是经过了多少个分布式服务器
		msg: "",
		data: null
	};
	return responseObj;
}
