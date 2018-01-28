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
        this.height_above_player = 15;

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
	if(target !== null)
		target.animations.play('target');

        this._target = target;
    }
}

class MissionGiver {
    constructor(game, x, y) {
        this.sprite = game.add.sprite(x, y, 'missiongiver');
        game.physics.arcade.enable(this.sprite);
        this.sprite.animations.add('idle', [0, 1], 4, true);
        this.sprite.animations.play('idle');
        this._exc = game.add.sprite(x + 4, y - 20, 'exclamation');
        this._exc_timer = game.time.create(false);
        this._exc_timer.loop(300, () => {
            this._exc.visible = !this._exc.visible;
        }, this);
        this.game = game;
        this._exc_timer.start();

        this._countdown = 3;
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
                this._mission_callback();
            }
        }, this);
    }

    update(game) {
        if (this._countdown_timer.running) {
            this._countdown_text.fontSize *= 0.95;
        }
    }

    destroy() {
        this.sprite.destroy();
        this._exc.destroy();
        this._countdown_text.destroy();
        this._countdown_timer.destroy();
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

    registerMissionCallback(callback) {
        this._mission_callback = callback;
    }
}

class Store {
    constructor(game, hud) {
        this._doneCallback = () => {};

        this._group = game.add.group();
        this._group.fixedToCamera = true;

        const margin = 170;
        this._gfx = game.make.graphics(0, 0);
        this._group.add(this._gfx);

        this._gfx.beginFill(0x000000, 0.5);
        this._gfx.drawRoundedRect(margin, margin, game.scale.width - 2*margin, game.scale.height - 2*margin);

        this._group.visible = false;

        this._title = game.add.text(
            margin + 30,
            margin + 30,
            'Great job! Spend wisely',
            {'fill': '#FFFFFF'},
            this._group
        );

        const items = [
            ['+Speed', 30, () => {
                xspeed += 50;
            }],
            ['Reagan', 50, () => {
                const regan = new Upgrade_Regan(game, player,20,20);  
                Upgrades.push(regan);
            }],
            ['Throw away money', 200, () => {
            }]
        ];

        const buttons = [];
        const rowY = margin + 70;
        const rowYDelta = 50;
        items.forEach(([name, cost, onClick], i) => {
            const text = game.add.text(
                margin + 60,
                rowY + i * rowYDelta,
                name + ': $' + cost,
                {'fill': '#FFFFFF'},
                this._group
            );
            text.inputEnabled = true;
            text.events.onInputDown.add(() => {
                if (hud.getDollars() - cost < 0) {
                    spawnFloatUpText(game.input.worldX, game.input.worldY, 'Not enough money', '#AAAAAA');
                } else {
                    hud.addDollars(-cost);
                    spawnFloatUpText(game.input.worldX, game.input.worldY, '- $'+cost.toString(), '#FF0000');
                    onClick();
                }
            });
            buttons.push(text);
        });

        const done = game.add.text(
            margin + 290, 390, 'Next round', {'fill': '#FFFFFF'}, this._group
        );
        done.inputEnabled = true;
        done.events.onInputDown.add(() => {
            this._group.visible = false;
            this._doneCallback();
        });
        buttons.push(done);

        buttons.forEach(button => {
            button.events.onInputOver.add(() => {
                button.setStyle({'fill': '#AAAAAA'});
            });
            button.events.onInputOut.add(() => {
                button.setStyle({'fill': '#FFFFFF'});
            });
        });
    }

    show(doneCallback) {
        this._group.visible = true;
        this._doneCallback = doneCallback;
    }
}

class Hud {
    constructor(game) {
        this._group = game.add.group();
        this._group.fixedToCamera = true;

        const xmargin = 30;
        const ymargin = 15;
        const yspacing = 10;
        const width = 230;
        const height = 150;
        const textstyle = {'fill': '#EEEEEE'};

        this._group.cameraOffset = new Phaser.Point(game.scale.width - width, 0.0);


        this._gfx = game.make.graphics(0, 0);
        this._gfx.beginFill(0x000000, 0.3);
        this._gfx.drawRoundedRect(0, 0, width, height);
        this._group.add(this._gfx);

        this._mode = 'dormant';
        this._timeLeftText = game.add.text(xmargin, ymargin, '', textstyle, this._group);
        this._secondsLeft = 0.0;
        this._warningSeconds = 0.0;
        this._timeUpCallback = () => {};

        this._dollarsText = game.add.text(xmargin, yspacing + this._timeLeftText.height, 'Cash: $0', textstyle, this._group);
        this._dollars = 0;
    }

