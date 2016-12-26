Light.Game = function (parentId, width, height, backgroundColor, onPreload) {
    this.inited = false;
    this.parentId = parentId;
    this.width = width || 800;
    this.height = height || 600;
    this.backgroundColor = backgroundColor || '#fff';

    this.asset = new Light.Asset(this);
    this.states = new Light.StateManager(this);

    Light.games.push(this);

    onPreload(this.asset);

    document.addEventListener('DOMContentLoaded', this.asset.startLoad.bind(this.asset), true);
    document.addEventListener('preloaded', this.init.bind(this));
};

Light.Game.constructor = Light.Game;

Light.Game.prototype.init = function () {
    document.removeEventListener('DOMContentLoaded', this.asset.start, true);
    document.removeEventListener('preloaded', this.init);

    if (typeof this.parentId === 'string') {
        this.parent = document.getElementById(this.parentId);
    } else {
        this.parent = document.body;
    }
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.parent.appendChild(this.canvas);
    this.context = this.canvas.getContext('2d');

    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var i = 0; i < vendors.length && !window.requestAnimationFrame; i++)
    {
        window.requestAnimationFrame = window[vendors[i] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[i] + 'CancelAnimationFrame'];
    }
    this.rafId = window.requestAnimationFrame(this.run.bind(this));

    this.camera = new Light.Camera(this);
    this.input = new Light.Input(this);
    this.physics = new Light.Physics(this);
    this.timers = [];
    this.time = Date.now();
    this.fpsStartTime = Date.now();
    this.fps = 60;

    this.inited = true;
    this.states.current.onInit();
};

Light.Game.prototype.run = function () {
    this.elapsed = (Date.now() - this.time) / 1000;
    if (Date.now() - this.fpsStartTime > 500) {
        this.fpsStartTime = Date.now();
        this.fps = Math.round(1 / this.elapsed);
        if (this.fps > 60) this.fps = 60;
    }
    this.update(this.elapsed);
    this.render();
    this.time = Date.now();

    this.rafId = window.requestAnimationFrame(this.run.bind(this));
};

Light.Game.prototype.resume = function () {
    this.rafId = window.requestAnimationFrame(this.run.bind(this));
    var i = this.timers.length;
    while (i--) this.timers[i].resume();
};

Light.Game.prototype.pause = function () {
    window.cancelAnimationFrame(rafId);
    var i = this.timers.length;
    while (i--) this.timers[i].pause();
};

Light.Game.prototype.update = function (elapsed) {
    this.input.update(elapsed);
    this.camera.update(elapsed);
    this.physics.update(elapsed);
    this.timers.forEach(function (timer) {
        timer.update(elapsed);
    });
    if (this.states.current !== null)
        this.states.current.update(elapsed);
};

Light.Game.prototype.render = function () {
    var currentState = this.states.current;
    var _this = this;
    var child;

    this.context.save();
    this.context.fillStyle = this.backgroundColor;
    this.context.fillRect(0, 0, this.width, this.height);

    var targetX, targetY;
    targetX = this.camera.width / 2;
    targetY = this.camera.height / 2;
    this.context.translate(targetX, targetY);
    this.context.scale(this.camera.scale.x, this.camera.scale.y);
    this.context.translate(-targetX, -targetY);

    this.context.translate(-this.camera.x, -this.camera.y);

    currentState.children.forEach(function (child) {
        child.render(_this.context);
    });

    this.context.restore();
    this.camera.children.forEach(function (child) {
        child.render(_this.context);
    });
};