Light.Timer = function (game, delay, repeatCount, callback) {
    this.game = game;
    this.change(delay, repeatCount);
    this.currentCount = 0;
    this.callback = callback;
    this.time = 0;
    this.running = false;
};

Light.Timer.prototype.start = function () {
    if (this.running) return;
    this.running = true;
    this.game.timers.push(this);
};

Light.Timer.prototype.stop = function () {
    if (!this.running) return;
    this.running = false;
    this.game.timers.splice(this.game.timers.indexOf(this), 1);
};

Light.Timer.prototype.reset = function () {
    this.running = false;
    this.currentCount = 0;
    this.time = 0;
};

Light.Timer.prototype.pause = function () {
    if (!this.running) return;
    this.running = false;
};

Light.Timer.prototype.resume = function () {
    if (this.running) return;
    this.running = true;
};

Light.Timer.prototype.change = function (delay, repeatCount) {
    this.delay = delay;
    this.repeatCount = (repeatCount !== 0) ? repeatCount : 1;
};

Light.Timer.prototype.update = function (elapsed) {
    if (this.running) {
        this.time += elapsed;
        if (this.time >= this.delay) {
            this.time = 0;
            this.callback();
            if (++this.currentCount == this.repeatCount) this.stop();
        }
    }
};