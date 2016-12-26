Light.Sprite = function (image) {
    Light.EntityContainer.call(this);
    if (typeof image === 'string') {
        this.texture = new Image();
        this.texture.src = image;
    }
    else if (image instanceof Image || image.hasOwnProperty('src')) {
        this.texture = image;
    }
};

Light.Sprite.prototype = Object.create(Light.EntityContainer.prototype);
Light.Sprite.prototype.constructor = Light.Sprite;

Light.Sprite.prototype.onRender = function (context) {
    context.drawImage(this.texture, 0, 0);
    Light.EntityContainer.prototype.onRender.apply(this, arguments);
};

Object.defineProperties(Light.Sprite.prototype, {
    'width': {
        get: function () { return this.texture.width * Math.abs(this.scale.x); },
        set: function (value) { this.scale.x = Math.abs(value) / this.texture.width; }
    },
    'height': {
        get: function () { return this.texture.height * Math.abs(this.scale.y); },
        set: function (value) { this.scale.y = Math.abs(value) / this.texture.height; }
    }
});