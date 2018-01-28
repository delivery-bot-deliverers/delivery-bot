class Upgrade_Regan{
	constructor(game, player, offX, offY ) {
return; 
		this.spriteRegan = game.add.sprite(0, 0, 'TheRegan');
		game.physics.arcade.enable(this.spriteRegan);
		this.spriteRegan.animations.add('mainRegan', [0, 1, 2, 3, 4, 5, 6], 10, true); 
		this.spriteRegan.animations.play('mainRegan');

		this.spriteRegan.x = player.body.x + this.offX;
		this.spriteRegan.y = player.body.y + this.offY;
	}

	update(Key, cursors, press_Space){
return; 
		if(this.spriteRegan.body.x > player.body.x)this.spriteRegan.body.acceleration.x += 10;  
		if(this.spriteRegan.body.x < player.body.x)this.spriteRegan.body.acceleration.x -= 10;  
		if(this.spriteRegan.body.y > player.body.y)this.spriteRegan.body.acceleration.y += 10;  
		if(this.spriteRegan.body.y < player.body.y)this.spriteRegan.body.acceleration.y -= 10;  

		console.log("regan x:" +this.spriteRegan.body.x ); 
		console.log("regan y:" +this.spriteRegan.body.y ); 
	}
}
