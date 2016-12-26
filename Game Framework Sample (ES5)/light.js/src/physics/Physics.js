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
        entity.body.update(elapsed);
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