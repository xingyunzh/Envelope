module.exports = CamproError;

function CamproError(msg){
	this.customMsg = msg;
}

CamproError.prototype = new Error();
