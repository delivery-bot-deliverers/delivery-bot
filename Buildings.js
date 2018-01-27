

function MakeBlock(sprites, parentGroup, X, Y, pos)
{
	var p= 	parentGroup.create(X, Y, sprites[pos]);	
	p.body.immovable = true;
}

function TileRow(amount, X, Y, BlockSize, Blocker) 
{
	for(var i = 0 ; i< amount; i++) 
	{
		var pos;
		if(i ==0) pos = 0; 
		else if(i == amount -1)pos =2
		else pos = 1; 
		Blocker(X,Y,pos);
		X = X + BlockSize; 
	}	
}

function PlatformParser(platformArray) 
{
}

function MakePlatform(sprites, game, platforms ) 
{
    var ground = platforms.create(0, game.world.height - 64, "ground");
    ground.scale.setTo(2, 2);
    ground.body.immovable = true;

    TileRow(10,400,400,25,function(X,Y,Pos){MakeBlock(sprites,game,X,Y,Pos);});

   // const ledgeA = platforms.create(400, 400, sprite);
   // ledgeA.body.immovable = true;

   // const ledgeB = platforms.create(-150, 250, sprite);
   // ledgeB.body.immovable = true;
}
