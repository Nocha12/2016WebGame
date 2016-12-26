Light.Point = function (x, y) {
    this.x = x || 0;
    this.y = y || 0;
};

Light.Point.constructor = Light.Point;

Light.Point.prototype.set = function (x, y) {
    this.x = x;
    this.y = y;
    return this;
};

Light.Point.prototype.add = function (point) {
    this.x += point.x;
    this.y += point.y;
    return this;
};

Light.Point.prototype.subtract = function (point) {
    this.x -= point.x;
    this.y -= point.y;
    return this;
};

Light.Point.prototype.multiply = function (point) {
    this.x *= point.x;
    this.y *= point.y;
    return this;
};

Light.Point.prototype.divide = function (point) {
    this.x /= point.x;
    this.y /= point.y;
    return this;
};

Light.Point.prototype.offset = function (x, y) {
    this.x += x;
    this.y += y;
    return this;
};

Light.Point.prototype.getRotation = function (point) {
    return Math.atan2(point.y - this.y, point.x - this.x);
};

Light.Point.prototype.getDistance = function (point) {
    return Math.sqrt(point.x * point.x + point.y * point.y);
};

Light.Point.prototype.clone = function () {
    return new Light.Point(this.x, this.y);
};