Light.Rectangle = function (x, y, width, height) {
    this.x = x || 0;
    this.y = y || 0;
    this.width = width || 0;
    this.height = height || 0;
};

Light.Rectangle.constructor = Light.Rectangle;

Light.Rectangle.prototype.getCenter = function () {
    return new Light.Point(this.x + this.width / 2, this.y + this.height / 2);
};

Light.Rectangle.prototype.intersects = function (rect) {
    return !(this.x + this.width < rect.x || this.y + this.height < rect.y || rect.x + rect.width < this.x || rect.y + rect.height < this.y);
};

Light.Rectangle.prototype.contains = function (point) {
    return !(this.x > point.x || this.x + this.width < point.x || this.y > point.y || this.y + this.height < point.y);
};

Light.Rectangle.prototype.getIntersect = function (rect) {
    if (this.intersects(rect)) {
        var x = Math.max(this.x, rect.x);
        var y = Math.max(this.y, rect.y);
        var width = Math.min(this.x + this.width, rect.x + rect.width) - x;
        var height = Math.min(this.y + this.height, rect.y + rect.height) - y;
        return new Light.Rectangle(x, y, width, height);
    }
    return null;
};

Light.Rectangle.prototype.clone = function () {
    return new Light.Rectangle(this.x, this.y, this.width, this.height);
};