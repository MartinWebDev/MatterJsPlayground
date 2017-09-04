// import MatterJs stuff

// Namespace "Game"
var Game = Game || {};

(function (Game) {
    Game.Plinko = function () {
        let self = this;

        self.width = 800;
        self.height = 400;
        self.bgColor = 50;

        // Game params
        self.noiseOffset = 0;
        self.noiseOffsetOffset = 0;
        self.graphX = 0;
        self.pointSpacing = 6;
        self.pointSize = 2;

        self.visualXOffset = 0;

        self.points = [];

        this.Run = function () {
            console.log("Running game...");

            let sketch = function (p) {
                p.setup = function () {
                    p.createCanvas(self.width, self.height)
                };

                p.draw = function () {
                    p.background(self.bgColor);

                    let x = self.graphX;
                    let y = p.noise(self.noiseOffset) * p.height;

                    // Framecount
                    let frameRate = `FPS: ${p.frameRate().toFixed(2)}`

                    self.points.push({ x: x, y: y });

                    if (self.points.length > p.width / (self.pointSpacing + (self.pointSize / 2))) {
                        self.points.shift();
                        self.visualXOffset++;
                    }


                    // With this slightly altered version the noise step ammount is also based on another noise calculation
                    self.graphX++;
                    self.noiseOffset += 0.01; // This is the normal version. Just step the noise manually
                    //let nOff = p.noise(self.noiseOffsetOffset) / 50;
                    //self.noiseOffset += nOff;
                    //self.noiseOffsetOffset += 0.01;

                    p.strokeWeight(self.pointSize);
                    p.noFill();

                    let prev = {
                        x: (self.points[self.points.length - 1].x - self.visualXOffset) + ((self.points.length - 1) * self.pointSpacing),
                        y: self.points[self.points.length - 1].y
                    };

                    // Draw a nice line for the final point
                    p.stroke(100);
                    p.line(0, prev.y, p.width, prev.y);

                    for (let i = self.points.length - 1; i > 0; i--) {
                        // Calculate alpha
                        // First get the percentage of this point on the whole array length
                        let perc = (i / self.points.length) * 100;
                        // let alph = (perc / 100) * 255;
                        let alph = ((perc / 100) * (255 - self.bgColor)) + self.bgColor;

                        //p.stroke(255, alph);
                        p.stroke(alph);

                        // Calculate point
                        let curX = (self.points[i].x - self.visualXOffset) + (i * self.pointSpacing);
                        let curY = self.points[i].y;
                        //p.point(curX, curY);
                        p.line(prev.x, prev.y, curX, curY);

                        prev = { x: curX, y: curY };
                    }

                    p.textSize(18);
                    p.noStroke();
                    p.fill(200);
                    p.textAlign(p.LEFT, p.TOP);
                    p.text(frameRate, 5, 5);
                };
            };

            this.p5proj = new p5(sketch);
        };
    };
})(Game);
