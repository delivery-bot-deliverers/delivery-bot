

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

function PlatformParser(platformArray, X, Y, BlockSize, Tile) 
{
	for(var i = 0 ; i< platformArray.length; i++) 
	{
		for(var ii = 0 ; ii < platformArray[i].length; ii++) 
		{
			if(platformArray[i][ii] != 0)
				Tile(X + (ii * BlockSize), Y + (i * BlockSize),platformArray[i][ii]-1);
		}
	}
}

function placePlatformTiles(Platforms,X,Y,BlockSize,Tile) 
{
	for(var i = 0; i < Platforms.length; i++)
	{
		PlatformParser(Platforms[i],X,Y,25,Tile);
		Y = Y - (Platforms[i].length * BlockSize); 
	}
}

function MakePlatform(sprites, game, platforms ) 
{
	var plat = 
		[
		[0,0,0,0,0,0,0,0,0,0,0,0,0,4],
		[0,0,0,0,0,1,2,2,2,2,3,0,0,4],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,4],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,4],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,4],
		[0,0,0,0,0,0,0,1,2,2,2,2,2,4],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		];

	var plat2 = 
		[
		[5,0,0,0,0,0,0,0,0,0,0,0,0,4],
		[5,0,0,0,0,1,2,2,2,2,3,0,0,4],
		[5,0,0,0,0,0,0,0,0,0,0,0,0,4],
		[5,0,0,0,0,0,0,0,0,0,0,0,0,4],
		[5,0,0,0,0,0,0,0,0,0,0,0,0,4],
		[5,0,0,0,0,0,0,1,2,2,2,2,2,4],
		[5,0,0,0,0,0,0,0,0,0,0,0,0,4],
		]; 

	var plooty = [plat,plat2,plat2,plat2,plat2,plat2,plat2];
	var plooty2 = [plat,plat2];
	placePlatformTiles(plooty,300,2700,25,function(X,Y,Pos){MakeBlock(sprites,platforms,X,Y,Pos);} );
	placePlatformTiles(plooty2,700,2700,25,function(X,Y,Pos){MakeBlock(sprites,platforms,X,Y,Pos);} );

   // PlatformParser(plat,300,350,25,function(X,Y,Pos){MakeBlock(sprites,platforms,X,Y,Pos);});
   // PlatformParser(plat,300,150,25,function(X,Y,Pos){MakeBlock(sprites,platforms,X,Y,Pos);});

   // const ledgeA = platforms.create(400, 400, sprite);
   // ledgeA.body.immovable = true;

   // const ledgeB = platforms.create(-150, 250, sprite);
   // ledgeB.body.immovable = true;
}
