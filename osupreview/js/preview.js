// @ts-nocheck
function Preview(dest) {
    this.container = dest;

    this.screen = document.createElement('canvas');
    this.screen.id = 'drawingCanvas'
    this.screen.width = windowWidth;
    this.screen.height = windowHeight;
    this.ctx = this.screen.getContext('2d');
    this.container.appendChild(this.screen);

    var self = this;
    this.background = new Image();
    this.background.setAttribute('crossOrigin', 'anonymous');
    this.background.addEventListener('load', function () {
        if (!/^http/i.test(this.src)) {
            return;
        }

        var canvas = document.createElement('canvas');
        canvas.width = self.screen.width;
        canvas.height = self.screen.height;
        var ctx = canvas.getContext('2d');

        // background-size: cover height
        var sWidth = this.height * (self.screen.width / self.screen.height);
        ctx.drawImage(this, (this.width - sWidth) / 2, 0, sWidth, this.height,
            0, 0, self.screen.width, self.screen.height);

        if (typeof self.beatmap.processBG != 'undefined') {
            self.beatmap.processBG(ctx);
        }

        canvas.toBlob(function (blob) {
            var url = URL.createObjectURL(blob);
            self.background.src = url;
            self.container.style.backgroundImage = 'url(' + url + ')';
            // mandatory?
            // URL.revokeObjectURL(url);
        });
    });
    this.background.addEventListener('error', function () {
        self.container.style.backgroundImage = 'none';
    });
}
Preview.prototype.load = function (beatmapID, bgURL, osuURL, success, fail) {
    if (typeof this.xhr != 'undefined') {
        this.xhr.abort();
    }

    var self = this;
    this.xhr = new XMLHttpRequest();
    this.xhr.addEventListener('load', function () {
        try {
            self.beatmap = Beatmap.parse(this.responseText);
            self.background.src = bgURL;
            self.ctx.restore();
            self.ctx.save();
            self.beatmap.update(self.ctx);
            self.at(1500);

            if (typeof success == 'function') {
                success.call(self);
            }
        }
        catch (e) {
            if (typeof fail == 'function') {
                fail.call(self, e);
            }
        }
    });
    self.xhr.open('GET', osuURL);
    self.xhr.send();
};
Preview.prototype.at = function (time) {
    try {
        preview.beatmap.refresh();
        this.ctx.save()
        
        // this.ctx.save();
        // this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, windowWidth, windowHeight);
        
        
        // this.ctx.restore();
        this.ctx.shadowColor = 'rgba(0,0,0,0.25)';
        this.ctx.shadowBlur = 14;

        this.ctx.fillStyle = colors.editor.back
       
        this.ctx.fillRect(editor.display.x,editor.display.y,editor.display.w,editor.display.h,25)
        
        this.ctx.shadowBlur = ''
        this.ctx.translate(editor.display.x,editor.display.y)
        this.ctx.scale(editor.display.w/512,editor.display.h/384)
        this.beatmap.draw(time, this.ctx);
    this.ctx.restore()
    } catch (error) {
        
    }
    
    // mainwindow.wCursor = time
};
