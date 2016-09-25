

var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
	game.load.image('faces', 'assets/f1.jpg');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
	
	
	// Audio
	
	game.load.audio('meow2', 'assets/audio/meow2.mp3');
	game.load.audio('tada', 'assets/audio/tada.mp3');
	
	game.load.audio('soundtrack', 'assets/audio/oedipus_ark_pandora.mp3');
	

}



var player;
var platforms;
var cursors;

var stars;
var score = 0;
var scoreText;

function create() {

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    game.add.sprite(0, 0, 'sky');
	
	game.add.sprite(0, 0, game.create.grid('grid', 160 * 5, 160 * 3, 160, 160, 'rgba(0, 250, 0, 1)'));
	

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    // Here we create the ground.
    var ground = platforms.create(0, game.world.height - 20, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(2, 2);

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    //  Now let's create two ledges
    var ledge = platforms.create(400, 400, 'ground');
    ledge.body.immovable = true;

    ledge = platforms.create(-150, 250, 'ground');
    ledge.body.immovable = true;

    // The player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'dude');

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    //  Finally some stars to collect
    stars = game.add.group();

    //  We will enable physics for any star that is created in this group
    stars.enableBody = true;

    //  Here we'll create 12 of them evenly spaced apart
    for (var i = 0; i < 12; i++)
    {
        //  Create a star inside of the 'stars' group
        var star = stars.create(i * 70, 0, 'star');

        //  Let gravity do its thing
        star.body.gravity.y = 300 *Math.random();

        //  This just gives each star a slightly random bounce value
        star.body.bounce.y = 0.7 + Math.random() * 0.2;
    }

    //  The score
    scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();
    

	meow2 = game.add.audio('meow2');
	tada = game.add.audio('tada');
	soundtrack = game.add.audio('soundtrack');
	
	soundtrack.play();

    //  Being mp3 files these take time to decode, so we can't play them instantly
    //  Using setDecodedCallback we can be notified when they're ALL ready for use.
    //  The audio files could decode in ANY order, we can never be sure which it'll be.

    //game.sound.setDecodedCallback([ meow2 ], start, this);

}

var keys;

function start() {

    text.text = 'Press 1, 2 or 3';

    var style = { font: "48px Arial", fill: "#cdba52", align: "center" };

    text1 = game.add.text(game.world.centerX, 250, "Blaster: Stopped", style);
    text1.anchor.set(0.5);

    text2 = game.add.text(game.world.centerX, 350, "Explosion: Stopped", style);
    text2.anchor.set(0.5);

    text3 = game.add.text(game.world.centerX, 450, "Sword: Stopped", style);
    text3.anchor.set(0.5);

    //explosion.onStop.add(soundStopped, this);
    //sword.onStop.add(soundStopped, this);
    //blaster.onStop.add(soundStopped, this);

  

}

function update() {

    //  Collide the player and the stars with the platforms
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(stars, platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    game.physics.arcade.overlap(player, stars, collectStar, null, this);

    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -150;

        player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 150;

        player.animations.play('right');
    }
    else
    {
        //  Stand still
        player.animations.stop();

        player.frame = 4;
    }
    
    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -350;
    }

}

function collectStar (player, star) {
    
	meow2.play();
	
    // Removes the star from the screen
    star.kill();

    //  Add and update the score
    score += 10;
    scoreText.text = 'Score: ' + score;
	
	if(score == 120)
	{
		soundtrack.stop();
		meow2.stop();
		
		//  A simple background for our game
		game.add.sprite(0, 0, 'faces');
		tada.play();
	} 	

}
