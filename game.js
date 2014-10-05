var gameWidth = 600; //build for 800, actual screen-size via scaling..
var gameHeight = gameWidth * 2;
var scalingFactor = gameWidth/800;

var game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, 'game',
	{ preload: preload,
	  create: create,
	  update: update },
	  true);

var player;
var enemies = {};
var cursors;
var body;
var gems;
var score = 0;
var scoreText;
var world;
var timeRemaining = 60;
var lives = 5;
var bot;
var layer = 1;

function preload() {

	game.load.image('frog','images/char-cat-girl.png'); //preliminary image, main character
	game.load.image('truckBug','images/enemy-bug.png'); //kills on collision, mortal enemy.
	game.load.image('orangeGem','images/Gem Orange.png'); //goodies for the frog
	game.load.image('grass','images/grass-block.png');
	game.load.image('heart','images/Heart.png'); //frog lives
	game.load.image('stone','images/stone-block.png'); //for the starting point
	game.load.image('blockRock','images/Rock.png'); //variation of the game -> blocks the way.
	game.load.image('water','images/water-block.png');
	game.load.image('lilypad','images/Selector.png');
	game.load.atlasJSONHash('bot', 'images/running_bot.png', 'images/running_bot.json');
}

function create() {

	game.physics.startSystem(Phaser.Physics.ARCADE);

	// Creation of the map

	portionYStart = gameHeight * 0.07;
	terrain = ['lilypad','grass', 'water', 'water', 'grass', 'stone', 'stone', 'grass', 'water', 'water', 'stone'];

	for (layer; layer <=12; layer++) {

		var positionY = portionYStart + 65 * layer;
		var element = terrain[layer - 1];

		worldCreator(positionY, element, layer);

	}

	function worldCreator(positionY, element, layer) {

		var loopCounter = 0;
		var positionX = 0;

		var widthOfOneTile = gameWidth / 8;
		var scalingfactorOfTiles = widthOfOneTile / 101;

		for (loopCounter; loopCounter <= 7; loopCounter++) {

			var piece = game.add.sprite(positionX, positionY, element);
			piece.scale.set(scalingfactorOfTiles);
			positionX = positionX + widthOfOneTile;

			if ((layer == 5 || layer ==8) && loopCounter == 7) {
				randomRockPlacer(positionY, layer);
			}
		}

		function randomRockPlacer(positionY) {

			world = game.add.group();
			world.enableBody = true;
			var rockBarrier = world.create(game.world.randomX, positionY, 'blockRock');
			rockBarrier.scale.set(scalingFactor);
			rockBarrier.body.immovable = true;

		}
	}

	RandomGemPlacer();

	function RandomGemPlacer() {

		gems = game.add.group();
		gems.enabledBody = true;

		var gem = gems.create(game.world.randomX, game.world.randomY, 'orangeGem');
		gem.scale.set(scalingFactor * 0.8);
	}

	game.physics.startSystem(Phaser.Physics.ARCADE);

	scoreText = game.add.text(16, 16, 'score: 0', {fontSize: '32px', fill: '#000'});
	timeRemaining = game.add.text(250, 16, 'Time remaining: 60', {fontSize: '32px', fill: '#000'});

	//the player

	player = game.add.sprite(350, 750, 'frog');
	player.scale.set(scalingFactor);
	game.physics.arcade.enable(player);
	player.body.collideWorldBounds = true;

	//frog lives

	var heartLoops = 0;
	var heartx = 0.65 * gameWidth;

	for (heartLoops; heartLoops < lives; heartLoops++) {

		displayLives(heartx);
		heartx = heartx - 50;
	}

	function displayLives(heartx) {
		heart = game.add.sprite(heartx, 100, 'heart');
		heart.scale.set(scalingFactor * 0.7);

	}

	//ROBOTATTACK!!!

	enemyBotCreator(400, 'bot', 200, 'right');
	enemyCreator(300, 'truckBug', 300, 'left');
	game.physics.arcade.enable(enemies);

	function enemyBotCreator(layer, enemy, speed, spawnside) {

		if (spawnside == 'right') {
			game.add.sprite(gameWidth + 100, layer, enemy);
			enemies.body.velocity.x = -speed;
			enemies.animations.add('run');
			enemies.animations.play('run', 15, true);
		}
		else {
			game.add.sprite(-100, layer, enemy);
			enemies.body.velocity.x = speed;
			enemies.animations.add('run');
			enemies.animations.play('run', 15, true);
		}

		enemies.scale.set(scalingFactor);
	}

	function enemyCreator(layer, enemy, speed, spawnside) {

		if (spawnside == 'right') {
			enemies = game.add.sprite(gameWidth + 100, layer, enemy);
			enemies.body.velocity.x = -speed;
		}
		else {
			enemies = game.add.sprite(-100, layer, speed, enemy);
			enemies.body.velocity.x = speed;
		}

		enemies.scale.set(scalingFactor);
	}
}

function update() {

	cursors = game.input.keyboard.createCursorKeys();
	var movingVelocity = 250;

	player.body.velocity.x = 0;
	player.body.velocity.y = 0;

	if (cursors.left.isDown) {

		player.body.velocity.x = -movingVelocity;
		//player.animations.play('jump');

	} else if (cursors.right.isDown) {

		player.body.velocity.x = movingVelocity;
		//here's the code for the missing animation
		//player.animations.play('jump');

	} else if (cursors.up.isDown) {

		player.body.velocity.y = -movingVelocity;

	} else if (cursors.down.isDown) {

		player.body.velocity.y = movingVelocity;

	} else {

		player.animations.stop();
	}

	game.physics.arcade.collide(player, world);
	game.physics.arcade.collide(player, enemies);
	game.physics.arcade.collide(player, gems);

	game.physics.arcade.overlap(player, gems, collectGem); //where are player and gems defined?

	function collectGem(player, gems) {

		gems.kill();

		score += 100;
		scoreText.text = 'Score: ' + score;
	}

}