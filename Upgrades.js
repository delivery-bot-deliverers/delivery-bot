class Upgrade_Booster{
	constructor(game, player, sprite, offX, offY, particles ) {
		this.player = player; 
		this.game = game; 	
		this.sprite = game.add.sprite(0, 0, sprite);
		this.sprite.anchor.setTo(0.5,0.5);
		this.offX = offX; 
		this.offY = offY; 

		this.CanBoost = true; 

		this.emitter = game.add.emitter(game.world.centerX, game.world.centerY, 900);
		this.emitter.makeParticles(particles);
		this.emitter.setAlpha(0.5, 1, 3000);
		this.emitter.setScale(.8, 2, .8, 2, 1000);

	}
 
	startBooster()
	{
		if(!this.CanBoost) return; 
		this.CanBoost = false;
		this.TimerCounter = 10;
		this.sprite.angle = 0; 

		this.Timer = this.game.time.create(false);  
		this.Adding = true;

		this.Timer.loop(10, this.rotate, this);

 		this.Timer.start();
	}
	rotate()
	{
		if(this.Adding){
			this.sprite.angle += 2; 
			if(this.sprite.angle > 90){this.Adding = false;}
		}
		else {
			this.sprite.angle -= 2; 
			if(this.sprite.angle < 0){this.Adding = true;}
		}
	}	

	update(Key, cursors, press_Space){
		if (Key.isDown && this.CanBoost){ 
			this.startBooster();
		}

		if(press_Space.isDown && !this.CanBoost){
			this.Timer.stop();
			this.CanBoost = true; 
			var yaccel = Math.cos(this.sprite.angle*Math.PI/180); 
			var xaccel = Math.sin(this.sprite.angle*Math.PI/180); 

			this.player.body.velocity.x = 2000 * xaccel;
			this.player.body.velocity.y = -2000 * yaccel;
			this.emitter.start(false, 3000, 20, 50);
		}


		this.sprite.x = player.body.x + this.offX;
		this.sprite.y = player.body.y + this.offY;

		this.emitter.x = player.body.x + this.offX;
		this.emitter.y = player.body.y + this.offY;
	}
}
