Light.State = function (game) {
    Light.EntityContainer.call(this);
    this.game = game;
};

Light.State.prototype = Object.create(Light.EntityContainer.prototype);
Light.State.constructor = Light.State;

Light.State.prototype.update = function (elapsed) {
    Light.EntityContainer.prototype.update.apply(this, arguments);
    this.onUpdate(elapsed);
};