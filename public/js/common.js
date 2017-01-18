//var cardCountOfLevel = [1,4,10,20,50,100];

var cardCountOfLevel = [1,2,3,4,5,6];

function getLevelByCount(count){

	var level = 0;

	for (var i = cardCountOfLevel.length - 1; i >= 0; i--) {
		if(count >= cardCountOfLevel[i]){
			level = i;
			break;
		}
	}

	return level;
}

function getRequiredCardCount(count){
	if (count > cardCountOfLevel[cardCountOfLevel.length]) {
		return 0;
	}
	
	for (var i = cardCountOfLevel.length - 1; i >= 0; i--) {
		if(count >= cardCountOfLevel[i]){
			return	cardCountOfLevel[i+1] - count;	
		}
	}

	return cardCountOfLevel[0] - count;
}

