class Upgrade_Regan{
	constructor(game, player, offX, offY ) {
		this.spriteRegan = game.add.sprite(0, 0, 'TheRegan');
		game.physics.arcade.enable(this.spriteRegan);
		this.spriteRegan.animations.add('mainRegan', [0, 1, 2, 3, 4, 5, 6], 10, true); 
		this.spriteRegan.animations.play('mainRegan');

		this.spriteRegan.x = player.body.x + offX;
		this.spriteRegan.y = player.body.y + offY;
        this.accel = Math.random() * 2000;
        const scale = 0.5 + 0.5 * (Math.random() * 2);
        this.spriteRegan.scale.x = scale;
        this.spriteRegan.scale.y = scale;
	}

	update(Key, cursors, press_Space){
		if(this.spriteRegan.centerX < player.centerX) {
            if (this.spriteRegan.body.acceleration.x < 0) {
                this.spriteRegan.body.velocity.x *= 1/2;
            }
            this.spriteRegan.body.acceleration.x = this.accel;
        }

		if(this.spriteRegan.centerX > player.centerX) {
            if (this.spriteRegan.body.acceleration.x > 0) {
                this.spriteRegan.body.velocity.x *= 1/2;
            }
            this.spriteRegan.body.acceleration.x = -this.accel;
        }

		if(this.spriteRegan.centerY < player.centerY) {
            if (this.spriteRegan.body.acceleration.y < 0) {
                this.spriteRegan.body.velocity.y *= 1/2;
            }
            this.spriteRegan.body.acceleration.y = this.accel;
        }

		if(this.spriteRegan.centerY > player.centerY) {
            if (this.spriteRegan.body.acceleration.y > 0) {
                this.spriteRegan.body.velocity.y *= 1/2;
            }
            this.spriteRegan.body.acceleration.y = -this.accel;
        }
	}
}
