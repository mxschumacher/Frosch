var game = new Phaser.Game(800, 900, Phaser.AUTO, 'game',
	{ preload: preload,
	  create: create,
	  update: update,
	  render: render}, true);

var player;
var enemies;
var cursors;
var body;
var gems;
var score = 0;
var scoreText;
var world;
var timeRemaining = 60;
var lives = 5;

function preload() {

	//solve this with sprite / atlas for cleaner code and more performance.

	game.load.image('frog','images/char-boy.png'); //preliminary image, main character
	game.load.image('truckBug','images/enemy-bug.png'); //kills on collision, mortal enemy.
	game.load.image('orangeGem','images/Gem Orange.png'); //goodies for the frog
	game.load.image('grass','images/grass-block.png');
	game.load.image('heart','images/Heart.png'); //frog lives
	game.load.image('stone','images/stone-block.png'); //for the starting point
	game.load.image('blockRock','images/Rock.png'); //variation of the game -> blocks the way.
	game.load.image('water','images/water-block.png');

	/**
	 still needed: more enemies on land
	 enemies in the water,
	 lilypads(goals)
	 objects/creatures to float on
	 */

	//game.load.spritesheet('','', x,y); can be used to open a spritesheet
}

function create() {

	//the world

	worldCreator(200, 'grass');
	worldCreator(300, 'water');
	worldCreator(400, 'water');
	worldCreator(500, 'grass');
	worldCreator(600, 'water');
	worldCreator(700, 'water');
	worldCreator(800, 'stone');

	//What other physics engines could be more appropriate?

	game.physics.startSystem(Phaser.Physics.ARCADE);

	//groups can be used to check collision between them.

	world = game.add.group();
	world.enableBody = true ; //objects within platforms have physics enabled.

	scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
	timeRemaining = game.add.text(250, 16, 'Time remaining: 60', { fontSize: '32px', fill: '#000' });

	//how to create several of those?

	var rockBarrier = world.create(500,475, 'blockRock');
	rockBarrier.body.immovable = true;

	function worldCreator(positiony, element) {

		var i = 0;
		x = 0;

		for ( i; i<=7 ;i++ ) {
			game.add.sprite(x, positiony, element);
			x = x + 100;
		}
	}



	//the player

	player = game.add.sprite(350,750,'frog');
	game.physics.arcade.enable(player);
	player.body.collideWorldBounds = true;

	//frog lives

	var i = 0;
	var heartx = 680;

	for ( i; i < lives; i++ ) {

		displayLives(heartx);
		heartx = heartx - 70;
	}

	function displayLives (heartx) {
		game.add.sprite(heartx, 100, 'heart');
	}

	//appropriate jumping sprite needed. 'jump is the name of the animation.'
	//player.animations.add('jump',[0,1,2,3], 4, true);

	//the enemies

	var enemy1 = game.add.sprite(900, 300, 'truckBug');
	var enemy2 = game.add.sprite(900, 400, 'truckBug');
	var enemy3 = game.add.sprite(-100, 600, 'truckBug');
	var enemy4 = game.add.sprite(-100, 700, 'truckBug');

	game.physics.enable(enemy1, Phaser.Physics.ARCADE);
	game.physics.enable(enemy2, Phaser.Physics.ARCADE);
	game.physics.enable(enemy3, Phaser.Physics.ARCADE);
	game.physics.enable(enemy4, Phaser.Physics.ARCADE);

	enemy1.body.velocity.x=-150;
	enemy2.body.velocity.x=-150;
	enemy3.body.velocity.x=150;
	enemy4.body.velocity.x=150;

	//game controls

	cursors = game.input.keyboard.createCursorKeys();

	//collect the gem.

	gems = game.add.group();
	gems.enabledBody  = true;
	var gem = gems.create(200, 475, 'orangeGem');

}

//The update function is called by the core game loop every frame

var movingVelocity = 250;

function update() {

	//timeRemaining = timeRemaining - 1;

	//checking for collisions (all members of the world-group)

	game.physics.arcade.collide(player, world);
	game.physics.arcade.collide(player, enemies);
	game.physics.arcade.collide(player, gems);

	game.physics.arcade.overlap(player, gems, collectGem, null, this);

	//this resets the frog in every cycle

	player.body.velocity.x = 0;
	player.body.velocity.y = 0;

	//moving & velocity

	if (cursors.left.isDown) {

		player.body.velocity.x = -movingVelocity;

		//here's the code for the missing animation
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
		player.frame = 4; // What does this do?
	}

}
function collectGem(player, gem) {

	gem.kill();

	//  Add and update the score

	score += 100;
	scoreText.text = 'Score: ' + score;
}

function render () {

	game.debug.inputInfo(60, 60);

}
