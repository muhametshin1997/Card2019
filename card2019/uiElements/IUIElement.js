class IUIElement {
    constructor(
        location = { x: 0, y: 0 },
        size = { width: 0, height: 0 },
        foreground = null, background = null) {

        this.location = location;
        this.size = size;

        this.foreground = foreground;
        this.background = background;

        this.rerenderRequested = false;
        this.rerenderIntervalId = -1;

        this.figureData = [];

        this.lastX = location.x;
        this.lastY = location.y;
    }

    //[{figureType:'', params:[], fill:true/false, delayAfter:Nms}]
    appear(data) {
        let lastFigure, lastFill, lastStroke;

        data.forEach(c => {
            if (!c.figureType) {
                c.figureType = lastFigure;
            }
            if (!c.fill) {
                c.fill = lastFill;
            }
            if (!c.stroke) {
                c.lastStroke = lastStroke;
            }
            lastFigure = c.figureType;
            lastFill = c.fill;
            lastStroke = c.stroke;
        });
        this.figureData = data;

        return this.render(data);
    }

    render(data) {
        if (data) {
            for (let figure of data) {
                if (this.location.x != this.lastX) {
                    figure.params[0] += this.location.x - this.lastX;
                }
                if (this.location.y != this.lastY) {
                    figure.params[1] += this.location.y - this.lastY;
                }
            }

            this.lastX = this.location.x;
            this.lastY = this.location.y;

            return Promise.all(data.map(c => Promise.resolve().then(() => this.graphics.render(c, this))));
        }
    }

    fade(data) {
        this.figureData = [];
        this.invalidate();
        return this.render(data);
    }

    invalidate() {
        this.rerenderRequested = true;
    }

    //Register UIElement to use in Graphics. There's no reason to override
    register(graphics) {
        this.graphics = graphics;
        this.graphics.register(this);
    }

    //Register UIElement to use in Graphics. There's no reason to override
    dispose() {
        this.graphics.unregister(this);
        this.graphics = null;
    }
}