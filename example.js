const game = new Phaser.Game(800, 600, Phaser.CANVAS, '', {
    preload: preload,
    create: create,
    update: update
});

var platforms;
var Walls;
var BreakWalls;

var objDudes;

var player;
var cursors;
var score = 0;
var objectives;
var Upgrades;
var press_Z;
var press_Space; 
var missiongiver;
var deliver_sound;
var drop_bomb_sound;
var explosion_sound;
var get_job_sound;
var jump_sound;
var land_sound;
var hud;

function preload() {
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);

    game.load.spritesheet('objectiveDude1', 'assets/Person_Objective1.png', 32, 64);

    game.load.image('platL', 'assets/Plat1_LeftSide.png');
    game.load.image('platM', 'assets/Plat1_Mid.png');
    game.load.image('platR', 'assets/Plat1_RightSide.png');

    game.load.image('wallL', 'assets/Wall1_LeftSide.png');
    game.load.image('wallR', 'assets/Wall1_RightSide.png');

    game.load.image('wallB', 'assets/Wall1_Background.png');
    game.load.image('wallB2', 'assets/Wall1_Background1.png');

    game.load.image('WallFloorL', 'assets/WallFloor1_LeftSide.png');
    game.load.image('WallFloorR', 'assets/WallFloor1_RightSide.png');

    game.load.image('WallLBrk', 'assets/Wall1_LeftSideBrk.png');
    game.load.image('WallRBrk', 'assets/Wall1_RightSideBrk.png');

    game.load.image('Rocket', 'assets/Rocket.png');
    game.load.image('exclamation', 'assets/exclamation.png');
    game.load.spritesheet('missiongiver', 'assets/missiongiver.png', 32, 64);

    game.load.audio('Deliver', 'assets/Deliver.wav');
    game.load.audio('DropBomb', 'assets/DropBomb.wav');
    game.load.audio('Explosion', 'assets/Explosion.wav');
    game.load.audio('GetJob', 'assets/GetJob.wav');
    game.load.audio('Jump', 'assets/Jump.wav');
    game.load.audio('Land', 'assets/Land.wav');

    game.load.image('Smoke1', 'assets/Smoke1.png');
    game.load.image('Smoke2', 'assets/Smoke2.png');
    game.load.image('Smoke3', 'assets/Smoke3.png');


}

function showEndGameOverlay(thestring, duration, bgColorNum, bgColorAlpha, textColorStr) {
    const gfx = game.add.graphics(0, 0);
    gfx.fixedToCamera = true;
    gfx.beginFill(bgColorNum, bgColorAlpha);
    gfx.drawRect(0, 0, game.scale.width, game.scale.height);

    const text = game.add.text(0, 0, thestring, {'fill': textColorStr});
    text.fixedToCamera = true;
    text.fontSize = 100;
    text.cameraOffset.x = game.scale.width/2 - text.width/2;
    text.cameraOffset.y = game.scale.height/2 - text.height/2;

    game.time.events.add(duration, () => {
        text.destroy();
        gfx.destroy();
        location.reload();
    }, this);
}

function spawnFloatUpText(x, y, thestring, color) {
    const durationMs = 1500;
    const pixelsPerSecond = 30;
    const text = game.add.text(x, y, thestring, {'fill': color});
    text.update = () => {
        text.y -= pixelsPerSecond * game.time.physicsElapsed;
    };
    game.time.events.add(durationMs, () => {
        text.destroy();
    }, this);
}


var sadText = ["Well that took forever",
    	       "eh.. thanks I guess",
               "Ugh I guess you can have a tip",
               "Why do you need money",
               "awww it is cold",
               "I don't remmeber what I ordered",
               "I dont like tipping bots",
               "booo",
               "jump better please",
               "If I was a roobit I wuld have done better",
               "not impressed",
               "5 out of 7",
               "My toaster is faster",
               "I have been waiting forever",
               "Why would you make me wait so long",
               "NOOO, i needed this like 10 seconds ago",
               "Please try and do better",
               "I am not mad.. just sad"];

