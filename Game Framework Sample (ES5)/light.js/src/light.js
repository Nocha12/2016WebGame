var Light = Light || {
    VERSION: '0.1.3',
    games: [],
    
    degToRad: function (deg) { return deg * Math.PI / 180; },
    radToDeg: function (rad) { return rad * 180 / Math.PI; },
    randomIn: function (min, max) { return Math.floor(Math.random()*(max-min+1)+min); }
};