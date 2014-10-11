(function() {

	var gameWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) / 2;
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
		world,
		timeRemaining = 60,
		lives = 5,
		bot,
		lane = 0;

	levels = {
		one: {
			speed: 0.1 * gameWidth,
			enemies: [bug],
			gems: [yellow ]
		},
		two: {
			speed: 0.15 * gameWidth,
			enemies: [bug, bot],
			gems: [yellow, blue]
		},
		three: {
			speed: 0.2 * gameWidth,
			enemies: [bug, bot, mummy],
			gems: [yellow, blue, green ]
		},
		four: {
			speed: 0.25 * gameWidth,
			enemies: [bug, bot, mummy],
			gems: [yellow, blue, green ]
		},
		five: {
			speed: 0.3 * gameWidth,
			enemies: [bug, bot, mummy],
			gems: [yellow, blue, green]
		}
	};

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

		portionYStart = gameHeight * 0.02;

		terrain = ['lilypad', 'grass', 'water', 'water', 'grass', 'stone', 'stone', 'grass', 'water', 'water', 'stone'];

		for (lane; lane <= 12; lane++) {

			var positionY = portionYStart + (85 * scalingFactor) * lane;
			var element = terrain[lane];

			worldCreator(positionY, element, lane);
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
			}

			randomRockPlacer = function (positionY) {

				world = game.add.group();
				world.enableBody = true;
				var rockBarrier = world.create(game.world.randomX, positionY - 0.02 * gameHeight, 'blockRock');
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

			scoreText = game.add.text(16, 16, 'score: 0', {fontSize: '32px', fill: '#000'});
			timeRemaining = game.add.text(250, 16, 'Time remaining: 60', {fontSize: '32px', fill: '#000'});

			//the player

			player = game.add.sprite(350, 750, 'frog');
			player.scale.set(scalingFactor);
			game.physics.arcade.enable(player);
			player.body.collideWorldBounds = true;

			//frog lives

			var heartLoops = 0;
			var heartx = 0.8 * gameWidth;

			for (heartLoops; heartLoops < lives; heartLoops++) {

				displayLives(heartx);
				heartx = heartx - 50;
			}

			function displayLives(heartx) {
				heart = game.add.sprite(heartx, 100, 'heart');
				heart.scale.set(scalingFactor * 0.7);

			}

		}

		enemyCreator(300, 'truckBug', 100, 'left');
		enemyCreator(100, 'truckBug', 100, 'right');
		enemyCreator(400, 'bot', 100, 'left');
		enemyCreator(150, 'bot', 100, 'right');

		function enemyCreator(layer, enemy, speed, spawnside) {

			enemies = game.add.group();
			enemies.enableBody = true;

				if (spawnside == 'right') {

					var rightAttacker = enemies.create((gameWidth + 100), layer, enemy);
					rightAttacker.enabledBody = true;
					rightAttacker.body.velocity.x = -speed;
					rightAttacker.scale.set(scalingFactor);



					if (enemy == 'bot') {
						botAnimator();
					}
				} else {

					var leftAttacker = enemies.create(-100, layer, enemy);
					leftAttacker.enabledBody = true;
					leftAttacker.body.velocity.x = speed;
					leftAttacker.scale.set(scalingFactor);

					if (enemy == 'bot') {
						botAnimator();
					}
				}
		}

		function botAnimator() {
			enemies.animations.add('run');
			enemies.animations.play('run', 15, true);
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

		function collectGem(player, gems) {

			gems.kill();

			score += 100;
			scoreText.text = 'Score: ' + score;
		}

		function death(player, enemies) {

			lives -= 1;
		}

	}
})();