function create() {
    game.stage.backgroundColor = '#9ce5fb';

    deliver_sound = game.add.audio('Deliver');
    game.load.audio('Smoke1', 'assets/Smoke1.png');
    drop_bomb_sound = game.add.audio('DropBomb');
    explosion_sound = game.add.audio('Explosion');
    get_job_sound = game.add.audio('GetJob');
    jump_sound = game.add.audio('Jump');
    land_sound = game.add.audio('Land');

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.world.setBounds(0,0,300000,3000); 

    platforms = game.add.group();
    platforms.enableBody = true;

    Walls = game.add.group(); 
    Walls.enableBody = true;

    BreakWalls = game.add.group();
    BreakWalls.enableBody = true;

    var ground = platforms.create(0, game.world.height - 64, "ground");
    ground.scale.setTo(1000, 2);
    ground.body.immovable = true;

    var wallSprites=['platL','platM','platR','wallR','wallL','WallFloorL','WallFloorR','WallLBrk','WallRBrk']; 
    var bgWallSprites = ['wallB','wallB2'];
    var result = MakePlatform(wallSprites, bgWallSprites, game, platforms, Walls, BreakWalls);
    game.world.bringToTop(platforms); 
    game.world.bringToTop(Walls); 
    game.world.bringToTop(BreakWalls); 
	
    player = game.add.sprite(32, game.world.height - 150, 'dude');
    game.physics.arcade.enable(player);
    player.body.gravity.y = 1500;
    player.body.collideWorldBounds = true;
    
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8,], 10, true);
    player.facing = "Right";
    player.boosting = false;

    var booster = new Upgrade_Booster(game, player,'Rocket',20,20,['Smoke1','Smoke2','Smoke3'] );  
    Upgrades = [booster];
	
    game.world.bringToTop(player); 
    game.camera.follow(player); 	

    missiongiver = new MissionGiver(game, 200, 2872);

    objectives = new Objectives(game);
    objDudes = objectives.populate(result);

    cursors = game.input.keyboard.createCursorKeys();
    press_Space =  game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR); 
    press_Z = game.input.keyboard.addKey(Phaser.Keyboard.Z);

    hud = new Hud(game);
    hud.registerTimeUpCallback(() =>
        showEndGameOverlay('GAME OVER', 5000, 0xFF0000, 0.5, '#220000')
    );

    missiongiver.registerMissionCallback(() => {
        objectives.beginRoute(player.position, [0]);
        hud.startTimer(8.0);
    });

    objectives.registerCollectCallback((objective, dist) => {
        const secondsPerPixel = 0.008;
        const dollarsPerPixel = 0.01;
        const deltaTime = dist * secondsPerPixel;
        const deltaDollars = Math.round(dist * dollarsPerPixel);
        hud.addTime(deltaTime);
        hud.addDollars(deltaDollars);
        spawnFloatUpText(player.x, player.y - 30, '$'+deltaDollars.toString(), '#00AA00');

	var sadloc = Math.round(sadText.length * Math.random()); 
	if(sadloc >= sadText.length) sadloc = sadText.length -1;  
        spawnFloatUpText(player.x + 30 , player.y - 30, sadText[sadloc], '#555555');
    });
    objectives.registerDoneCallback(() =>
        showEndGameOverlay('YOU WON!', 5000, 0x0000FF, 0.5, '#000000')
    );
}

function update() {
	var curVx =player.body.velocity.x;  
    const hitPlatform = game.physics.arcade.collide(player, platforms);
    const hitWall = game.physics.arcade.collide(player, Walls);

    game.physics.arcade.collide(objDudes, platforms);

    if (hitPlatform && player.falling) {
        player.falling = false;
        land_sound.play();
    }

    game.physics.arcade.overlap(player, objectives.group, objectives.collidePlayer, null, objectives);
    game.physics.arcade.overlap(player, missiongiver.sprite, missiongiver.collidePlayer, null, missiongiver);

    objectives.update(game);
    missiongiver.update(game);
    hud.update(game);

    for(var i = 0; i < Upgrades.length; i++)  {
	    Upgrades[i].update(press_Z,cursors,press_Space);
    } 

    const xspeed = 200;
    const xaccel = xspeed * 2.69;
    if (cursors.left.isDown) {
        if(player.body.acceleration.x > 0) 
            player.body.velocity.x = -xspeed;

        player.body.acceleration.x = -xaccel;
        player.animations.play('left');
	player.facing = "Left";
    } else if (cursors.right.isDown) {
        if(player.body.acceleration.x < 0) 
            player.body.velocity.x = xspeed;

        player.body.acceleration.x = xaccel;
	player.animations.play('right');
	player.facing = "Right";
    }else if(hitPlatform && player.body.velocity.x != 0) {
	    if( player.body.velocity.x > 0 ){ 
		    player.body.velocity.x -= 50;
		    if(player.body.velocity.x < 0 ){ 
			    player.body.acceleration.x = 0;
			    player.animations.stop();
			    player.frame = 4;
			    player.body.velocity.x = 0;
		    } 
	    }
	    if( player.body.velocity.x < 0 ) {
		    player.body.velocity.x += 50;
		    if(player.body.velocity.x > 0 ){ 
			    player.body.acceleration.x = 0;
			    player.animations.stop();
			    player.frame = 4;
			    player.body.velocity.x = 0;
		    } 
	    }
    }

    if (cursors.up.isDown && player.body.touching.down && hitPlatform) {
        player.body.velocity.y = -600;
        jump_sound.play();
    }

    if (hitWall) {
	    if(player.body.velocity.x < 0) {
		    player.X += 50; 
	    }else {
		    player.X -= 50;  
	    }

	player.body.velocity.x = -(curVx * .4);

	console.log(player.body.velocity.x); 
    }

    if (player.body.velocity.y > 0) {
        player.falling = true;
    }
}
