var mygame;
var width = 400;
var height = 400;
var snakesize = 3;
var level = 1;
var bodysize = 10;

var xcoordinateofbody = new Array(20, 20 - bodysize, 20 - 2 * bodysize);
var ycoordinateofbody = new Array(20, 20, 20);
var xmovement = new Array(1,1,1);
var ymovement = new Array(0,0,0);

var instructions;
var xfood;
var yfood;
var score = 0;
var scorecontext;
var nom = true;
var endgame = false;

function makeboard(){
	mygame.shadowBlur=20;
	mygame.shadowColor="black";
	mygame.lineWidth= 5;
	mygame.fillStyle="#C0C0C0";
	mygame.fillRect(0,0,width,height);
	mygame.fill();
	mygame.strokeStyle="#000080";
	mygame.strokeRect(0,0,width,height);
}

function snakeposition(x,y){
	mygame.shadowBlur= 0;
	mygame.lineWidth = 1;
	mygame.fillStyle = "#000";
	mygame.fillRect(x,y,bodysize,bodysize);
	mygame.fill();
	mygame.strokeStyle="#000080";
	mygame.strokeRect(x,y,bodysize,bodysize);
}

function makesnake(){
	for (var n = 0; n < snakesize; n++)
		snakeposition(xcoordinateofbody[n],ycoordinateofbody[n]);
}

function makefood(){
	if(nom){
		xfood = Math.floor(width * Math.random()/bodysize) * bodysize;
		yfood = Math.floor(height * Math.random()/bodysize) * bodysize;
		if (checkhit(xfood, yfood))
			makefood();
		else nom = false;
	}
	snakeposition(xfood, yfood)
}

function gameloop(){
	mygame = document.getElementById("myart").getContext("2d");
	makeboard();
	makesnake();
	replenish = setTimeout(gamemovementloop, 100);
	scorecontext = document.getElementById("thescore");
	instructions = document.getElementById("instruction");
	window.onkeydown = keycontrol;
}
window.addEventListener("load", gameloop, true);

function keycontrol(k){
	if ((k.keyCode == 37 || k.keyCode == 65) && xmovement[0] != 1){
		xmovement[0] = -1;
		ymovement[0] = 0;
	}
	else if ((k.keyCode == 38 || k.keyCode == 87) && ymovement[0] != 1){
		xmovement[0] = 0;
		ymovement[0] = -1;
	}
	else if ((k.keyCode == 39 || k.keyCode == 68)  && xmovement[0] != -1){
		xmovement[0] = 1;
		ymovement[0] = 0;
	}
	else if ((k.keyCode == 40 || k.keyCode == 83) && ymovement[0] != -1){
		xmovement[0] = 0;
		ymovement[0] = 1;
	}
	else if (k.keyCode == 81 && endgame == true){
		endgame = false;
		tryagain()
	}
}

function snakemotion(){
	for (var n = 0; n < snakesize; n++){
		xcoordinateofbody[n] += (xmovement[n]*bodysize);
		ycoordinateofbody[n] += (ymovement[n]*bodysize);
	}
	for (var n = snakesize-1; n>0; n--){
		xmovement[n] = xmovement[n-1];
		ymovement[n] = ymovement[n-1];
	}
	eatfood();
}

function clearit(){
	mygame.clearRect(0,0,width,height);
}

function eatfood(){
	if(xcoordinateofbody[0] == xfood && ycoordinateofbody[0] == yfood){
		nom = true;

		var xtail = xcoordinateofbody[snakesize-1]-xmovement[snakesize-1]*bodysize;
		var ytail = ycoordinateofbody[snakesize-1]-ymovement[snakesize-1]*bodysize;

		xcoordinateofbody.push(xtail);
		ycoordinateofbody.push(ytail);

		xmovement.push(xmovement[snakesize - 1]);
		ymovement.push(ymovement[snakesize - 1]);

		snakesize++;
		score += 100;
		if((score%1000) == 0)
			level++;
		scorecontext.innerHTML = "Score: "
		+score+"	Level: "+level;
	}
}

function checkhit(x, y){
	for (var n = 0; n < snakesize; n++)
		if(x == xcoordinateofbody[n] && y == ycoordinateofbody[n]){
			return true;
		}
		return false;
}

function crashintobody(x, y){
	for (var n = 4; n < snakesize; n++)
		if (x == xcoordinateofbody[n] && y == ycoordinateofbody[n]){
			return true;
		}
		return false;
}

function hitsomething(){
	if(xcoordinateofbody[0] >= width || xcoordinateofbody[0] < 0 || 
		ycoordinateofbody[0] < 0 || ycoordinateofbody[0] >= height){
		scorecontext.innerHTML = "Score: "
		+score+"	Level: "	+level+" You lose!";
		instructions.innerHTML = "Push \"r\" to play again";
		endgame = true;
		clearTimeout(replenish);
	}
	else if(snakesize > 4){
		if(crashintobody(xcoordinateofbody[0], ycoordinateofbody[0])){
			scorecontext.innerHTML = "Score: "
			+score+"	Level: "	+level+" You lose!";
			instructions.innerHTML = "Push \"r\" to play again";
			endgame = true;
			clearTimeout(replenish);
		}
	}
}

function gamemovementloop(){
	replenish = setTimeout(gamemovementloop, 1000/(6*level));
	clearit();
	makeboard();
	makefood();
	snakemotion();
	hitsomething();
	makesnake();
}

function tryagain(){
	xcoordinateofbody = new Array(20, 20 - bodysize, 20 - 2 * bodysize);
	ycoordinateofbody = new Array(20, 20, 20);
	xmovement = new Array(1,1,1);
	ymovement = new Array(0,0,0);
	snakesize = 3;
	score = 0;
	level = 1;
	nom = true;
	scorecontext.innerHTML = "Score: " +score+"		level:"+level;
	instructions.innerHTML = "Controls: k = up, h = left, j = down, l = right ";
	replenish = setTimeout(gamemovementloop, 1000/6);
}
