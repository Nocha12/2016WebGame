Light.EntityContainer = function () {
    Light.Entity.call(this);
    this.children = [];
};

Light.EntityContainer.prototype = Object.create(Light.Entity.prototype);
Light.EntityContainer.constructor = Light.EntityContainer;

Light.EntityContainer.prototype.onRender = function (context) {
    this.children.forEach(function (child) {
        child.render(context);
    });
};

Light.EntityContainer.prototype.update = function (elapsed) {
    this.children.forEach(function (child) {
        child.update(elapsed);
    });
};

Light.EntityContainer.prototype.addChild = function (child) {
    child.parent = this;
    this.children.push(child);
};

Light.EntityContainer.prototype.removeChild = function (child) {
    this.children.splice(this.children.indexOf(child), 1);
};

Light.EntityContainer.prototype.removeChildren = function (from, to) {
    from = from || 0;
    to = to || this.children.length - 1;
    this.children.splice(from, to-from);
};