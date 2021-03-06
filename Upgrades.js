class Upgrade_Booster{
	constructor(game, player, sprite, offX, offY, particles ) {
		this.player = player; 
		this.game = game; 	
		this.sprite = game.add.sprite(0, 0, sprite);
		this.sprite.anchor.setTo(0.5,0.5);
		this.offX = offX; 
		this.offY = offY; 

		this.CanBoost = true; 

		this.ang  = 0; 
		this.offang = 0;

		this.emitter = game.add.emitter(game.world.centerX, game.world.centerY, 900);
		this.emitter.makeParticles(particles);
		this.emitter.setAlpha(0.5, 1, 3000);
		this.emitter.setScale(.8, 2, .8, 2, 1000);

	}

	setAng(){
		if(this.player.facing == "Right"){
			this.sprite.angle =  this.offang; 
		}else if(this.player.facing == "Left"){
			this.sprite.angle  = 360 - this.offang;  
		}
	} 

	startBooster()
	{
		if(!this.CanBoost) return; 
		this.CanBoost = false;
		this.TimerCounter = 10;
		this.offang = 0; 

		this.Timer = this.game.time.create(false);  
		this.Adding = true;

		this.Timer.loop(10, () =>{
				if(this.Adding){
				this.offang += 2; 
				if(this.offang> 90){this.Adding = false;}
				}
				else {
				this.offang -= 2; 
				if(this.offang < 0){this.Adding = true;}
				}
		}, this);
		this.count = 0; 
 		this.Timer.start();
	}

	WaitBooster()
	{
		this.Timer = this.game.time.create(false);  

		this.count = 200; 
		this.Timer.loop(10, () =>{
				this.count --; 
				if(this.count <= 0 ) 
				{
				this.CanBoost = true; 
				this.Timer.stop(); 
				}
		}, this);

 		this.Timer.start();
	}

	update(Key, cursors, press_Space){
		if ( this.CanBoost){ 
			this.startBooster();
		}

		if(press_Space.isDown && !this.CanBoost && this.count <=0){
			this.Timer.stop();
			this.WaitBooster();

			var yaccel = Math.cos(this.sprite.angle*Math.PI/180); 
			var xaccel = Math.sin(this.sprite.angle*Math.PI/180); 

			this.player.body.velocity.x = 2000 * xaccel;
			this.player.body.velocity.y = -2000 * yaccel;
			this.emitter.start(false, 3000, 20, 50);
			explosion_sound.play();
		}

		if(this.player.facing == "Right"){}

		this.sprite.x = player.body.x + this.offX;
		this.sprite.y = player.body.y + this.offY;

		this.emitter.x = player.body.x + this.offX;
		this.emitter.y = player.body.y + this.offY;
		this.setAng();
	}
}
