Light.MovieClip = function (image, frameRect, frames) {
    Light.EntityContainer.call(this);
    
    this.texture = image;
    this.frameRect = frameRect;
    this.totalFrames = frames;
    this.framesPerRow = Math.floor(image.width / frameRect.width);
    this.frameSpeed = frameSpeed;
    this.isLoop = true;
    this.isPlaying = false;
    
    this.width = this.frameRect.width;
    this.height = this.frameRect.height;
    this.frameCount = 0;
};

Light.MovieClip.prototype.constructor = Light.MovieClip;
Light.MovieClip.prototype = Object.create(Light.EntityContainer.prototype);

Light.MovieClip.prototype.play = function (isLoop, frameSpeed) {
    this.isLoop = (typeof isLoop === 'boolean') ? isLoop : true;
    this.frameSpeed = (typeof frameSpeed === 'number') ? frameSpeed : 60;
    this.isPlaying = true;
};

Light.MovieClip.prototype.stop = function (resetFrame) {
    if (resetFrame === true) this.frameCount = 0;
    this.isPlaying = false;
};

Light.MovieClip.prototype.update = function (elapsed) {
    Light.EntityContainer.prototype.update.apply(this, arguments);
    
    if (!this.isPlaying) return;
    
    this.frameCount += this.frameSpeed * elapsed;
    if (this.frameCount >= this.totalFrames) {
        if (this.isLoop) {
            this.frameCount = 0;
        }
        else {
            this.frameCount = this.totalFrames - 1;
        }
    }
};

Light.MovieClip.prototype.onRender = function (context) {
    context.drawImage(this.texture, this.width * Math.floor(this.currentFrame % this.framesPerRow), this.height * Math.floor(this.currentFrame / this.framesPerRow), this.width, this.height, 0, 0, this.width, this.height);
};
                      
Object.defineProperty(Light.MovieClip.prototype, 'currentFrame', {
    get: function () { return Math.floor(this.frameCount); }
});