window.onload = function() {

        var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create });

        function preload () {

            game.load.image('ground', 'get_started/assets/platform.png');
            game.load.image('star', 'get_started/assets/star.png');
            game.load.spritesheet('dude', 'get_started/assets/dude.png', 32, 48);
	        game.load.spritesheet('frog','frog.png');

        }

        function create () {

            var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'frog');

            logo.anchor.setTo(0.5, 0.5);

            game.add.sprite(0,0,'star');
			game.add.sprite(0,0, 'frog')

        }
        function update() {

        }

    };