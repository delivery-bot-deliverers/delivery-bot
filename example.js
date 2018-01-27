/// Some stuff to work off of based on the getting started tutorial

const game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update
});


var platforms;
var player;
var cursors;
var stars;
var score = 0;
var scoreText;
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
}


function create() {
    game.add.sprite(0, 0, 'star');
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.add.sprite(0, 0, 'sky');

    platforms = game.add.group();
    platforms.enableBody = true;

    var ground = platforms.create(0, game.world.height - 64, "ground");
    ground.scale.setTo(2, 2);
    ground.body.immovable = true;

    MakePlatform(['platL','platM','platR','wallR','wallL'], game, platforms);

    player = game.add.sprite(32, game.world.height - 150, 'dude');
    game.physics.arcade.enable(player);
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8,], 10, true);

    cursors = game.input.keyboard.createCursorKeys();

    stars = game.add.group();
    stars.enableBody = true;
    for (let i = 0; i < 12; i++) {
        const star = stars.create(70 * i, 0, 'star');
        star.body.gravity.y = 6;
        star.body.bounce.y = 0.7 + Math.random() * 0.2;
    }

    scoreText = game.add.text(16, 16, 'score: 0', {
        fontSize: '32px', fill: '#000'
    });

    objectives = new Objectives(game, [
        [-1000, 300], // off screen!
        [100, 300],
        [300, 300],
        [500, 300],
        [700, 300],
        [1000, 300] // off screen!
    ]);

}

function collectStar(player, star) {
    star.kill();

    score += 10;
    scoreText.text = 'Score: ' + score;
}

function update() {
    const hitPlatform = game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(stars, platforms);
    game.physics.arcade.overlap(player, stars, collectStar, null, this);
    game.physics.arcade.overlap(player, objectives.group, objectives.onPlayerCollide, null, this);

    objectives.update(game);

    if (cursors.left.isDown) {
        player.body.velocity.x = -150;
        player.animations.play('left');
    } else if (cursors.right.isDown) {
        player.body.velocity.x = 150;
        player.animations.play('right');
    } else {
        player.body.velocity.x = 0;
        player.animations.stop();
        player.frame = 4;
    }

    if (cursors.up.isDown && player.body.touching.down && hitPlatform) {
        player.body.velocity.y = -300;
    }
}
