class Objectives {
    constructor(game, coordinates) {
        this.group = game.add.group();
        this.group.enableBody = true;
        coordinates.forEach(([x, y]) => {
            const child = this.group.create(x, y, 'star');
            child.body.gravity.y = 6;
            child.body.bounce.y = 1;
        });
    }
}
