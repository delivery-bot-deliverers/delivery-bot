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
		console.log("PLat size "+Platforms[i].length);
		MergeArrays(retlist, pts);
	}
	return retlist;
}


function GenSmallBuild(X, game, bgSprites, MakeSprites, MakeBG) 
{
	var retlist = [[],[],[],[],[],[]];         
	var plat = 
		[
		[5,0,0,0,0,0,0,0,0,0,0,0,0,4],
		[5,0,0,0,0,1,2,2,2,2,3,0,0,4],
		[5,0,0,0,0,0,0,0,0,0,0,0,0,4],
		[5,0,0,0,0,0,0,0,0,0,0,0,0,4],
		[5,0,0,0,0,0,0,1,2,2,2,2,2,4],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		];

	var plat2 = 
		[
		[5,0,0,0,0,0,0,0,0,0,0,0,0,4],
		[5,2,2,2,2,3,0,0,0,0,0,0,0,4],
		[5,0,0,0,0,0,0,0,0,0,0,0,0,4],
		[5,0,0,0,0,0,0,0,0,0,0,0,0,4],
		[5,0,0,0,0,0,0,0,10,0,0,0,0,4],
		[5,0,0,0,0,0,0,1,2,2,2,2,2,4],
		[5,0,0,0,0,0,0,0,0,0,0,0,0,4],
		]; 

	var plat2_1 = 
		[
		[5,0,0,0,0,0,0,0,0,0,0,0,0,4],
		[5,2,3,0,0,0,0,0,0,0,0,0,0,4],
		[5,0,0,0,0,0,0,0,0,0,0,0,0,4],
		[5,0,0,0,0,0,0,0,0,0,0,0,0,4],
		[5,0,0,0,0,0,0,0,0,0,0,0,10,4],
		[5,0,0,0,0,0,0,1,2,2,2,2,2,4],
		[5,0,0,0,0,0,0,0,0,0,0,0,0,4],
		]; 

	var plat2_2 = 
		[
		[5,0,0,0,10,0,0,0,0,0,0,0,0,4],
		[5,2,2,2,2,3,0,0,0,0,0,0,0,4],
		[5,0,0,0,0,0,0,0,0,0,0,0,0,4],
		[5,0,0,0,0,0,0,0,0,0,0,0,0,4],
		[5,0,0,0,0,0,0,0,0,0,0,0,0,4],
		[5,0,0,0,0,0,0,0,0,0,0,1,2,4],
		[5,0,0,0,0,0,0,0,0,0,0,0,0,4],
		]; 

	var plat3 = 
		[
		[5,2,2,2,0,0,0,0,0,2,2,2,2,4],
		[5,0,0,0,0,0,0,0,0,0,0,0,0,4],
		[5,0,0,0,0,0,0,1,2,2,2,2,2,4],
		[5,0,0,0,0,0,0,0,0,0,0,0,0,4],
		[5,0,0,0,0,0,0,0,0,0,0,0,0,4],
		[5,0,0,0,0,0,0,0,0,0,0,0,0,4],
		[5,0,0,0,0,0,0,0,0,0,0,0,0,4],
		[5,0,0,0,0,0,0,0,0,0,0,0,0,4],
		]; 

		var building = [plat]; 
		var buildingHeight = (plat.length * 25);

		var randy2 = Math.random() * 1;
		for(var ii = 0; ii< randy2; ii++) 
		{

			building.push(added);  
			buildingHeight += (added.length * 25);
		} 
		building.push(plat3);  
		buildingHeight += (plat3.length * 25);

		game.add.tileSprite(X, 2900 - buildingHeight , 350, buildingHeight,bgSprites[0]);	

		var pts = placePlatformTiles(building,X,2760,25, MakeSprites,MakeBG);
		MergeArrays(retlist, pts);
 		return retlist;
}

