var Light = Light || {
    VERSION: '0.1.3',
    games: [],
    degToRad: function (deg) { return deg * Math.PI / 180; },
    radToDeg: function (rad) { return rad * 180 / Math.PI; },
    randomIn: function (min, max) { return Math.floor(Math.random()*(max-min+1)+min); }
};
(function () {
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
    
    
    Light.Asset = function (game) {
        this.game = game;
        this.loading = 0;
        this.loaded = 0;
        this.skip = false;
        this.toLoad = [];
        this.image = [];
        this.audio = [];
    };
    Light.Asset.prototype.startLoad = function (e) {
        this.loading = this.toLoad.length;
        for (var i = 0; i < this.loading; i++) {
            var a = this.toLoad[i];
            switch (a.type) {
                case 'image':
                    var img = new Image();
                    img.src = a.url;
                    img.index = i;
                    img.addEventListener('load', this.onLoad.bind(this));
                    break;
                case 'audio':
                    var aud = new Audio(a.url);
                    aud.index = i;
                    aud.addEventListener('load', this.onLoad.bind(this));
                    aud.dispatchEvent(new Event('load'));
                    break;
            }
        }
    };
    Light.Asset.prototype.onLoad = function (e) {
        var index = e.target.index;
        e.target.removeEventListener('load', this.onLoad);
        this[this.toLoad[index].type][this.toLoad[index].id] = e.target;
        
        this.loaded++;
        if (this.loaded == this.loading) {
            var evt;
            try {
                evt = new CusomEvent('preloaded');
            }
            catch (err) {
                //for IE
                evt = document.createEvent('CustomEvent');
                evt.initEvent('preloaded', false, false);
            }
            finally {
                document.dispatchEvent(evt);
                this.toLoad = [];
            }
        }
    };
    Light.Asset.prototype.loadImage = function (id, url) {
        this.toLoad.push({type: 'image', id: id, url: url});
    };
    Light.Asset.prototype.loadAudio = function (id, url) {
        this.toLoad.push({type: 'audio', id: id, url: url});
    };
    Light.Asset.prototype.getImage = function (id) {
        return this.image[id];
    };
    Light.Asset.prototype.getAudio = function (id) {
        return this.audio[id];
    };
    
    
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


    Light.StateManager = function (game) {
        this.game = game;
        this.states = {};
        this.currentState = null;
    };
    Light.StateManager.constructor = Light.StateManager;
    Light.StateManager.prototype.add = function (stateId, state) {
        if (state instanceof Light.State) {
            this.states[stateId] = state;
            return true;
        }
        return false;
    };
    Light.StateManager.prototype.remove = function (stateId) {
        if (stateId in this.states) {
            delete states[stateId];
            return true;
        }
        return false;
    };
    Light.StateManager.prototype.change = function (stateId) {
        this.currentState = this.states[stateId];
        if (this.game.inited) {
            this.game.camera.reset();
            this.game.physics.reset();
            this.currentState.removeChildren();
            this.currentState.onInit();
        }
    };
    Object.defineProperty(Light.StateManager.prototype, 'current', {
        get: function () { return this.currentState; }
    });


    Light.Input = function (game) {
        this.game = game;
        
        this.keyboard = new Light.Keyboard(game);
        this.mouse = new Light.Mouse(game);
    };
    Light.Input.constructor = Light.Input;
    Light.Input.prototype.update = function (elapsed) {
        this.keyboard.update(elapsed);
        this.mouse.update(elapsed);
    };


    Light.Keyboard = function (game) {
        this.game = game;
        this.keyPressed = [];
        this.keyCapturing = [];

        window.addEventListener('keydown', Light.Keyboard.prototype.onKeyDown.bind(this));
        window.addEventListener('keyup', Light.Keyboard.prototype.onKeyUp.bind(this));
    };
    Light.Keyboard.prototype.contructor = Light.Keyboard;
    Light.Keyboard.prototype.update = function (elapsed) {
        var _this = this;
        this.keyPressed.forEach(function (value, index) {
            _this.keyPressed[index].time += elapsed;
        });
    };
    Light.Keyboard.prototype.onKeyDown = function (e) {
        if (this.keyCapturing.indexOf(e.keyCode) != -1) {
            e.preventDefault();
            if (!(e.keyCode in this.keyPressed)) this.keyPressed[e.keyCode] = {time: 0, justPressed: true};
        }
    };
    Light.Keyboard.prototype.onKeyUp = function (e) {
        delete this.keyPressed[e.keyCode];
    };
    Light.Keyboard.prototype.isJustPressed = function (key) {
        var result;
        if ((result = key in this.keyPressed && this.keyPressed[key].justPressed)) {
            this.keyPressed[key].justPressed = false;
        }
        return result;
    };
    Light.Keyboard.prototype.isPressed = function (key) {
        return key in this.keyPressed;
    };
    Light.Keyboard.A = 'A'.charCodeAt(0);
    Light.Keyboard.B = 'B'.charCodeAt(0);
    Light.Keyboard.C = 'C'.charCodeAt(0);
    Light.Keyboard.D = 'D'.charCodeAt(0);
    Light.Keyboard.E = 'E'.charCodeAt(0);
    Light.Keyboard.F = 'F'.charCodeAt(0);
    Light.Keyboard.G = 'G'.charCodeAt(0);
    Light.Keyboard.H = 'H'.charCodeAt(0);
    Light.Keyboard.I = 'I'.charCodeAt(0);
    Light.Keyboard.J = 'J'.charCodeAt(0);
    Light.Keyboard.K = 'K'.charCodeAt(0);
    Light.Keyboard.L = 'L'.charCodeAt(0);
    Light.Keyboard.M = 'M'.charCodeAt(0);
    Light.Keyboard.N = 'N'.charCodeAt(0);
    Light.Keyboard.O = 'O'.charCodeAt(0);
    Light.Keyboard.P = 'P'.charCodeAt(0);
    Light.Keyboard.Q = 'Q'.charCodeAt(0);
    Light.Keyboard.R = 'R'.charCodeAt(0);
    Light.Keyboard.S = 'S'.charCodeAt(0);
    Light.Keyboard.T = 'T'.charCodeAt(0);
    Light.Keyboard.U = 'U'.charCodeAt(0);
    Light.Keyboard.V = 'V'.charCodeAt(0);
    Light.Keyboard.W = 'W'.charCodeAt(0);
    Light.Keyboard.X = 'X'.charCodeAt(0);
    Light.Keyboard.Y = 'Y'.charCodeAt(0);
    Light.Keyboard.Z = 'Z'.charCodeAt(0);
    Light.Keyboard.BACKSPACE = 8;
    Light.Keyboard.TAP = 9;
    Light.Keyboard.ENTER = 13;
    Light.Keyboard.COMMAND = 15;
    Light.Keyboard.SHIFT = 16;
    Light.Keyboard.CONTROL = 17;
    Light.Keyboard.ALTERNATE = 18;
    Light.Keyboard.CAPS_LOCK = 20;
    Light.Keyboard.ESCAPE = 27;
    Light.Keyboard.SPACE = 32;
    Light.Keyboard.PAGE_UP = 33;
    Light.Keyboard.PAGE_DOWN = 34;
    Light.Keyboard.END = 35;
    Light.Keyboard.HOME = 36;
    Light.Keyboard.LEFT = 37;
    Light.Keyboard.UP = 38;
    Light.Keyboard.RIGHT = 39;
    Light.Keyboard.DOWN = 40;
    Light.Keyboard.INSERT = 45;
    Light.Keyboard.DELETE = 46;
    Light.Keyboard.NUMBER_1 = 49;
    Light.Keyboard.NUMBER_2 = 50;
    Light.Keyboard.NUMBER_3 = 51;
    Light.Keyboard.NUMBER_4 = 52;
    Light.Keyboard.NUMBER_5 = 53;
    Light.Keyboard.NUMBER_6 = 54;
    Light.Keyboard.NUMBER_7 = 55;
    Light.Keyboard.NUMBER_8 = 56;
    Light.Keyboard.NUMBER_9 = 57;
    Light.Keyboard.NUMPAD_0 = 96;
    Light.Keyboard.NUMPAD_1 = 97;
    Light.Keyboard.NUMPAD_2 = 98;
    Light.Keyboard.NUMPAD_3 = 99;
    Light.Keyboard.NUMPAD_4 = 100;
    Light.Keyboard.NUMPAD_5 = 101;
    Light.Keyboard.NUMPAD_6 = 102;
    Light.Keyboard.NUMPAD_7 = 103;
    Light.Keyboard.NUMPAD_8 = 104;
    Light.Keyboard.NUMPAD_9 = 105;
    Light.Keyboard.NUMPAD_MULTIPLY = 106;
    Light.Keyboard.NUMPAD_ADD = 107;
    Light.Keyboard.NUMPAD_ENTER = 108;
    Light.Keyboard.NUMPAD_SUBTRACT = 109;
    Light.Keyboard.NUMPAD_DEMICAL = 110;
    Light.Keyboard.NUMPAD_DIVIDE = 111;
    Light.Keyboard.F1 = 112;
    Light.Keyboard.F2 = 113;
    Light.Keyboard.F3 = 114;
    Light.Keyboard.F4 = 115;
    Light.Keyboard.F5 = 116;
    Light.Keyboard.F6 = 117;
    Light.Keyboard.F7 = 118;
    Light.Keyboard.F8 = 119;
    Light.Keyboard.F9 = 120;
    Light.Keyboard.F10 = 121;
    Light.Keyboard.F11 = 122;
    Light.Keyboard.F12 = 123;
    Light.Keyboard.F13 = 124;
    Light.Keyboard.F14 = 125;
    Light.Keyboard.F15 = 126;
    Light.Keyboard.SEMICOLON = 186;
    Light.Keyboard.EQUAL = 187;
    Light.Keyboard.COMMA = 188;
    Light.Keyboard.MINUS = 189;
    Light.Keyboard.PERIOD = 190;
    Light.Keyboard.SLASH = 191;
    Light.Keyboard.BACKQUOTE = 192;
    Light.Keyboard.LEFTBRACKET = 219;
    Light.Keyboard.BACKSLASH = 220;
    Light.Keyboard.RIGHTBRACKET = 221;
    Light.Keyboard.QUOTE = 222;
    
    
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


    Light.State = function (game) {
        Light.EntityContainer.call(this);
        this.game = game;
    };
    Light.State.prototype = Object.create(Light.EntityContainer.prototype);
    Light.State.constructor = Light.State;
    Light.State.prototype.update = function (elapsed) {
        Light.EntityContainer.prototype.update.apply(this, arguments);
        this.onUpdate(elapsed);
    };
    

    Light.Sprite = function (src) {
        Light.EntityContainer.call(this);
        if (typeof src === 'string') {
            this.texture = new Image();
            this.texture.src = src;
        }
        else if (src instanceof Image || src.hasOwnProperty('src')) {
            this.texture = src;
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


    Light.TextField = function () {
        Light.Entity.call(this);
        this.text = '';
        this.font = '20px Arial';
        this.baseline = 'top';
        this.fillStyle = '#000000';
    };
    Light.TextField.prototype = Object.create(Light.Entity.prototype);
    Light.TextField.constructor = Light.TextField;
    Light.TextField.prototype.onRender = function (context) {
        context.font = this.font;
        context.fillStyle = this.fillStyle;
        context.textBaseline = this.baseline;
        context.fillText(this.text, 0, 0);
    };
    
    
//    Light.Emitter = function (game, imgSrc) {
//        Light.EntityContainer.call(this);
//        this.game = game;
//        this.imgSrc = imgSrc;
//        this.emitTimer = null;
//        this.quantity = 0;
//    };
//    Light.Emitter.prototype = Object.create(Light.EntityContainer);
//    Light.Emitter.prototype.constructor = Light.Emitter;
//    Light.Emitter.prototype.emit = function (delay, repeatCount, quantity, minSpeed, maxSpeed, minLifeTime, maxLifeTime, minScale, maxScale, rotationSpeed) {
//        this.quantity = quantity;
//        this.emitTimer = new Light.Timer(this.game, delay, repeatCount, function () {
//            
//        });
//    };
//    Light.Emitter.prototype.update = function (elapsed) {
//        Light.EntityContainer.prototype.update.apply(this, arguments);
//        for (var i = 0; i < this.children.length; i++) {
//            var p = this.children[i];
//            p.rotation += p.rotationSpeed;
//            p.alpha = 
//        }
//    };
    
//    Light.MovieClip = function (textures) {
//        
//    };
//    Light.MovieClip.prototype = Object.create(Light.Sprite.prototype);
//    Light.MovieClip.prototype.constructor = Light.MovieClip;
//    
//    
//    Light.SpriteSheet = function () {
//        
//    };
    
    
    Light.Physics = function (game) {
        this.game = game;
        this.entities = [];
        this.gravity = new Light.Point();
    };
    Light.Physics.prototype.contructor = Light.Physics;
    Light.Physics.prototype.reset = function () {
        this.entities = [];
        this.gravity.set(0, 0);
    };
    Light.Physics.prototype.add = function (entity) {
        entity.body =  new Light.Body(entity);
        this.entities.push(entity);
    };
    Light.Physics.prototype.remove = function (entity) {
        var index;
        if ((index = this.entities.indexOf(entity)) != -1) {
            delete entity.body;
            this.entities.splice(index, 1);
        }
    };
    Light.Physics.prototype.collide = function (entity1, entity2) {
        var rect;
        if ((rect = entity1.getIntersect(entity2)) !== null) {
            if (rect.width < rect.height) {
                if (entity1.getBounds().getCenter().x < entity2.getBounds().getCenter().x) {
                    entity1.body.touching.right = true;
                    entity2.body.touching.left = true;
                    if (!entity1.body.isFixed && !entity2.body.isFixed) {
                        entity1.x -= rect.width / 2;
                        entity2.x += rect.width / 2;
                    }
                    else if (!entity1.body.isFixed) {
                        entity1.x -= rect.width;
                    }
                    else if (!entity2.body.isFixed) {
                        entity2.x += rect.width;
                    }
                } else {
                    entity1.body.touching.left = true;
                    entity2.body.touching.right = true;
                    if (!entity1.body.isFixed && !entity2.body.isFixed) {
                        entity1.x += rect.width / 2;
                        entity2.x -= rect.width / 2;
                    }
                    else if (!entity1.body.isFixed) {
                        entity1.x += rect.width;
                    }
                    else if (!entity2.body.isFixed) {
                        entity2.x -= rect.width;
                    }
                }
                entity1.body.velocity.x = 0;
                entity2.body.velocity.x = 0;
            } else {
                if (entity1.getBounds().getCenter().y < entity2.getBounds().getCenter().y) {
                    entity1.body.touching.bottom = true;
                    entity2.body.touching.top = true;
                    if (!entity1.body.isFixed && !entity2.body.isFixed) {
                        entity1.y -= rect.height / 2;
                        entity2.y += rect.height / 2;
                    }
                    else if (!entity1.body.isFixed) {
                        entity1.y -= rect.height;
                    }
                    else if (!entity2.body.isFixed) {
                        entity2.y += rect.height;
                    }
                } else {
                    entity1.body.touching.top = true;
                    entity2.body.touching.bottom = true;
                    if (!entity1.body.isFixed && !entity2.body.isFixed) {
                        entity1.y += rect.height / 2;
                        entity2.y -= rect.height / 2;
                    }
                    else if (!entity1.body.isFixed) {
                        entity1.y += rect.height;
                    }
                    else if (!entity2.body.isFixed) {
                        entity2.y -= rect.height;
                    }
                }
                entity1.body.velocity.y = 0;
                entity2.body.velocity.y = 0;
            }
        }
    };
    Light.Physics.prototype.update = function (elapsed) {
        for (var i = 0; i < this.entities.length; i++) {
            var entity = this.entities[i];
            entity.body.onUpdate(elapsed);
            if (!entity.body.isFixed) {
                
                if (entity.body.isGravityAllowed) {
                    entity.body.velocity.x += (this.gravity.x + entity.body.gravity.x) * elapsed;
                    entity.body.velocity.y += (this.gravity.y + entity.body.gravity.y) * elapsed;
                }
                
                if (entity.body.velocity.x > entity.body.maxVelocity.x)
                    entity.body.velocity.x = entity.body.maxVelocity.x;
                else if (entity.body.velocity.x < -entity.body.maxVelocity.x)
                    entity.body.velocity.x = -entity.body.maxVelocity.x;
                if (entity.body.velocity.y > entity.body.maxVelocity.y)
                    entity.body.velocity.y = entity.body.maxVelocity.y;
                else if (entity.body.velocity.y < -entity.body.maxVelocity.y)
                    entity.body.velocity.y = entity.body.maxVelocity.y;
                
                entity.position.add(entity.body.velocity);
                entity.body.velocity.multiply(entity.body.friction);
            }
            
            if (!entity.body.isCollisionAllowed) continue;
            for (var j = 0; j < this.entities.length; j++) {
                if (entity === this.entities[j] || !this.entities[j].body.isCollisionAllowed) continue;
                this.game.physics.collide(entity, this.entities[j]);
            }
        }
    };
    
    
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
    };
    Light.Body.prototype.onUpdate = function (elapsed) {
        this.touching.top = false;
        this.touching.left = false;
        this.touching.right = false;
        this.touching.bottom = false;
    };
}());