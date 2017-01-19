
var cardCountOfLevel = [0,1,6,18,48,100];

//var cardCountOfLevel = [1,2,3,4,5,6];

function getLevelByCount(count){

	for (var i = cardCountOfLevel.length - 1; i >= 0; i--) {
		if(count >= cardCountOfLevel[i]){
			return i;
		}
	}

	return 0;
}

function getRequiredCardCount(count){

	var level = getLevelByCount(count);

	if (level < 5) {
		return cardCountOfLevel[level + 1] - count;
	}else{
		return 0;
	}

}

