(function () {
    var game = new Light.Game('game', 1100, 600, '#004A7B', function (asset) {
        asset.loadImage('e1', 'image/enemy1.png');
        asset.loadImage('e2', 'image/enemy2.png');
        asset.loadImage('player', 'image/player.png');
        asset.loadImage('g1', 'image/ground1.png');
        asset.loadImage('g2', 'image/ground2.png');
        asset.loadImage('bullet', 'image/bullet.png');
        asset.loadImage('weapon', 'image/weapon.png');
        asset.loadImage('back', 'image/back.png');
        asset.loadAudio('gunfire', 'audio/gun.wav');
    });

    var introState = new Light.State(game);
    var gameState = new Light.State(game);
    var endState = new Light.State(game);
    var score = 0;
    
    introState.onInit = function () {
        this.addChild(new Light.Sprite(game.asset.getImage('back')));
        this.titleText = new Light.TextField();
        this.titleText.font = "96px Dosis";
        this.titleText.fillStyle = "#fff";
        this.titleText.position.set(30, 300);
        this.titleText.text = 'Endless Attack';
        this.addChild(this.titleText);
        
        this.infoText = new Light.TextField();
        this.infoText.font = "30px Dosis";
        this.infoText.fillStyle = "#fff";
        this.infoText.position.set(40, 400);
        this.infoText.text = 'Click to Start';
        this.addChild(this.infoText);
    };
    introState.onUpdate = function () {
        if (game.input.mouse.isJustPressed(Light.Mouse.LEFT)) game.states.change('mainGame');
    };
    
    Unit = function (imgSrc, speed) {
        Light.EntityContainer.call(this);
        this.sprite = new Light.Sprite(imgSrc);
        this.addChild(this.sprite);
        game.physics.add(this);
        this.body.maxVelocity.x = speed;
        this.body.maxVelocity.y = speed * 2;
        this.speed = speed;

        this.width = this.sprite.width;
        this.height = this.sprite.height;
    };
    Unit.prototype = Object.create(Light.EntityContainer.prototype);
    Unit.prototype.constructor = Unit;

    Player = function () {
        Unit.call(this, game.asset.getImage('player'), 25);
        this.body.friction.x = 0.95;
        this.canDoubleJump = true;
        this.weapon = new Weapon();
        this.weapon.x = 10;
        this.weapon.y = 17;
        this.weapon.rotationCenter.x = 4;
        this.weapon.rotationCenter.y = 5;
        this.addChild(this.weapon);
        this.sprite.scaleCenter.x = this.width / 2;
        this.weapon.scaleCenter.y = 5;
        this.hp = 300;
    };
    Player.prototype = Object.create(Unit.prototype);
    Player.prototype.constructor = Player;

    Enemy1 = function () {
        Unit.call(this, game.asset.getImage('e1'), 5);
        this.body.friction.x = 0.95;
        this.sprite.scaleCenter.x = this.width / 2;
        this.hp = 2;
    };
    Enemy1.prototype = Object.create(Unit.prototype);
    Enemy1.prototype.contructor = Enemy1;

    Enemy2 = function () {
        Unit.call(this, game.asset.getImage('e2'), 6);
        this.sprite.scaleCenter.x = this.width / 2;
        this.body.isGravityAllowed = false;
        this.body.isCollisionAllowed = false;
        this.body.friction.set(0.95, 0.95);
        this.hp = 3;
    };
    Enemy2.prototype = Object.create(Unit.prototype);
    Enemy2.prototype.contructor = Enemy2;

    Weapon = function () {
        Light.Sprite.call(this, game.asset.getImage('weapon'));
        this.shootDelay = 50;
        this.lastShootTime = Date.now();
    };
    Weapon.prototype = Object.create(Light.Sprite.prototype);
    Weapon.prototype.constructor = Weapon;

    gameState.onInit = function () {
        game.input.keyboard.keyCapturing = [Light.Keyboard.A, Light.Keyboard.D, Light.Keyboard.W, Light.Keyboard.CONTROL, Light.Keyboard.ALTERNATE, Light.Keyboard.ESCAPE];
        score = 0;
        this.SPAWN_DELAY = 1.5;

        this.enemies = [];
        this.grounds = [];
        this.bullets = [];
        this.gameTime = Date.now();

        this.addChild(new Light.Sprite(game.asset.getImage('back')));

        this.grounds[0] = new Light.Sprite(game.asset.getImage('g1'));
        this.grounds[0].y = 1100;
        this.addChild(this.grounds[0]);
        game.physics.add(this.grounds[0]);
        this.grounds[0].body.isFixed = true;

        this.grounds[1] = new Light.Sprite(game.asset.getImage('g2'));
        this.grounds[1].x = 400;
        this.grounds[1].y = 900;
        this.addChild(this.grounds[1]);
        game.physics.add(this.grounds[1]);
        this.grounds[1].body.isFixed = true;

        this.grounds[2] = new Light.Sprite(game.asset.getImage('g2'));
        this.grounds[2].x = 60;
        this.grounds[2].y = 700;
        this.addChild(this.grounds[2]);
        game.physics.add(this.grounds[2]);
        this.grounds[2].body.isFixed = true;
        
        this.grounds[3] = new Light.Sprite(game.asset.getImage('g2'));
        this.grounds[3].x = 600;
        this.grounds[3].y = 700;
        this.addChild(this.grounds[3]);
        game.physics.add(this.grounds[3]);
        this.grounds[3].body.isFixed = true;
        
        this.grounds[4] = new Light.Sprite(game.asset.getImage('g2'));
        this.grounds[4].x = 800;
        this.grounds[4].y = 850;
        this.grounds[4].width = 400;
        this.addChild(this.grounds[4]);
        game.physics.add(this.grounds[4]);
        this.grounds[4].body.isFixed = true;
        
        this.grounds[5] = new Light.Sprite(game.asset.getImage('g2'));
        this.grounds[5].x = 1400;
        this.grounds[5].y = 900;
        this.grounds[5].width = 500;
        this.addChild(this.grounds[5]);
        game.physics.add(this.grounds[5]);
        this.grounds[5].body.isFixed = true;

        this.unitLayer = new Light.EntityContainer();
        this.addChild(this.unitLayer);

        this.player = new Player();
        this.player.x = 100;
        this.player.y = 400;
        this.unitLayer.addChild(this.player);

        this.lightSprite = new Light.Sprite('image/light.png');
        this.addChild(this.lightSprite);

        this.scoreText = new Light.TextField();
        this.scoreText.font = "70px Dosis";
        this.scoreText.fillStyle = "#fff";
        this.scoreText.position.set(30, 30);
        game.camera.addChild(this.scoreText);
        
        this.hpText = new Light.TextField();
        this.hpText.font = "30px Dosis";
        this.hpText.fillStyle = "#fff";
        this.hpText.position.set(30, 100);
        game.camera.addChild(this.hpText);

        game.camera.smoothFollow = 7;
        game.camera.smoothZoom = 5;
        game.camera.follow(this.player, new Light.Point(0, 100));

        this.gameArea = new Light.Rectangle(0, 0, 2000, 1200);
        game.camera.moveBounds = this.gameArea;
        game.physics.gravity.y = 50;
        
        if (this.gameTimer) {
            game.timers.splice(game.timers.indexOf(this.gameTimer), 1);
        }
        this.gameTimer = new Light.Timer(game, this.SPAWN_DELAY, -1, function () {
            var e1 = new Enemy1();
            var e2 = new Enemy2();
            e1.y = 500;
            if (this.gameTimer.currentCount % 2) {
                e1.x = 0;
                e2.x = 200;
            }
            else {
                e1.x = this.gameArea.width - e1.width;
                e2.x = this.gameArea.width - 200;
            }
            this.enemies.push(e1);
            this.enemies.push(e2);
            this.unitLayer.addChild(e1);
            this.unitLayer.addChild(e2);
            if (this.SPAWN_DELAY > 0.2) {
                this.SPAWN_DELAY -= 0.1;
            }
        }.bind(this));
        this.gameTimer.start();
    };


    gameState.onUpdate = function (elapsed) {
        this.gameTime = Date.now();
        this.scoreText.text = score;
        this.hpText.text = 'HP ' + ((this.player.hp / 300) * 100).toFixed(2) + '%';
        
        this.scoreText.alpha += (0.3 - this.scoreText.alpha) / 15;
        this.hpText.alpha += (0.4 - this.hpText.alpha) / 15;

        //bullet
        for (var i = 0; i < this.bullets.length; i++) {
            var bullet = this.bullets[i];
            bullet.x += Math.cos(bullet.rotation) * bullet.speed * elapsed;
            bullet.y += Math.sin(bullet.rotation) * bullet.speed * elapsed;

            var isDead = false;
            for (var j = 0; j < this.enemies.length; j++) {
                if (this.enemies[j].contains(bullet.position)) {
                    isDead = true;
                    this.enemies[j].hp--;
                    break;
                }
            }
            if (!bullet.getBounds().intersects(this.gameArea)) isDead = true;
            if (isDead) {
                this.bullets.splice(this.bullets.indexOf(bullet), 1);
                this.removeChild(bullet);
                bullet = null;
            }
        }

        //enemy
        for (i = 0; i < this.enemies.length; i++) {
            var enemy = this.enemies[i];
            var isLeft = enemy.x > this.player.x;
            enemy.body.velocity.x += enemy.speed * elapsed * isLeft ? -1 : 1 * 0.5;
            enemy.sprite.scale.x = isLeft ? 1 : -1;
            if (enemy instanceof Enemy1) {
                if (enemy.body.touching.bottom) {
                    enemy.y--;
                    enemy.body.velocity.y = -10;
                }
            }
            else if (enemy instanceof Enemy2) {
                enemy.body.velocity.y += enemy.speed * elapsed * (enemy.y > this.player.y) ? -1 : 1 * 0.5;
            }

            if (this.player.intersects(enemy)) {
                this.player.hp--;
                this.hpText.alpha = 1;
                game.camera.shake(0.1, 3, 15, 15);
                if (this.player.hp <= 0) {
                    this.player.hp = 0;
                    game.camera.removeChild(this.hpText);
                    game.camera.removeChild(this.scoreText);
                    game.states.change('end');
                }
                else if (this.player.hp < 90) this.hpText.fillStyle = '#f00';
                else if (this.player.hp < 180) this.hpText.fillStyle = '#ffba00';
            }

            if (enemy.hp === 0) {
                this.enemies.splice(this.enemies.indexOf(enemy), 1);
                this.unitLayer.removeChild(enemy);
                game.physics.remove(enemy);
                enemy = null;
                score += 50 + 5 * this.gameTimer.currentCount;
                this.scoreText.alpha = 1;
            }
        }

        //player
        var localMousePos = game.camera.screenToLocal(game.input.mouse.position);
        var w = this.player.weapon;
        w.x += (10 - w.x) / 3;
        w.y += (17 - w.y) / 3;
        w.rotation = this.player.getBounds().getCenter().getRotation(localMousePos);
        if (w.rotation > Light.degToRad(-90) && w.rotation < Light.degToRad(90)) {
            this.player.sprite.scale.x = 1;
            w.scale.y = 1;
        }
        else {
            this.player.sprite.scale.x = -1;
            w.scale.y = -1;
        }
        if (game.input.keyboard.isPressed(Light.Keyboard.A)) {
            this.player.body.velocity.x -= this.player.speed * elapsed;
        }
        if (game.input.keyboard.isPressed(Light.Keyboard.D)) {
            this.player.body.velocity.x += this.player.speed * elapsed;
        }
        var isOnGround = this.player.body.touching.bottom;
        if (isOnGround) this.player.canDoubleJump = true;
        if (game.input.keyboard.isJustPressed(Light.Keyboard.W) && (isOnGround || this.player.canDoubleJump)) {
            this.player.y--;
            this.player.body.velocity.y = -15;
            if (!isOnGround) this.player.canDoubleJump = false;
        }
        if (game.input.mouse.isPressed(Light.Mouse.LEFT) && (this.gameTime - w.lastShootTime) > w.shootDelay) {
            var b = new Light.Sprite(game.asset.getImage('bullet'));
            b.rotation = w.rotation;
            b.rotationCenter.y = 5;
            b.position = this.player.getBounds().getCenter().offset(Math.cos(b.rotation) * 30, Math.sin(b.rotation) * 30);
            b.speed = 1500;
            w.lastShootTime = Date.now();
            w.position.offset(-Math.cos(b.rotation) * 5, -Math.sin(b.rotation) * 5);
            game.camera.shake(0.1, 1, 10, 10);
            var sound = game.asset.getAudio('gunfire');
            sound.currentTime = 0;
            sound.volume = 0.3;
            sound.play();
            this.bullets.push(b);
            this.addChild(b);
        }
    };
    
    endState.onInit = function () {
        game.backgroundColor = '#071e2e';
        this.scoreText = new Light.TextField();
        this.scoreText.font = "96px Dosis";
        this.scoreText.fillStyle = "#fff";
        this.scoreText.position.set(30, 300);
        this.scoreText.text = score;
        this.addChild(this.scoreText);
        
        this.infoText = new Light.TextField();
        this.infoText.font = "30px Dosis";
        this.infoText.fillStyle = "#fff";
        this.infoText.position.set(40, 400);
        this.infoText.text = 'Click to Restart';
        this.addChild(this.infoText);
        
        this.coolTime = 0;
    };
    endState.onUpdate = function (elapsed) {
        this.coolTime += elapsed;
        if (this.coolTime > 1 && game.input.mouse.isJustPressed(Light.Mouse.LEFT)) game.states.change('intro');
    };

    game.states.add('intro', introState);
    game.states.add('mainGame', gameState);
    game.states.add('end', endState);
    game.states.change('intro');
}());