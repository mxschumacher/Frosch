(function() {

	var gameWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) / 2.5;
	var gameHeight = gameWidth * 1.25;
	var scalingFactor = gameWidth / 800; //build for 800px width, actual screen-size via scaling

	var game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, 'game',
		{
			preload: preload,
			create: create,
			update: update
		},
		true);

	var player,
		enemies = {},
		cursors,
		gems,
		score = 0,
		scoreText,
		levelText,
		timeRemainingText,
		world,
		timeRemaining = 60,
		lives = 5,
		level = 1,
		bot,
		lilypads,
		lane = 0;


var gameState = [
	{
	speed: 0.1 * gameWidth,
	enemies: ['truckBug'],
	gems: ['orangeGem'],
	BlockRocks: false,
	spawnFrequency: 5000},
	{
	speed: 0.15 * gameWidth,
	enemies: ['truckBug', 'bot'],
	gems: ['orangeGem'],
	BlockRocks: false,
	spawnFrequency: 4000},
	{
	speed: 0.2 * gameWidth,
	enemies: ['truckBug', 'bot', 'mummy'],
	gems: ['orangeGem', 'blueGem', 'greenGem' ],
	BlockRocks: true,
	spawnFrequency: 3000},
	{
	speed: 0.25 * gameWidth,
	enemies: ['truckBug', 'bot', 'mummy'],
	gems: ['orangeGem', 'blueGem', 'greenGem' ],
	BlockRocks: true,
	spawnFrequency: 2000},
	{
	speed: 0.3 * gameWidth,
	enemies: ['truckBug', 'bot', 'mummy'],
	gems: ['orangeGem', 'blueGem', 'greenGem'],
	BlockRocks: true,
	spawnFrequency: 1000}
	];

	function preload() {

		game.load.image('frog', 'images/char-cat-girl.png');
		game.load.image('truckBug', 'images/enemy-bug.png');
		game.load.image('orangeGem', 'images/Gem Orange.png');
		game.load.image('greenGem', 'images/Gem Green.png');
		game.load.image('blueGem', 'images/Gem Blue.png');
		game.load.image('grass', 'images/grass-block.png');
		game.load.image('heart', 'images/Heart.png');
		game.load.image('stone', 'images/stone-block.png');
		game.load.image('blockRock', 'images/Rock.png');
		game.load.image('water', 'images/water-block.png');
		game.load.image('lilypad', 'images/Selector.png');

		game.load.atlasJSONHash('bot', 'images/running_bot.png', 'images/running_bot.json');
	}


	function create() {

		game.physics.startSystem(Phaser.Physics.ARCADE);

		levelStarter(level);

		function levelStarter(level) {

			portionYStart = gameHeight * 0.02;

			terrain = ['lilypad', 'grass', 'water', 'water', 'grass', 'stone', 'stone', 'grass', 'water', 'water', 'stone'];

			for (lane; lane <= 12; lane++) {

				var positionY = portionYStart + (85 * scalingFactor) * lane; //fixed value of 85 does not work!
				var element = terrain[lane];
				var enemyLanesYCoordinates = [];

				if (element != "lilypad") {
					worldCreator(positionY, element, lane);
				} else {
					lilypadCreator(positionY, element, lane);
				}

				//var enemyLanes = [3,4,7,10];

				//if (lane in enemyLanes) {

				if (lane == 3 || lane == 4 || lane == 7 || lane == 10) {
					console.log("I get triggered, current value of lane: " + lane);
					console.log("The value of positionY is: " + positionY);
					enemyLanesYCoordinates.push(positionY);
				}
			}

			function worldCreator(positionY, element, lane) {

				var loopCounter = 0;
				var positionX = 0;

				var widthOfOneTile = gameWidth / 8;

				var scalingfactorOfTiles = widthOfOneTile / 101;

				for (loopCounter; loopCounter <= 7; loopCounter++) {

					var piece = game.add.sprite(positionX, positionY, element);
					piece.scale.set(scalingfactorOfTiles);
					positionX = positionX + widthOfOneTile;

					if ((lane == 5 || lane == 8) && loopCounter == 7) {
						randomRockPlacer(positionY);
					}
					if ((lane = 4 || lane == 7) && loopCounter == 7) {
						enemyCreator(gameState[level][enemies]);
					}
				}

				if (gameState[level]["BlockRocks"] == true) {

					randomRockPlacer = function (positionY) {

						world = game.add.group();
						world.enableBody = true;
						var rockBarrier = world.create(game.world.randomX, positionY, 'blockRock');
						rockBarrier.scale.set(scalingFactor);
						rockBarrier.body.immovable = true;

					}

				}
				randomRockPlacer = function (positionY) {
				}
			}

			function lilypadCreator() {

				var loopCounter = 0;
				var positionX = 0;

				var widthOfOneTile = gameWidth / 8;

				var scalingfactorOfTiles = widthOfOneTile / 101;

				lilypads = game.add.group();
				lilypads.enabledBody = true;

				for (loopCounter; loopCounter <= 7; loopCounter++) {

					var lilypad = lilypads.create(positionX, positionY, element);

					lilypad.scale.set(scalingfactorOfTiles);
					positionX = positionX + widthOfOneTile;

				}
			}

			RandomGemPlacer();

			function RandomGemPlacer() {

				gems = game.add.group();
				gems.enabledBody = true;

				var gem = gems.create(game.world.randomX, game.world.randomY, 'orangeGem');
				gem.scale.set(scalingFactor * 0.8);

			}

			scoreText = game.add.text(16, 16, 'score: 0', {fontSize: '32px', fill: '#000'});
			levelText = game.add.text(16, 40, 'level: 1', {fontSize: '32px', fill: '#000'});

			timeRemainingText = game.add.text(16, 70, 'Time ' + timeRemaining, {fontSize: '32px', fill: '#000'});

			var loop = game.time.events.loop(Phaser.Timer.SECOND, updateCounter, this);

			function updateCounter() {
				if (timeRemaining > 0) {
					timeRemaining -= 1;
				} else {
					// gameOver();
				}

				timeRemainingText.text = 'Time ' + timeRemaining;
			}

			//the player

			player = game.add.sprite(350, 750, 'frog');
			player.scale.set(scalingFactor);
			game.physics.arcade.enable(player);
			player.body.collideWorldBounds = true;

			//frog lives

			var heartLoops = 0;
			var heartx = 0.87 * gameWidth;

			for (heartLoops; heartLoops < lives; heartLoops++) {

				displayLives(heartx);
				heartx = heartx - 50;
			}

			function displayLives(heartx) {
				heart = game.add.sprite(heartx, 5, 'heart');
				heart.scale.set(scalingFactor * 0.7);

			}

			console.log("The enemyLanesYCoordinate-array in full: " + enemyLanesYCoordinates);
			enemyCreator(enemyLanesYCoordinates[0], gameState[level]['enemies'][0], gameState[level]['speed'], 'left');
			console.log("Value of first position in array " + enemyLanesYCoordinates[0]);
			enemyCreator(enemyLanesYCoordinates[1], gameState[level]['enemies'][1], gameState[level]['speed'], 'right');
			console.log(enemyLanesYCoordinates[1]);
			enemyCreator(enemyLanesYCoordinates[2], gameState[level]['enemies'][1], gameState[level]['speed'], 'left');
			enemyCreator(enemyLanesYCoordinates[3], gameState[level]['enemies'][0], gameState[level]['speed'], 'right');

			function enemyCreator(positionY, enemy, speed, spawnside) {

				enemies = game.add.group();
				enemies.enableBody = true;

				if (spawnside == 'right') {

					var rightAttacker = enemies.create((gameWidth + 100), positionY, enemy);
					rightAttacker.enabledBody = true;
					rightAttacker.body.velocity.x = -speed;
					rightAttacker.scale.set(scalingFactor);

					if (enemy == 'bot') {
						botAnimator(rightAttacker);
					}

				} else {

					var leftAttacker = enemies.create(-100, positionY, enemy);
					leftAttacker.enabledBody = true;
					leftAttacker.body.velocity.x = speed;
					leftAttacker.scale.set(scalingFactor);

					if (enemy == 'bot') {

						botAnimator(leftAttacker);
					}
				}
			}

			function botAnimator(Attacker) {
				Attacker.animations.add('run');
				Attacker.animations.play('run', 15, true);
			}
		}
	}
	function update() {

		//player controls

		cursors = game.input.keyboard.createCursorKeys();

		var movingVelocity = gameWidth / 2;

		player.body.velocity = {x: 0, y: 0};

		var direction = player.body.velocity;

		if (cursors.left.isDown) {
			direction.x = -movingVelocity;
		}
		else if (cursors.right.isDown) {
			direction.x = movingVelocity;
		}
		else if (cursors.up.isDown) {
			direction.y = -movingVelocity;
		}
		else if (cursors.down.isDown) {
			direction.y = movingVelocity;
		}

		function collision(collisionObject1, collisionObject2) {

			game.physics.arcade.collide(collisionObject1, collisionObject2);

		}

		collision(player, world);
		collision(player, enemies);

		game.physics.arcade.enable(enemies);
		game.physics.arcade.overlap(player, enemies, death);

		game.physics.arcade.enable(gems);
		game.physics.arcade.overlap(player, gems, collectGem);


		game.physics.arcade.enable(lilypads);
		game.physics.arcade.overlap(player, lilypads, levelSuccess);

		function collectGem(player, gems) {

			gems.kill();

			score += 100;
			scoreText.text = 'Score: ' + score;
		}

		function death(player, enemies) {

			lives -= 1;
		}

		function levelSuccess(player, lilypads) {

			level += 1;
			levelText.text = 'Level: ' + level;
		}
	}
})();