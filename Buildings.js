
function platform(sprite) 
{
    platforms = game.add.group();
    platforms.enableBody = true;

    const ground = platforms.create(0, game.world.height - 64, sprite);
    ground.scale.setTo(2, 2);
    ground.body.immovable = true;

    const ledgeA = platforms.create(400, 400, sprite);
    ledgeA.body.immovable = true;

    const ledgeB = platforms.create(-150, 250, sprite);
    ledgeB.body.immovable = true;
}
