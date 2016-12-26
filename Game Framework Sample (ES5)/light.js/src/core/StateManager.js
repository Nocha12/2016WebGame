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