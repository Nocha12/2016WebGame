Light.Mouse = function (game) {
    this.game = game;
    this.position = new Light.Point();
    this.buttonPressed = [];
    window.addEventListener('mouseup', Light.Mouse.prototype.onMouseUp.bind(this));
    window.addEventListener('mousedown', Light.Mouse.prototype.onMouseDown.bind(this));
    window.addEventListener('mousemove', Light.Mouse.prototype.onMouseMove.bind(this));
};

Light.Mouse.prototype.contructor = Light.Mouse;

Light.Mouse.prototype.update = function (elapsed) {
    var _this = this;
    this.buttonPressed.forEach(function (value, index) {
        _this.buttonPressed[index].time += elapsed;
    });
};

Light.Mouse.prototype.onMouseUp = function (e) {
    delete this.buttonPressed[e.button];
};

Light.Mouse.prototype.onMouseDown = function (e) {
    this.buttonPressed[e.button] = {time: 0, justPressed: true};
};

Light.Mouse.prototype.onMouseMove = function (e) {
    var rect = this.game.canvas.getBoundingClientRect();
    this.x = e.clientX - rect.left;
    this.y = e.clientY - rect.top;
};

Light.Mouse.prototype.isJustPressed = function (button) {
    var result;
    if ((result = button in this.buttonPressed && this.buttonPressed[button].justPressed)) {
        this.buttonPressed[button].justPressed = false;
    }
    return result;
};

Light.Mouse.prototype.isPressed = function (button) {
    return button in this.buttonPressed;
};

Object.defineProperties(Light.Mouse.prototype, {
    'x': {
        get: function () { return this.position.x; },
        set: function (value) { this.position.x = value; }
    },
    'y': {
        get: function () { return this.position.y; },
        set: function (value) { this.position.y = value; }
    }
});

Light.Mouse.LEFT = 0;
Light.Mouse.MIDDLE = 1;
Light.Mouse.RIGHT = 2;