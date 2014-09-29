//Game setup

var canvas = document.getElementById('Frosch');
var co = canvas.getContext('2d'); // co instead of context!

var w = 500; //width of canvas
var h = w * 1.6; //height of canvas
var oneSquare = w/15;
var position = {"X": 0, "Y": 0};
var score = 0;

//Environment Setup

// 1. Top game info

co.fillStyle = 'black'; //top game info
co.fillRect(0, 0, w, 0.1*h);

// 2. Frog-base
co.fillStyle = 'green'; //frog-home
co.fillRect(0, 0, w, 0.15*h);

// setup the line style
co.strokeStyle = '#000000';
co.lineWidth = 8;
co.lineCap = 'round';

numberOfFrogBases = 5;
for (var i = w/numberOfFrogBases/2; i <= w; i = i + w/numberOfFrogBases) {

	co.arc(i, 0.05 * h, 20, 0, Math.PI, false);
	co.stroke();

}

// 3. Water.

co.fillStyle = 'blue'; //water
co.fillRect(0, 80, w, 0.3*h);

// 4. Median
co.fillStyle = 'green'; //median
co.fillRect(0, 230, 700, 0);

co.fillStyle = "#000000";
co.font = "40px Sans-Serif";
co.textBaseline = "top"; //vertial alignment
co.textAlign = "center";
co.fillText("Welcome to Frogger!!", 350, 80); //positioned on the Median

//5. Street.

co.fillStyle = 'grey'; //the street
co.fillRect(0, 310, 700, 150);

//6. Frog-start
co.fillStyle = 'green'; //frog-start
co.fillRect(0, 460, 700, 200);

//7. Bottom Game info

co.fillStyle = 'black'; //bottom game Info
co.fillRect(0, 0, w, 0.1*h);

// Moving Envioment (Cars, timber)

car = function(color, xCo, yCo) { //pass in in color as '#FFFFF'
	co.fillStyle = color;
	co.fillRect(xCo, yCo, 50, 20);
};

truck = function(color, xCo, yCo) { //pass in in color as '#FFFFF'
	co.fillStyle = color;
	co.fillRect(xCo, yCo, 150, 25);
};
var color = '#8B4513';

timber = function(color, xCo, yCo) {
	co.fillStyle = color;
	co.fillRect(xCo, yCo, 150, 25);
};

car('#ff0000', 20, 390);
truck('#1D61FF', 80, 390);

//Frog capabilities

co.fillStyle = '#44D728'; // the frog itself.
co.fillRect(340, 480, 20, 20);

var frogImage = new Image();
frogImage.onload = function () {
	co.drawImage(frogImage, 350, 250, 30 ,30);
}
frogImage.src = 'frog.png';

placeFrogToStart = function (oneSquare) {

}

jump = function (direction, w) {
}

//ladyFrog

//Technicalities:

function canvasSupport () {
	return Modernizer.canvas;
}