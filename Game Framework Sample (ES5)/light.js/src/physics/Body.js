Light.Body = function (parent) {
    Light.Entity.call(this);
    this.parent = parent;
    this.velocity = new Light.Point();
    this.maxVelocity = new Light.Point();
    this.gravity = new Light.Point();
    this.friction = new Light.Point(1, 1);
    this.touching = {top: false, left: false, right: false, bottom: false};
    this.isFixed = false;
    this.isGravityAllowed = true;
    this.isCollisionAllowed = true;
    this.prevParentPosition = new Light.Point();
};

Light.Body.prototype.update = function (elapsed) {
    this.prevParentPosition = this.parent.position;
    this.touching.top = false;
    this.touching.left = false;
    this.touching.right = false;
    this.touching.bottom = false;
};