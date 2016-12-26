Light.Emitter = function (game, imgSrc) {
    Light.EntityContainer.call(this);
    this.game = game;
    this.imgSrc = imgSrc;
    this.emitTimer = null;
    this.quantity = 0;
};

Light.Emitter.prototype = Object.create(Light.EntityContainer);
Light.Emitter.prototype.constructor = Light.Emitter;

Light.Emitter.prototype.emit = function (delay, repeatCount, quantity, minSpeed, maxSpeed, minLifeTime, maxLifeTime, minScale, maxScale, rotationSpeed) {
    this.quantity = quantity;
    this.emitTimer = new Light.Timer(this.game, delay, repeatCount, function () {

    });
};

Light.Emitter.prototype.update = function (elapsed) {
    Light.EntityContainer.prototype.update.apply(this, arguments);
    for (var i = 0; i < this.children.length; i++) {
        var p = this.children[i];
        p.rotation += p.rotationSpeed;
        //p.alpha = 
    }
};
