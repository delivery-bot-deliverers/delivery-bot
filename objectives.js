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
            this._gfx.visible = false;
            return;
        }

        this._gfx.visible = true;

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

    /// Note target may be set to null to hide indicator.
    setTarget(target) {
        this._target = target;
    }
}

class MissionGiver {
    constructor(game, x, y) {
        this.sprite = game.add.sprite(x, y, 'missiongiver');
        game.physics.arcade.enable(this.sprite);
        this.sprite.animations.add('idle', [0, 1], 4, true);
        this.sprite.animations.play('idle');
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
        this._mission_callback = () => {};
        this._countdown_timer.loop(500, () => {
            this._countdown_text.fontSize = 500;
            this._countdown -= 1;
            this._countdown_text.text = this._countdown.toString();
            if (this._countdown == 0) {
                this._countdown_timer.stop();
                this._countdown_text.visible = false;
                this._mission_callback.call(this._callbackcontext);
            }
        }, this);
        this._callbackcontext = this;
    }

    update(game) {
        if (this._countdown_timer.running) {
            this._countdown_text.fontSize *= 0.95;
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

    registerMissionCallback(callback, context) {
        this._mission_callback = callback;
        this._callback_context = context;
    }
}

class Objectives {
    constructor(game) {
        this.group = game.add.group();
        this.group.enableBody = true;
        this.indicator = new Indicator(game);
        this.route = [];
        this.route_cursor = null;
    }

    update(game) {
        if (this.route_cursor === null) {
            this.indicator.setTarget(null);
        } else {
            this.indicator.setTarget(this.route[this.route_cursor]);
        }
        this.indicator.update(game);
    }

    // Takes objective locations in ascending categories of difficulty.
    // Array[Array[Phaser.Point]].
    // Creates sprites in this.group with difficulties attached
    populate(pointsByCategory) {
        this.group.children.forEach(sprite => {
            sprite.destroy();
        });
        pointsByCategory.forEach((category, difficulty) => {
            category.forEach(point => {
                const child = this.group.create(point.x, point.y, 'star');
                child.difficulty = difficulty;
            });
        });
    }

    // Compute this.route, the objectives that need to be visited in order.
    // startpoint: Phaser.Point: current player position
    // enabled_difficulties: Array[int]: the difficulty levels to include
    beginRoute(startpoint, enabled_difficulties) {
        const available = this.group.children.filter(child =>
            enabled_difficulties.includes(child.difficulty)
        );

        const route = [];
        let from = startpoint;
        while (available.length > 0) {
            let bestdist = Infinity;
            let bestindex = null;
            available.forEach((to, index) => {
                const deltaX = from.x - to.x;
                const deltaY = from.y - to.y;
                const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                if (dist < bestdist) {
                    bestdist = dist;
                    bestindex = index;
                }
            });

            route.push(available[bestindex]);
            from = available[bestindex].position;
            available.splice(bestindex, 1);
        }

        this.route = route;
        this.route_cursor = 0;
    }

    collidePlayer(player, objective) {
        if (this.route_cursor !== null && objective === this.route[this.route_cursor]) {
            if (this.route_cursor + 1 < this.route.length) {
                this.route_cursor += 1;
            } else {
                this.route_cursor = null;
            }
        }
    }
}
