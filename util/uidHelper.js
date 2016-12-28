var http = require('http');
//var queryString = require('querystring');

exports.loginByWechat = function(code,callback) {
	postUID('/clduser/login/wechat',{'code':code},null,callback);
}

exports.loginByEmail = function(email,password,callback){
	postUID('/clduser/login/email',{email:email,password:password},null,callback);
}

// exports.registerByEmail = function(email,password,callback){
// 	postUID('/clduser/register',{email:email,password:password},callback);
// }

exports.getProfile = function(userId,callback){
	postUID('/clduser/api/profile/' + userId,{},null,callback);
}

// exports.checkEmailActivated = function(token,callback){
// 	postUID('/clduser/api/activated/email',{token:token},callback);
// }

// exports.activateEmail = function(code,token,callback){
// 	postUID('/clduser/api/activate/email',{activateCode:code,token:token},callback);
// }

// exports.updatePassword = function(password,token,callback){
// 	postUID('/clduser/api/activate/email',{password:password,token:token},callback);
// }

// exports.resetPassword = function(email,callback){
// 	postUID('/clduser/reset/password',{email:email,token:token},callback);
// }

var postUID = function(path,body,token,callback){
	

	var postData = JSON.stringify(body);
	//console.log('postData',postData);
	var options = {
		hostname: 'www.xingyunzh.com',
		  	port: 5566,
		  	path: path,
		  	method: 'POST',
		  	headers: {
		  	  'Content-Type': 'application/json'
		  	}
	};

	if (!!token) {
		options.headers['x-access-token'] = token;
	}

	var req = http.request(options, function(res){
		res.setEncoding('utf8');
		
		res.on('data', function(chunk){

		  	var resJSON = JSON.parse(chunk);
		  	if (resJSON.status == 'E'){
		  		callback(new Error(resJSON.body));
		  	}else{
		  		var resBody = resJSON.body;
		  		resBody.token = null;
		  		callback(null,resJSON.body);
		  	}
		  	
		});
		  
		res.on('end', function(){
		    //console.log('No more data in response.');
		});
	});

	req.on('error', function(e){
	  	console.log('problem with request:',e.message);
	  	callback(e);
	});

	// write data to request body
	req.write(postData);
	req.end();
}





