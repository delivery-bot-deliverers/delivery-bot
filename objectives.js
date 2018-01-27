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

class Objectives {
    constructor(game, coordinates) {
        this.group = game.add.group();
        this.group.enableBody = true;
        coordinates.forEach(([x, y]) => {
            const child = this.group.create(x, y, 'star');
            child.body.gravity.y = 20;
            child.body.bounce.y = 1;
        });
        this.indicator = new Indicator(game);
        this.indicator.setTarget(this.group.children[0]);
    }

    update(game) {
        if (this.group.children.length == 0) {
            return;
        }

        this.indicator.setTarget(this.group.children[0]);
        this.indicator.update(game);
    }

    collidePlayer() {
        // do something
    }
}
