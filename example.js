/// Some stuff to work off of based on the getting started tutorial

const game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update
});


var platforms;
var player;
var cursors;
var score = 0;
var objectives;

function preload() {
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);

    game.load.image('platL', 'assets/Plat1_LeftSide.png');
    game.load.image('platM', 'assets/Plat1_Mid.png');
    game.load.image('platR', 'assets/Plat1_RightSide.png');

    game.load.image('wallL', 'assets/Wall1_LeftSide.png');
    game.load.image('wallR', 'assets/Wall1_RightSide.png');

    game.load.image('wallB', 'assets/Wall1_Background.png');
    game.load.image('wallB2', 'assets/Wall1_Background1.png');

    game.load.image('Rocket', 'assets/Rocket.png');
}


function create() {
    game.add.sprite(0, 0, 'star');
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.add.sprite(0, 0, 'sky');
    game.world.setBounds(0,0,3000,3000); 

    platforms = game.add.group();
    platforms.enableBody = true;

    var ground = platforms.create(0, game.world.height - 64, "ground");
    ground.scale.setTo(10, 2);
    ground.body.immovable = true;

    var result = MakePlatform(['platL','platM','platR','wallR','wallL'],['wallB','wallB2'],  game, platforms);
    game.world.bringToTop(platforms); 
	
    player = game.add.sprite(32, game.world.height - 150, 'dude');
    game.physics.arcade.enable(player);
    player.body.bounce.y = 0.5;
    player.body.gravity.y = 1500;
    player.body.collideWorldBounds = true;
    
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8,], 10, true);
    
    var booster = new Upgrade_Booster(game, player,'Rocket');  
    player.upgrades = [booster];
	
    cursors = game.input.keyboard.createCursorKeys();

    game.camera.follow(player); 	
    objectives = new Objectives(game);
    objectives.populate(result);
}

function update() {
    const hitPlatform = game.physics.arcade.collide(player, platforms);
    game.physics.arcade.overlap(player, objectives.group, objectives.onPlayerCollide, null, this);

    objectives.update(game);
    for(var i = 0; i < player.upgrades.length; i++)  {
	    player.upgrades[i].update();
    } 

    if (cursors.left.isDown) {
        if(player.body.acceleration.x > 0) 
        	player.body.velocity.x = -100; 

        player.body.acceleration.x = -350;
        player.animations.play('left');
    } else if (cursors.right.isDown) {
        if(player.body.acceleration.x < 0) 
        	player.body.velocity.x = 100; 

        player.body.acceleration.x = 350;
        player.animations.play('right');
    } else {
	player.body.acceleration.x = 0;
        player.body.velocity.x = 0;
        player.animations.stop();
        player.frame = 4;
    }

    if (cursors.up.isDown && player.body.touching.down && hitPlatform) {
        player.body.velocity.y = -600;
    }
}
