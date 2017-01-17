var cardCountOfLevel = [1,4,10,20,50,100];

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

	if (count < 1) {
		return 1;
	}
	
	for (var i = cardCountOfLevel.length - 1; i >= 0; i--) {
		if(count >= cardCountOfLevel[i]){
			return	cardCountOfLevel[i+1] - count;	
		}
	}
}
