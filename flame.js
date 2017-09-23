function Flame() {
    //this.x = x;
    //this.y = y;
    this.noiseOffsetX = 0;
    this.noiseUpdate = 0.01;

    this.anchor = new p5.Vector(0, -100);
    this.c1 = new p5.Vector(-80, 50);
    this.c2 = new p5.Vector(80, 50);
}

Flame.prototype.update = function () {
    // Update control point vectors with noise
    this.anchor.x = constrain(this.anchor.x + ((noise(this.noiseOffsetX * 1000) - 0.5) * 5), -40, 40);
    this.c1.x = constrain(this.c1.x + ((noise(this.noiseOffsetX) - 0.5) * 5), -100, -50);
    this.c2.x = constrain(this.c2.x + ((noise(this.noiseOffsetX * 5000) - 0.5) * 5), 50, 100);


    this.noiseOffsetX += this.noiseUpdate;
}

Flame.prototype.show = function () {
    noStroke();
    fill(255, 0, 0);

    push();
    translate(width / 2, height - 100);

    stroke(255);
    point(this.c1.x, this.c1.y);
    point(this.c2.x, this.c2.y);

    bezier(
        this.anchor.x, this.anchor.y,
        this.c1.x, this.c1.y,
        this.c2.x, this.c2.y,
        this.anchor.x, this.anchor.y
    );
    pop();
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var flame = new Flame();

function setup() {
    createCanvas(800, 400);
}

function mouseClicked() {

}

function draw() {
    background(50);

    flame.update();
    flame.show();
}