    update(game) {
        if (this._mode === 'mission' && this._secondsLeft === 0) {
            this._mode = 'warning';
            this._warningSeconds = 1.0;
        }
        if (this._mode === 'warning' && this._warningSeconds === 0) {
            this._timeUpCallback();
            this._mode = 'dormant';
        }

        if (this._mode === 'dormant') {
            this._timeLeftText.visible = true;
            this._timeLeftText.text = 'Time: -';
        } else if (this._mode === 'mission') {
            this._timeLeftText.visible = true;
            this._secondsLeft = Math.max(
                0.0,
                this._secondsLeft - game.time.physicsElapsed
            );
            const _jiffies = Math.floor((this._secondsLeft % 1) * 60.0);
            const _wholeSecs = Math.floor(this._secondsLeft);
            this._timeLeftText.text = ('Time: '
                                       + _wholeSecs.toString().padStart(2, '0')
                                       + ':' + _jiffies.toString().padStart(2, '0'));
        } else if (this._mode === 'warning') {
            this._warningSeconds = Math.max(
                0.0,
                this._warningSeconds - game.time.physicsElapsed
            );
            this._timeLeftText.visible = (this._warningSeconds % 0.5) < 0.25;
        }
    }

    startTimer(seconds) {
        this._mode = 'mission';
        this._secondsLeft = seconds;
    }

    addTime(seconds) {
        if (this._mode === 'mission') {
            this._secondsLeft += seconds;
        }
    }

    addDollars(dollars) {
        this._dollars += dollars;
        this._dollarsText.text = 'Cash: $' + Math.round(this._dollars);
    }

    makeDormant() {
        this._mode = 'dormant';
    }

    getDollars() {
        return this._dollars;
    }

    registerTimeUpCallback(callback) {
        this._timeUpCallback = callback;
    }
}

class Objectives {
    constructor(game) {
        this.group = game.add.group();
        this.group.enableBody = true;
        this.indicator = new Indicator(game);
        this.route = [];
        this.routedists = [];
        this.route_cursor = null;
        this._collectCallback = () => {};
        this._doneCallback = () => {};
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
                const child = this.group.create(point.x, point.y, 'objectiveDude1',2);
		child.animations.add('target', [0, 1], 4, true);
		child.animations.add('rest', [2], 4, true);
		child.body.gravity.y = 1500;
		child.body.collideWorldBounds = true;
                child.difficulty = difficulty;
            });
        });
	return this.group;
    }

    // Compute this.route, the objectives that need to be visited in order.
    // startpoint: Phaser.Point: current player position
    // enabled_difficulties: Array[int]: the difficulty levels to include
    beginRoute(startpoint, enabled_difficulties) {
        const available = this.group.children.filter(child =>
            //enabled_difficulties.includes(child.difficulty)
            Math.random() > 0.6
        );

        const route = [];
        const routedists = [];
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
            routedists.push(bestdist);
            from = available[bestindex].position;
            available.splice(bestindex, 1);
        }

        this.route = route;
        this.routedists = routedists;
        this.route_cursor = 0;
    }

    collidePlayer(player, objective) {
        if (this.route_cursor !== null && objective === this.route[this.route_cursor]) {
            if (this.route_cursor + 1 < this.route.length) {
                this.route_cursor += 1;
                this._collectCallback(objective, this.routedists[this.route_cursor]);
		objective.animations.play('rest'); 
            } else {
                this._doneCallback();
                this.route_cursor = null;
            }
        }
    }

    // Trigger a callback when an objective is reached, with the sprite that was reached,
    // and the euclidean distance to the next goal.
    registerCollectCallback(callback) {
        this._collectCallback = callback;
    }

    registerDoneCallback(callback) {
        this._doneCallback = callback;
    }
}
