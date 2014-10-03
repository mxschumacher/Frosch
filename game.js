var game = new Phaser.Game(800, 900, Phaser.AUTO, 'game',
	{ preload: preload,
	  create: create,
	  update: update }, true);

var player;
var enemies;
var cursors;
var body;
var gem;
var score = 0;
//var scoreText;
var world;

function preload() {

	game.load.image('frog','images/char-boy.png'); //preliminary image, main character
	game.load.image('truckBug','images/enemy-bug.png'); //kills on collision, mortal enemy.
	game.load.image('blueGem','images/Gem Blue.png'); //goodies for the frog
	game.load.image('grass','images/grass-block.png');
	game.load.image('heart','images/Heart.png'); //frog lives
	game.load.image('Stone','images/stone-block.png'); //for the starting point
	game.load.image('blockRock','images/Rock.png'); //variation of the game -> blocks the way.
	game.load.image('Water','images/water-block.png');

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

	GrasCreator(200);
	waterCreator(300);
	waterCreator(400);
	GrasCreator(500);
	waterCreator(600);
	waterCreator(700);
	baseCreator(800);


	//What other physics engines could be more appropriate?

	game.physics.startSystem(Phaser.Physics.ARCADE);

	//groups can be used to check collision between them.

	world = game.add.group();
	world.enableBody = true ; //objects within platforms have physics enabled.

	//how to create several of those?
	var rockBarrier = world.create(500,475, 'blockRock');
	rockBarrier.body.immovable = true;


	function baseCreator(y) {

		var i = 0;
		x = 0;

		for ( i; i<=7 ;i++ ) {
			game.add.sprite(x, y, 'Stone');
			x = x + 100;
		}

	}


	function waterCreator(y) {

		var i = 0;
		x = 0;

		for ( i; i<=7 ;i++ ) {
			game.add.sprite(x, y, 'Water');
			game.add.sprite(x, y, 'Water');
			x = x + 100;
		}


	}


	function GrasCreator(y) {

		var i = 0;
		x = 0;

		for ( i; i<=7 ;i++ ) {
			game.add.sprite(x, y, 'grass');
			x = x + 100;
		}


	}

	//the player

	player = game.add.sprite(350,750,'frog');

	game.physics.arcade.enable(player);

	//player-physics:

	player.body.collideWorldBounds = true;

	//appropriate jumping sprite needed. 'jump is the name of the animation.'
	//player.animations.add('jump',[0,1,2,3], 4, true);

	//the enemies

	//game controls

	cursors = game.input.keyboard.createCursorKeys();


}

//The update function is called by the core game loop every frame

var movingVelocity = 250;

function update() {
	//checking for collisions (all members of the world-group)

	game.physics.arcade.collide(player, world);
	game.physics.arcade.collide(player, enemies);

	//this resets the frog in every cycle

	player.body.velocity.x = 0;
	player.body.velocity.y = 0;

	//moving &velocity

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

/**
function collectGem(player, gem) {

	gem.kill();

	//  Add and update the score
	score += 100;
	scoreText.text = 'Score: ' + score;
}
**/

}

/**
function canvasSupport () {
	return Modernizer.canvas;
}
**/

