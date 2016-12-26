Light.Camera = function (game) {
    Light.EntityContainer.call(this);
    this.game = game;
    this.target = null;
    this.moveBounds = null;
    this.offset = new Light.Point();
    this.targetScale = new Light.Point(1, 1);
    this.width = this.game.width;
    this.height = this.game.height;
    this.smoothFollow = 1;
    this.smoothZoom = 1;
    this.shakeMax = new Light.Point();
    this.shakeTimer = new Light.Timer(this.game, 0, 1, function () {
        this.x += Light.randomIn(-this.shakeMax.x, this.shakeMax.x);
        this.y += Light.randomIn(-this.shakeMax.y, this.shakeMax.y);
    }.bind(this));
};

Light.Camera.prototype = Object.create(Light.EntityContainer.prototype);

Light.Camera.constructor = Light.Camera;

Light.Camera.prototype.reset = function () {
    this.position.set(0, 0);
    this.unfollow();
    this.smoothFollow = 1;
    this.smoothZoom = 1;
    this.shakeMax.set(0, 0);
    this.targetScale.set(1, 1);
};

Light.Camera.prototype.follow = function (entity, offset) {
    this.target = entity;
    if (offset instanceof Light.Point)
        this.offset = offset;
    else
        this.offset = new Light.Point();
};

Light.Camera.prototype.unfollow = function () {
    this.target = null;
    this.offset.x = 0;
    this.offset.y = 0;
};

Light.Camera.prototype.shake = function (delay, repeatCount, maxX, maxY) {
    this.shakeMax.x = maxX;
    this.shakeMax.y = maxY;
    this.shakeTimer.change(delay, repeatCount);
    this.shakeTimer.reset();
    this.shakeTimer.start();
};

Light.Camera.prototype.zoom = function (scaleX, scaleY) {
    this.targetScale.x = scaleX;
    this.targetScale.y = scaleY;
};

Light.Camera.prototype.localToScreen = function (point) {
    var p = new Light.Point();
    p.x = (point.x - this.x) * this.scale.x;
    p.y = (point.y - this.y) * this.scale.y;
    return p;
};

Light.Camera.prototype.screenToLocal = function (point) {
    var p = new Light.Point();
    p.x = (point.x / this.scale.x) + this.x;
    p.y = (point.y / this.scale.y) + this.y;
    return p;
};

Light.Camera.prototype.update = function (elapsed) {
    if (this.target === null) return;

    this.x += (this.target.x + this.target.width / 2 - this.width / 2 - this.offset.x - this.x) / this.smoothFollow;
    this.y += (this.target.y + this.target.height / 2 - this.height / 2 - this.offset.y - this.y) / this.smoothFollow;

    this.scale.x += (this.targetScale.x - this.scale.x) / this.smoothZoom;
    this.scale.y += (this.targetScale.y - this.scale.y) / this.smoothZoom;

    if (this.moveBounds) {
        var value;
        value = this.moveBounds.x;
        if (this.x <= value) {
            this.x = value;
        }
        value = this.moveBounds.width - this.width;
        if (this.x >= value) {
            this.x = value;
        }
        value = this.moveBounds.y;
        if (this.y <= value) {
            this.y = value;
        }
        value = this.moveBounds.height - this.height;
        if (this.y >= value) {
            this.y = value;
        }
    }
};