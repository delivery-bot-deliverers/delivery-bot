class Upgrade_Booster{
	constructor(game, player, sprite, offX, offY) {
		this.player = player; 
		this.game = game; 	
		this.sprite = game.add.sprite(0, 0, sprite);
		this.offX = offX; 
		this.offY = offY; 
		this.CanBoost = true; 
		this.Timer = game.time.create(false);  
		this.Timer.loop(1000,this.timerUpdate); 
		this.TimerCounter = 0;
		this.Timer.start();
	}

	timerUpdate() 
	{
		this.TimerCounter--;
		if(this.TimerCounter == 0)
		{
			this.Timer.stop();
			this.CanBoost = true;
			player.body.acceleration.x = 0;
			player.body.acceleration.y = 0;
		}
		var accel = 400; 
		if(this.sprite.angle == 270){
			player.body.acceleration.x += accel;
		} 
		else if(this.sprite.angle == 90){ 
			player.body.acceleration.x -= accel;
		}
		else if(this.sprite.angle == 180){ 
			player.body.acceleration.y += accel;
		}
		else if(this.sprite.angle == 0){
			player.body.acceleration.y -= accel;
		}
	}

	update(Key, cursors, press_Space){
		if (Key.isDown && this.CanBoost) 
		{
			if(cursors.left.isDown)
			{
				this.sprite.angle = 270; 
			}	
			if(cursors.right.isDown)
			{
				this.sprite.angle = 90; 
			}	
			if(cursors.up.isDown)
			{
				this.sprite.angle = 180; 
			}	
			if(cursors.down.isDown)
			{
				this.sprite.angle = 1; 
			}	
			if(press_Space.isDown ){
				this.CanBoost = false;
				this.TimerCounter = 100;
			}	
		}
		if(!this.CanBoost) 
			this.timerUpdate();

		this.sprite.x = player.body.x + this.offX;
		this.sprite.y = player.body.y + this.offY;
	}
}
