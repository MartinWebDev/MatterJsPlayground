let Engine = Matter.Engine;
let World = Matter.World;

function ExplosionTest() {
    this.sketch = function (p) {
        p.setup = function () {
            p.createCanvas(800, 400);
            let floor = new Wall(100, 100, 50, 20);
            floor.AddToWorld()
            this.floor = floor.GetBody();
        }

        p.draw = function () {
            // Begin drawing
            p.background(50);
            p.noStroke();
            p.fill(240);
            p.text(frameRate = `FPS: ${p.frameRate().toFixed(2)}`, 20, 20);

            // Universal render settings
            p.noFill();
            p.stroke(255);
            p.strokeWeight(1);
            p.rectMode(p.CENTER);
            p.ellipseMode(p.CENTER);
        }
    }
}

ExplosionTest.prototype.Run = function () {
    this.game = new p5(this.sketch);
}