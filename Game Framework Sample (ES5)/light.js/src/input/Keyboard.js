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