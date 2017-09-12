// Import MatterJs stuff
let Engine = Matter.Engine;
let World = Matter.World;
let Bodies = Matter.Bodies;
let Body = Matter.Body;
let Vector = Matter.Vector;
let Vertices = Matter.Vertices;

/**
 * TODO list
 *      - Firstly, the whole thing needs to be broken down into classes and objects. What started out as a random experiment has grown to the point
 *        where the different components should be separated and independently managed
 *      - I was thinking to build this into some sort of ESL game for Keyword (and others, perhaps can make some extra money from my games and planning system)
 *        Ideas maybe include:
 *          - Have 2 teams, in order to build power for their ball, they must answer questions.
 *            Each questions gets them a percentage of potential power to launch their ball. Furthest team wins
 *      - I am adding a "bucket" idea for a while, to experiment with landing the ball inside it. Perhaps this can be integrated into the game? Otherwise, delete it later
 *      - Since the current key press system can only handle a single button, instead change to have a true/false state for each action (up, down, etc),
 *        Have it set to true on key press, then false on release. This should allow it to handle multiple key presses at once. 
 */

// Namespace "Game"
var Game = Game || {};

var verts;

(function (Game) {
    Game.BouncyBall = function () {
        let self = this;

        // Settings for p5js
        self.width = 800;
        self.height = 400;
        self.bgColor = 50;

        self.gameWidth = 10000;
        self.gameHeight = 5000;

        // MatterJs setup
        self.engine = Engine.create();
        self.world = self.engine.world;

        // Additional information
        self.showFps = true;

        // Create boundary bodies
        self.ground = Bodies.rectangle(self.gameWidth / 2, self.gameHeight - 10, self.gameWidth, 40, { isStatic: true, restitution: 1, friction: 0 });
        self.roof = Bodies.rectangle(self.gameWidth / 2, 10, self.gameWidth, 40, { isStatic: true, restitution: 1, friction: 0 });
        self.leftWall = Bodies.rectangle(10, self.gameHeight / 2, 40, self.gameHeight, { isStatic: true, restitution: 1, friction: 0 });
        self.rightWall = Bodies.rectangle(self.gameWidth - 10, self.gameHeight / 2, 40, self.gameHeight, { isStatic: true, restitution: 1, friction: 0 });

        // Add boundary bodies to world
        World.addBody(self.world, self.ground);
        World.addBody(self.world, self.roof);
        World.addBody(self.world, self.leftWall);
        World.addBody(self.world, self.rightWall);

        //////////////////////////////////////////////////////////////
        // Create and add bodies for this game only below this line //
        //////////////////////////////////////////////////////////////
        // self.ball1 = Bodies.circle(self.width / 2, self.height / 2, 10, { restitution: 0.8 });
        //self.ball1 = Bodies.circle(45, self.gameHeight - 45, 10, { restitution: 0.8 });
        self.ball1 = Bodies.circle(80, self.gameHeight - 150, 10, { restitution: 0.8 });
        World.addBody(self.world, self.ball1);

        // Random "bucket"
        /*let*/ verts = [
            { x: -20, y: -20 },
            { x: -16, y: -20 },
            { x: -12, y: 16 },
            { x: 12, y: 16 },
            { x: 16, y: -20 },
            { x: 20, y: -20 },
            { x: 16, y: 20 },
            { x: -16, y: 20 }
        ];
        self.bucket = Bodies.fromVertices(80, self.gameHeight - 80, verts, { isStatic: false });
        World.addBody(self.world, self.bucket);
        console.log(self.bucket);

        /////////////////
        // Game window //
        /////////////////
        self.globalOffsetX = 0;
        self.globalOffsetY = 0;
        self.bodyToTrack = self.ball1;

        // Potential force by holding space bar test
        self.potentialForceMultiplier = 0;

        this.Run = function () {
            console.log("Running game...");

            let sketch = function (p) {
                p.setup = function () {
                    p.createCanvas(self.width, self.height);
                };

                p.mouseClicked = function () {
                    //Body.setAngularVelocity(self.ball1, 1);
                    // TEST replace the body to track to test moving view. Real version will want nicely animated, but just ensure it actually works
                    //self.bodyToTrack = self.rightWall;
                }

                p.keyReleased = function () {
                    if (p.keyCode == 32) {
                        let power = p.constrain(1 * self.potentialForceMultiplier, 0.005, 0.05);

                        console.log(`Potential Energy: ${self.potentialForceMultiplier}`);
                        console.log(`Constrained Energy: ${power}`);

                        Body.applyForce(self.ball1, self.ball1.position, Vector.create(power, -(power)));
                        self.potentialForceMultiplier = 0;
                    }
                }

                p.draw = function () {
                    // Begin engine data
                    Engine.update(self.engine);

                    p.background(self.bgColor);

                    // TEMP TEST
                    if (p.mouseIsPressed && self.ball1.speed < 30) {
                        Body.applyForce(self.ball1, self.ball1.position, Vector.create(0.001, 0));
                    }
                    if (p.keyIsPressed && self.ball1.speed < 30) {
                        switch (p.keyCode) {
                            case 37: // Left arrow
                                Body.applyForce(self.ball1, self.ball1.position, Vector.create(-0.001, 0));
                                break;
                            case 38: // Up
                                Body.applyForce(self.ball1, self.ball1.position, Vector.create(0, -0.001));
                                break;
                            case 39: // Right
                                Body.applyForce(self.ball1, self.ball1.position, Vector.create(0.001, 0));
                                break;
                            case 40:  // Down
                                Body.applyForce(self.ball1, self.ball1.position, Vector.create(0, 0.001));
                                break;
                        }
                    }
                    p.fill(200);
                    p.noStroke();
                    p.text(`Speed: ${Math.floor(self.ball1.speed * 100) / 100}`, 5, 20);
                    p.text(`Power: ${self.potentialForceMultiplier}`, 5, 40);

                    // Framecount
                    if (self.showFps) {
                        let frameRate = `FPS: ${p.frameRate().toFixed(2)}`;

                        p.textSize(18);
                        p.noStroke();
                        p.fill(200);
                        p.textAlign(p.LEFT, p.TOP);
                        p.text(frameRate, 5, 5);
                    }

                    // Screen Tracking for games larger than the canvas window
                    // Monitor tracked body and adjust global offset values
                    if (self.bodyToTrack.position.x > self.width / 2) {
                        self.globalOffsetX = 0 - self.bodyToTrack.position.x + self.width / 2; // 0 = origin point
                    }
                    if (self.bodyToTrack.position.y > self.height / 2) {
                        self.globalOffsetY = 0 - self.bodyToTrack.position.y + self.height / 2; // 0 = origin point
                    }
                    self.globalOffsetX = p.constrain(self.globalOffsetX, -(self.gameWidth - p.width), 0);
                    self.globalOffsetY = p.constrain(self.globalOffsetY, -(self.gameHeight - p.height), 0);
                    p.translate(self.globalOffsetX, self.globalOffsetY);

                    // TEMP BUCKET TEST
                    //let verts = self.bucket.vertices;
                    p.stroke(255);
                    p.strokeWeight(1);
                    p.noFill();
                    p.push();
                    p.translate(self.bucket.position.x, self.bucket.position.y);
                    p.rotate(self.bucket.angle);
                    p.beginShape();
                    for (let i = 0; i < verts.length; i++) {
                        p.vertex(verts[i].x, verts[i].y);
                    }
                    //p.endShape();
                    p.endShape(p.CLOSE);
                    p.pop()

                    // Settings for all drawables
                    p.noFill();
                    p.stroke(255);
                    p.strokeWeight(1);
                    p.rectMode(p.CENTER);
                    p.ellipseMode(p.CENTER);

                    // Draw boundaries
                    p.rect(self.ground.position.x, self.ground.position.y, self.gameWidth, 40);
                    p.rect(self.roof.position.x, self.roof.position.y, self.gameWidth, 40);
                    p.rect(self.leftWall.position.x, self.leftWall.position.y, 40, self.gameHeight);
                    p.rect(self.rightWall.position.x, self.rightWall.position.y, 40, self.gameHeight);

                    // Draw some distance lines
                    for (var i = 1000; i < self.gameWidth; i += 1000) {
                        // Draw a vertical line every 1000 pixels
                        p.stroke(100);
                        p.strokeWeight(1);
                        p.line(i, 0, i, self.gameHeight);

                        p.noStroke();
                        p.fill(100);
                        p.text(i.toString(), i, (p.height / 2) - self.globalOffsetY); // This version maintains a static height
                        // This version add repeated text at set heights - WARNING! Too many of these causes a huge drop in FPS!
                        //for (var j = 100; j < self.gameHeight; j += 500) {
                        //p.text(i.toString(), i, j);
                        //}
                    }

                    /////////////////////////
                    // Draw related events //
                    /////////////////////////
                    if (p.keyIsPressed && p.keyCode == 32) {
                        self.potentialForceMultiplier += 0.0005;
                    }

                    // Draw line to show potential force
                    if (self.potentialForceMultiplier > 0) {
                        let lineStart = new p5.Vector(self.ball1.position.x, self.ball1.position.y);
                        let subVec = new p5.Vector(1 * self.potentialForceMultiplier * 2000, -(1 * self.potentialForceMultiplier * 2000));
                        subVec.setMag(p.constrain(subVec.mag(), 1, 100) * 0.5); // Calc of potential power and this line need to be synced better
                        let lineEnd = p5.Vector.sub(lineStart, subVec);
                        p.stroke(0, 255, 0);
                        p.strokeWeight(2);
                        p.line(lineStart.x, lineStart.y, lineEnd.x, lineEnd.y);
                    }

                    ////////////////////////////////////////////////
                    // Draw game specific objects below this line //
                    ////////////////////////////////////////////////
                    p.stroke(255);
                    p.strokeWeight(1);
                    p.line(self.ball1.position.x, self.ball1.position.y, self.ball1.positionPrev.x, self.ball1.positionPrev.y);
                    p.noFill();
                    p.push();
                    p.translate(self.ball1.position.x, self.ball1.position.y);
                    p.rotate(self.ball1.angle);
                    p.stroke(255);
                    p.strokeWeight(1);
                    p.ellipse(0, 0, 20, 20); // TODO: Do not use static values for radius here
                    p.stroke(255, 0, 0);
                    p.line(0, 0, 10, 0); // Draw little line to show angle
                    p.pop();
                };
            };

            this.p5proj = new p5(sketch);
        };
    };
})(Game);
