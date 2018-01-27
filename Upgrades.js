class Upgrade_Booster{
	constructor(game, player,sprite) {
		this.player = player; 
		this.game = game; 	
		this.sprite = game.add.sprite(0, 0, sprite);
	}

	function update(){
		sprite.visible = false;
		if (cursors.z.isDown) {
			sprite.visible = true;
		}
		this.sprite.body.x = player.body.x;
		this.sprite.body.y = player.body.y;
	}
}
