Light.Text = function () {
    Light.Entity.call(this);
    this.text = '';
    this.font = '20px Arial';
    this.baseline = 'top';
    this.fillStyle = '#000000';
};
Light.Text.prototype = Object.create(Light.Entity.prototype);
Light.Text.constructor = Light.Text;
Light.Text.prototype.onRender = function (context) {
    context.font = this.font;
    context.fillStyle = this.fillStyle;
    context.textBaseline = this.baseline;
    context.fillText(this.text, 0, 0);
};