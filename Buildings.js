

function MakeBlock(sprites, parentGroup, X, Y, pos)
{
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

function PlatformParser(platformArray, X, Y, BlockSize, Tile, TileBG) 
{
	var retlist = [[],[],[],[],[],[]];         
	for(var i = 0 ; i< platformArray.length; i++) 
	{
		for(var ii = 0 ; ii < platformArray[i].length; ii++) 
		{

			var pos =0; 
			if(i+1<platformArray.length && platformArray[i+1][ii] > 0){
				if( Math.random() > 0.7) 
					pos =1;	
			}
			TileBG(X + (ii * BlockSize), Y + (i * BlockSize),pos);

			if(platformArray[i][ii] >= 10 && platformArray[i][ii] <= 15) 
			{
				var pos = platformArray[i][ii] - 10;
				var pt = new Phaser.Point(X + (ii * BlockSize), Y + (i * BlockSize));
				retlist[pos].push(pt); 
				continue; 
			}
			else if(platformArray[i][ii] != 0)
				Tile(X + (ii * BlockSize), Y + (i * BlockSize),platformArray[i][ii]-1);

		}
	}
	return retlist;
}

function MergeArrays(pt1, pt2) {
	for(var ii = 0; ii< pt1.length; ii++){
		pt1[ii]=pt1[ii].concat(pt2[ii]); 
	}
}

function placePlatformTiles(Platforms,X,Y,BlockSize,Tile,TileBG)
{
	var retlist = [[],[],[],[],[],[]];         
	for(var i = 0; i < Platforms.length; i++)
	{
		var pts = PlatformParser(Platforms[i],X,Y,25,Tile,TileBG );
		Y = Y - (Platforms[i].length * BlockSize); 
		MergeArrays(retlist, pts);
	}
	return retlist;
}

function MakePlatform(sprites, bgSprites, game, platforms ) 
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
		[5,2,2,2,2,2,0,0,0,0,0,0,0,4],
		[5,0,0,0,0,0,0,0,0,0,0,0,0,4],
		[5,0,0,0,0,0,0,0,0,0,0,0,0,4],
		[5,0,0,0,0,0,0,0,10,0,0,0,0,4],
		[5,0,0,0,0,0,0,1,2,2,2,2,2,4],
		[5,0,0,0,0,0,0,0,0,0,0,0,0,4],
		]; 

	var MakeSprites = function(X,Y,Pos)
	{
		var p =	platforms.create(X, Y, sprites[Pos]);	
		p.body.immovable = true;
	}
	var MakeBG = function(X,Y,Pos)
	{
		var mePos = Pos;
		if(mePos >0){
			mePos = 1;
		}
		if(mePos <0){
			mePos = 0;
		}
		var p =	game.add.sprite(X, Y, bgSprites[mePos]);	
		p.inputEnabled = false;
	}

	var retlist = [[],[],[],[],[],[]];         

	var plooty = [plat,plat2,plat2,plat2,plat2,plat2,plat2];
	var plooty2 = [plat,plat2];

	var pts = placePlatformTiles(plooty,300,2700,25, MakeSprites,MakeBG);
	MergeArrays(retlist, pts);

	pts =placePlatformTiles(plooty2,700,2700,25, MakeSprites,MakeBG);
	MergeArrays(retlist, pts);

	return retlist;
}
