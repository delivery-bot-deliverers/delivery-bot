function spawnFloatUpText(x, y, thestring, color) {
    const durationMs = 1500;
    const pixelsPerSecond = 30;
    const text = game.add.text(x, y, thestring, {'fill': color});
    text.update = () => {
        text.y -= pixelsPerSecond * game.time.physicsElapsed;
    };
    game.time.events.add(durationMs, () => {
        text.destroy();
    }, this);
}

