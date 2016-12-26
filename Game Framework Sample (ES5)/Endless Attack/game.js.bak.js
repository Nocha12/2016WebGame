var game = new Light.Game('game', 1100, 600, '#4b4b4b', function (preloader) {
    preloader.loadImages(['image/player.png', 'image/ground.png', 'image/bullet.png']);
});

var gameState = new Light.State(game);

Unit = function (imgSrc) {
    Light.Sprite.call(this, imgSrc);
    this.speed = 0;
    this.gravity = 0;
    this.isGravity = false;
    this.isCollideable = false;
};
Unit.prototype = Object.create(Light.Sprite.prototype);
Unit.prototype.constructor = Unit;

Player = function () {
    Unit.call(this, 'image/player.png');
    this.speed = 350;
    this.isGravity = true;
    this.isCollideable = true;
};
Player.prototype = Object.create(Unit.prototype);
Player.prototype.constructor = Player;

gameState.onInit = function () {
    this.game.input.keyboard.keyCapturing = [Light.Keyboard.A, Light.Keyboard.D, Light.Keyboard.W, Light.Keyboard.CONTROL, Light.Keyboard.ALTERNATE];
    
    this.entities = [];
    this.grounds = [];
    this.bullets = [];

    this.player = new Player();
    this.addChild(this.player);
    this.entities.push(this.player);
    
    this.grounds[0] = new Light.Sprite('image/ground.png');
    this.grounds[0].isCollideable = true;
    this.grounds[0].y = 600 - this.grounds[0].height;
    this.grounds[0].width = 2000;
    this.addChild(this.grounds[0]);
    
    this.grounds[1] = new Light.Sprite('image/ground.png');
    this.grounds[1].isCollideable = true;
    this.grounds[1].x = 100;
    this.grounds[1].y = 450;
    this.grounds[1].width = 100;
    this.addChild(this.grounds[1]);
    
    this.fpsText = new Light.TextField();
    this.fpsText.font = "20px Arial";
    this.fpsText.fillStyle = "#fff";
    this.game.camera.addChild(this.fpsText);
    
    this.testText = new Light.TextField();
    this.testText.font = this.fpsText.font;
    this.testText.fillStyle = this.fpsText.fillStyle;
    this.testText.x = 300;
    this.game.camera.addChild(this.testText);
    
    this.game.camera.smoothFollow = 7;
    this.game.camera.smoothZoom = 5;
    this.game.camera.follow(this.player, new Light.Point(0,100));
    
    this.gameArea = new Light.Rectangle(0, 0, 2000, 1200);
    this.game.camera.moveBounds = this.gameArea;
};
gameState.onUpdate = function (elapsed) {
    this.fpsText.text = 'fps : ' + this.game.fps;
    //this.testText.text = this.player.getBounds().contains(this.game.camera.screenToLocal(this.game.input.mouse.position));
    
    this.entities.forEach(function (entity) {
        if (entity.isGravity) {
            entity.gravity += 9.8 * elapsed + 50 * elapsed;
            entity.y += entity.gravity;
        }
    });

    this.grounds.forEach(function (ground) {
        for (var ekey in gameState.entities ) {
            var e = gameState.entities[ekey];
            if (!e.isCollideable) continue;
            
            var rect;
            if ((rect = ground.getIntersect(e)) !== null) {
                e.y -= rect.height;
                e.gravity = 0;
            }
        }
    });
    
    for (var i=0; i < this.bullets.length; i++) {
        bullet = this.bullets[i];
        bullet.x += Math.cos(bullet.rotation) * bullet.speed * elapsed;
        bullet.y += Math.sin(bullet.rotation) * bullet.speed * elapsed;
        
        if (!bullet.getBounds().intersects(this.gameArea)) {
            this.bullets.splice(this.bullets.indexOf(bullet),1);
            this.removeChild(bullet);
            bullet = null;
        }
    }
    
    if (this.game.input.keyboard.isPressed(Light.Keyboard.A)) {
        this.player.x -= this.player.speed * elapsed;
    }
    if (this.game.input.keyboard.isPressed(Light.Keyboard.D)) {
        this.player.x += this.player.speed * elapsed;
    }
    if (this.game.input.keyboard.isJustPressed(Light.Keyboard.W)) {
        this.player.gravity = -800 * elapsed;
    }
    if (this.game.input.mouse.isPressed(Light.Mouse.LEFT)) {
        var b = new Light.Sprite('image/bullet.png');
        b.x = this.player.x;
        b.y = this.player.y;
        b.speed = 1000;
        b.rotation = this.player.position.getRotation(this.game.camera.screenToLocal(this.game.input.mouse.position));
        
        this.bullets.push(b);
        this.addChild(b);
    }
    if (this.game.input.keyboard.isJustPressed(Light.Keyboard.CONTROL)) {
        this.game.camera.zoom(1, 1);
    }
    if (this.game.input.keyboard.isJustPressed(Light.Keyboard.ALTERNATE)) {
        this.game.camera.zoom(0.5, 0.5);
    }
};

game.states.add('mainGame', gameState);
game.states.change('mainGame');