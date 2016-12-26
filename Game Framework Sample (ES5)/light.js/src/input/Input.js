Light.Input = function (game) {
    this.game = game;

    this.keyboard = new Light.Keyboard(game);
    this.mouse = new Light.Mouse(game);
};

Light.Input.constructor = Light.Input;

Light.Input.prototype.update = function (elapsed) {
    this.keyboard.update(elapsed);
    this.mouse.update(elapsed);
};