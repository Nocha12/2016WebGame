Light.Entity = function () {
    this.position = new Light.Point();
    this.rotation = 0;
    this.rotationCenter = new Light.Point();
    this.scale = new Light.Point(1, 1);
    this.scaleCenter = new Light.Point();
    this.alpha = 1;
    this.visible = true;
    this.parent = null;
    this._width = 1;
    this._height = 1;
};

Light.Entity.constructor = Light.Entity;

Light.Entity.prototype.render = function (context) {
    context.save();
    context.translate(this.x, this.y);

    context.translate(this.rotationCenter.x, this.rotationCenter.y);
    context.rotate(this.rotation);
    context.translate(-this.rotationCenter.x, -this.rotationCenter.y);

    context.translate(this.scaleCenter.x, this.scaleCenter.y);
    context.scale(this.scale.x, this.scale.y);
    context.translate(-this.scaleCenter.x, -this.scaleCenter.y);

    context.globalAlpha = this.alpha;

    this.onRender(context);
    context.restore();
};

Light.Entity.prototype.update = function (elapsed) {};

Light.Entity.prototype.getBounds = function () {
    return new Light.Rectangle(this.x, this.y, this.width, this.height);
};

Light.Entity.prototype.intersects = function (obj) {
    return this.getBounds().intersects(obj.getBounds());
};

Light.Entity.prototype.getIntersect = function (obj) {
    return this.getBounds().getIntersect(obj.getBounds());
};

Light.Entity.prototype.contains = function (point) {
    return this.getBounds().contains(point);
};

Object.defineProperties(Light.Entity.prototype, {
    'x': {
        get: function () { return this.position.x; },
        set: function (value) { this.position.x = value; }
    },
    'y': {
        get: function () { return this.position.y; },
        set: function (value) { this.position.y = value; }
    },
    'width': {
        get: function () { return this._width; },
        set: function (value) { this._width = value; }
    },
    'height': {
        get: function () { return this._height; },
        set: function (value) { this._height = value; }
    }
});