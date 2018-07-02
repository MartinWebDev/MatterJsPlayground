let Bodies = Matter.Bodies;

function Wall(x, y, w, h, matterOptions, renderOptions) {
    let renderDefaults = {
        stroke: 255,
        fill: 200
    };

    let matterDefaults = {
        isStatic: true
    };

    matterDefaults.extend(matterOptions);
    renderDefaults.extend(options);

    this.matterOptions = matterOptions;
    this.renderOptions = renderDefaults;
    this.x = x; this.y = y;
    this.w = w; this.h = h;
}

Wall.prototype.AddToWorld = function (world) {
    this.body = Bodies.rectangle(x, y, w, h, matterOptions);
    Matter.World.addBody(world, this.body);
}

Wall.prototype.GetBody = function () { return this.body; }

Wall.prototype.Render = function (p) {
    p.push();
    p.translate(this.body.position.x, this.body.position.y);
    p.rect(this.body.position.x, this.body.position.y, this.width, this.height);
    p.pop();
}
