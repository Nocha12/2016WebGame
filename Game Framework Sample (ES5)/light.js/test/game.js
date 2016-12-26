var game = new Light.Game('div', 800, 600, 'black', function(preloader){
    preloader.loadImage('test', 'texture.png');
});
var gameState = new Light.State(game);

gameState.onInit = function () {
    this.testSprite = new Light.MovieClip(game.asset.getImage('test'), new Light.Rectangle(0, 0, 125, 125), 16);
    this.addChild(this.testSprite);
};

gameState.onUpdate = function (elapsed) {
};

game.states.add('game', gameState);
game.states.change('game');