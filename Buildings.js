

function TileRow(sprite, group, amount, X, Y) 
{
	var platform = group.add.group();	
	for(var i = 0 ; i< amount; i++) 
	{
		var p= 	platform.create(X, Y, sprite);	
		p.body.immovable = true;
		X = X + 25; 
	}	
}

function MakePlatform(sprite, game) 
{
    var platforms = game.add.group();
    platforms.enableBody = true;

    const ground = platforms.create(0, game.world.height - 64, sprite);
    ground.scale.setTo(2, 2);
    ground.body.immovable = true;

	TileRow

    const ledgeA = platforms.create(400, 400, sprite);
    ledgeA.body.immovable = true;

    const ledgeB = platforms.create(-150, 250, sprite);
    ledgeB.body.immovable = true;
}
