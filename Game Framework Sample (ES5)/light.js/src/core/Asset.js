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
    if (this.toLoad.length === 0) {
        this.dispatchPreloaded();
    }
};

Light.Asset.prototype.onLoad = function (e) {
    var index = e.target.index;
    e.target.removeEventListener('load', this.onLoad);
    this[this.toLoad[index].type][this.toLoad[index].id] = e.target;

    this.loaded++;
    if (this.loaded === this.loading) {
        this.dispatchPreloaded();
    }
};

Light.Asset.prototype.dispatchPreloaded = function () {
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