function MakePlatform(sprites, bgSprites, game, platforms, walls, BreakWalls) 
{
	var plat = 
		[
		[5,0,0,0,0,0,0,0,0,0,0,0,0,4],
		[5,0,0,0,0,1,2,2,2,2,3,0,0,4],
		[5,0,0,0,0,0,0,0,0,0,0,0,0,4],
		[5,0,0,0,0,0,0,0,0,0,0,0,0,4],
		[5,0,0,0,0,0,0,1,2,2,2,2,2,4],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		];

	var plat2 = 
		[
		[5,0,0,0,0,0,0,0,0,0,0,0,0,4],
		[5,2,2,2,2,3,0,0,0,0,0,0,0,4],
		[8,0,0,0,0,0,0,0,0,0,0,0,0,9],
		[8,0,0,0,0,0,0,0,0,0,0,0,0,9],
		[8,0,0,0,0,0,0,0,10,0,0,0,0,9],
		[6,0,0,0,0,0,0,1,2,2,2,2,2,7],
		[5,0,0,0,0,0,0,0,0,0,0,0,0,4],
		]; 

	var plat2_1 = 
		[
		[5,0,0,0,0,0,0,0,0,0,0,0,0,4],
		[5,2,2,2,3,0,0,0,0,0,0,0,0,4],
		[5,0,0,0,0,0,0,0,0,0,0,0,0,9],
		[8,0,0,0,0,0,0,0,0,0,0,0,0,9],
		[8,0,0,0,0,0,0,0,0,0,0,0,10,9],
		[8,0,0,0,0,0,0,1,2,2,2,2,2,7],
		[6,0,0,0,0,0,0,0,0,0,0,0,0,4],
		]; 

	var plat2_2 = 
		[
		[8,0,0,0,10,0,0,0,0,0,0,0,0,4],
		[7,2,2,2,2,3,0,0,0,0,0,0,0,4],
		[5,0,0,0,0,0,0,0,0,0,0,0,0,4],
		[5,0,0,0,0,0,0,0,0,0,0,0,0,9],
		[5,0,0,0,0,0,0,0,0,0,0,0,0,9],
		[5,0,0,0,0,0,0,0,0,0,0,1,2,7],
		[5,0,0,0,0,0,0,0,0,0,0,0,0,4],
		]; 
	var plat3 = 
		[
		[5,0,0,0,10,0,0,0,0,0,0,0,0,4],
		[5,2,2,2,2,3,0,0,0,0,0,0,0,4],
		[5,0,0,0,0,0,0,0,0,0,0,0,0,9],
		[8,0,0,0,0,0,0,0,0,0,0,0,0,9],
		[8,0,0,0,0,0,0,0,0,0,0,0,0,9],
		[8,0,0,0,0,0,0,0,0,0,1,2,2,7],
		[6,0,0,0,0,0,0,0,0,0,0,0,0,4],
		]; 

	var plat4 = 
		[
		[6,2,2,2,0,0,0,0,0,2,2,2,2,7],
		[5,0,0,0,0,0,0,0,0,0,0,0,0,4],
		[5,0,0,0,0,0,0,0,0,0,0,0,0,4],
		[5,0,0,0,0,0,0,1,2,2,2,2,2,4],
		[5,0,0,0,0,0,0,0,0,0,0,0,0,4],
		[5,0,0,0,0,0,0,0,0,0,0,0,0,4],
		[5,0,0,0,0,0,0,0,0,0,0,0,0,4],
		[5,0,0,0,0,0,0,0,0,0,0,0,0,4],
		]; 
	var MakeSprites = function(X,Y,Pos)
	{
		if(Pos == 3 || Pos == 4 ) {
			var p =	walls.create(X, Y, sprites[Pos]);	
			p.body.immovable = true;
		}else if(Pos == 7 || Pos == 8 ) {
			var p =	BreakWalls.create(X, Y, sprites[Pos]);	
			p.body.immovable = true;
		}	
		else {
			var p =	platforms.create(X, Y, sprites[Pos]);	
			p.body.immovable = true;
		}
	}

	var MakeBG = function(X,Y,Pos)
	{
		return; 
		var mePos = Pos;
		if(mePos >0){
			mePos = 1;
		}
		if(mePos <0){
			mePos = 0;
		}
		game.add.renderTexture(X, Y, bgSprites[mePos]);	
	}

	var retlist = [[],[],[],[],[],[]];         

	var plooty = [plat,plat2,plat2,plat2,plat2,plat2,plat2];
	var plooty2 = [plat,plat2];

	var randy1 = 1;
	var loc = 300;  
	var buildingHeight = 0; 

	for(var i = 0 ; i < randy1; i++) 
	{ 	
		var building = [plat]; 
		buildingHeight = plat.length * 25;

		var randy2 = Math.random() * 10;
		for(var ii = 0; ii< randy2; ii++) 
		{
			var sadloc = Math.round(30 * Math.random()); 
			var added; 
			if(sadloc <= 10)added = plat2;
			else if(sadloc <= 20)added = plat2_1;
			else if(sadloc <= 30)added = plat2_2;

			building.push(added);  
			buildingHeight += (added.length * 25);
		} 
		if(randy2 > 7 ) {
			var randy3 = Math.random() * 6;
			for(var iii = 0; iii< randy3; iii++) 
			{
				building.push(plat3);  
				buildingHeight += (plat3.length * 25);
			} 
		}
		building.push(plat4);  
		buildingHeight += (plat4.length * 25);

		game.add.tileSprite(loc, 2950 - buildingHeight ,350, buildingHeight,bgSprites[0] );	

		var pts = placePlatformTiles(building,loc,2760,25, MakeSprites,MakeBG);
		MergeArrays(retlist, pts);
		loc += (400 + (Math.random() * 2000));
	}
	MergeArrays(retlist, pts);
/*
	for( var i = 1; i < 10; i++ ){

		var pts = GenSmallBuild((i * 10000), game, bgSprites, MakeSprites, MakeBG); 
		MergeArrays(retlist, pts);
	}
*/

	return retlist;
}
