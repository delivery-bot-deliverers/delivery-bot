const clamp = function clamp(num, low, high) {
    if (num < low) {
        return low;
    } else if (num > high) {
        return high;
    } else {
        return num;
    }
};

class Indicator {
    constructor(game) {
        this._gfx = game.add.graphics(0, 0);
        this._gfx.fixedToCamera = true;

        const width = 3;
        const color = 0xFF0000;
        const alpha = 1;
        this._gfx.lineStyle(width, color, alpha);

        this.radius = 20;
        this.height_above_player = 40;

        this._gfx.moveTo(0, -this.radius);
        this._gfx.lineTo(1.5 * this.radius, 0);
        this._gfx.lineTo(0, this.radius);

        this._gfx.beginFill(color);
        this._gfx.drawCircle(0, 0, 2 * this.radius);
        this._gfx.endFill();

        this._target = null;
    }

    update(game) {
        if (this._target === null) {
            return;
        }

        // in viewport coordinates
        const targetX = this._target.centerX - game.camera.x;
        const targetY = this._target.centerY - game.camera.y;
        const targetTop = this._target.y - game.camera.y;

        const spacing = 1.8 * this.radius;

        const left = spacing;
        const right = game.scale.width - spacing;
        const thetop = spacing;
        const bottom = game.scale.height - spacing;

        if (left < targetX && targetX < right && thetop < targetY && targetY < bottom) {
            this._gfx.cameraOffset = new Phaser.Point(
                targetX,
                targetTop - this.height_above_player
            );
            this._gfx.rotation = Math.PI / 2;

        } else {
            this._gfx.cameraOffset = new Phaser.Point(
                clamp(
                    targetX,
                    left,
                    right
                ),
                clamp(
                    targetY,
                    thetop,
                    bottom
                )
            );

            const deltaX = this._target.centerX - this._gfx.x;
            const deltaY = this._target.centerY - this._gfx.y;
            this._gfx.rotation = Math.atan2(deltaY, deltaX);
        }
    }

    setTarget(target) {
        this._target = target;
    }
}

class MissionGiver {
    constructor(game, x, y) {
        this.sprite = game.add.sprite(x, y, 'missiongiver');
        game.physics.arcade.enable(this.sprite);
        this._exc = game.add.sprite(x, y - 40, 'exclamation');
        this._exc_timer = game.time.create(false);
        this._exc_timer.loop(300, () => {
            this._exc.visible = !this._exc.visible;
        }, this);
        this.game = game;
        this._exc_timer.start();

        this._countdown = 5;
        this._countdown_text = game.add.text(
            0,
            0,
            this._countdown.toString(),
            {'fill': '#FF0000'}
        );
        this._countdown_text.fixedToCamera = true;
        this._countdown_text.cameraOffset = new Phaser.Point(
            game.scale.width / 2,
            game.scale.height / 2
        );
        this._countdown_text.anchor = new Phaser.Point(0.5, 0.5);
        this._countdown_text.fontSize = 500;
        this._countdown_text.visible = false;
        this._countdown_timer = game.time.create(false);
        this._countdown_timer.loop(1000, () => {
            this._countdown_text.fontSize = 500;
            this._countdown -= 1;
            this._countdown_text.text = this._countdown.toString();
            if (this._countdown == 0) {
                this._countdown_timer.stop();
                this._countdown_text.visible = false;
            }
        }, this);
    }

    update(game) {
        if (this._countdown_timer.running) {
            this._countdown_text.fontSize *= 0.98;
        }
    }

    collidePlayer() {
        if (this._countdown !== 0 &&
                this.game.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR)) {
            this._exc.visible = false;
            this._exc_timer.stop();
            this._countdown_text.visible = true;
            this._countdown_timer.start();
        }
    }
}

class Objectives {
    constructor(game) {
        this.group = game.add.group();
        this.group.enableBody = true;
        this.indicator = new Indicator(game);
    }

    update(game) {
        if (this.group.children.length == 0) {
            return;
        }

        this.indicator.setTarget(this.group.children[0]);
        this.indicator.update(game);
    }

    // Takes objective locations in ascending categories of difficulty.
    // Array[Array[Phaser.Point]].
    // Creates sprites in this.group with difficulties attached
    populate(pointsByCategory) {
        this.group.children.forEach(sprite => {
            sprite.destroy();
        });
        pointsByCategory.forEach(category => {
            category.forEach((point, difficulty) => {
                const child = this.group.create(point.x, point.y, 'star');
                child.body.gravity.y = 20;
                child.body.bounce.y = 1;
                child.difficulty = difficulty;
            });
        });
    }

    collidePlayer() {
        // do something
    }
}
