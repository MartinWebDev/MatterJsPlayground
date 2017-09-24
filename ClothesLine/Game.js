// Import MatterJs stuff
let Engine = Matter.Engine;
let World = Matter.World;
let Bodies = Matter.Bodies;
let Body = Matter.Body;
let Vector = Matter.Vector;
let Vertices = Matter.Vertices;
let Events = Matter.Events;
let Constraint = Matter.Constraint;
let Composite = Matter.Composite;

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

var sock = new Sock(350, 200);

(function (Game) {
    Game.ClothesLine = function () {
        let self = this;

        // Settings for p5js
        self.width = 800;
        self.height = 400;
        self.bgColor = 50;

        self.gameWidth = 800;
        self.gameHeight = 400;

        // MatterJs setup
        self.engine = Engine.create();
        self.world = self.engine.world;

        // Additional information
        self.showFps = true;

        // Create boundary bodies
        self.ground = Bodies.rectangle(self.gameWidth / 2, self.gameHeight - 20, self.gameWidth, 40, { isStatic: true, restitution: 1, friction: 0, label: "Ground" });
        self.roof = Bodies.rectangle(self.gameWidth / 2, 20, self.gameWidth, 40, { isStatic: true, restitution: 1, friction: 0, label: "Roof" });
        self.leftWall = Bodies.rectangle(20, self.gameHeight / 2, 40, self.gameHeight, { isStatic: true, restitution: 1, friction: 0, label: "Left wall" });
        self.rightWall = Bodies.rectangle(self.gameWidth - 20, self.gameHeight / 2, 40, self.gameHeight, { isStatic: true, restitution: 1, friction: 0, label: "Right wall" });

        // Add boundary bodies to world
        World.addBody(self.world, self.ground);
        World.addBody(self.world, self.roof);
        World.addBody(self.world, self.leftWall);
        World.addBody(self.world, self.rightWall);

        //////////////////////////////////////////////////////////////
        // Create and add bodies for this game only below this line //
        //////////////////////////////////////////////////////////////
        self.ball1 = Bodies.circle(80, self.gameHeight - 150, 10, { restitution: 0.8, label: "Ball" });
        World.addBody(self.world, self.ball1);

        self.clothesPoleLeft = Bodies.rectangle(300, self.gameHeight - 140, 10, 200, { isStatic: true, label: "ClothesPoleLeft", isSensor: true });
        self.clothesPoleRight = Bodies.rectangle(700, self.gameHeight - 140, 10, 200, { isStatic: true, label: "ClothesPoleLeft", isSensor: true });
        self.clothesLine = Bodies.rectangle(700 - (700 - 300) / 2, 180, 700 - 300, 5, { isStatic: true, label: "ClothesLine", isSensor: true });
        World.addBody(self.world, self.clothesPoleLeft);
        World.addBody(self.world, self.clothesPoleRight);
        World.addBody(self.world, self.clothesLine);

        // Sock test
        self.sockBody = Bodies.fromVertices(sock.x, sock.y, sock.getVerts(), { label: "OrangeSock" });
        World.addBody(self.world, self.sockBody);

        // Test constraint between sock and clothes line
        self.sock1Constraint = Constraint.create({
            bodyA: self.clothesLine,
            bodyB: self.sockBody,
            damping: 0.1,
            stiffness: 1,
            length: 10,
            pointA: { x: 0, y: 20 }
        });
        World.addConstraint(self.world, self.sock1Constraint);

        // Game controls
        self.controlInfo = {
            LR: false,
            RR: false,
            UR: false,
            DR: false,
            SPACE: false
        };

        /////////////////
        // Game window //
        /////////////////
        self.globalOffsetX = 0;
        self.globalOffsetY = 0;
        self.bodyToTrack = self.ball1;

        // Potential force by holding space bar test
        self.potentialForceMultiplier = 0;

        // World events
        Events.on(self.engine, 'collisionStart', function (event) {
            var pairs = event.pairs;

            for (let i = 0; i < pairs.length; i++) {
                if (pairs[i].bodyA.label == "Ball" || pairs[i].bodyB.label == "Ball") {
                    if (pairs[i].bodyA.label == "OrangeSock" || pairs[i].bodyB.label == "OrangeSock") {
                        console.log("Start: ", pairs[i].collision.penetration);
                    }
                }
            }
        });

        // an example of using collisionActive event on an engine
        Events.on(self.engine, 'collisionActive', function (event) {
            var pairs = event.pairs;

            for (let i = 0; i < pairs.length; i++) {
                if (pairs[i].bodyA.label == "Ball" || pairs[i].bodyB.label == "Ball") {
                    //console.log("Active: " + pairs[i].collision.penetration);
                }
            }
        });

        // an example of using collisionEnd event on an engine
        Events.on(self.engine, 'collisionEnd', function (event) {
            var pairs = event.pairs;

            for (let i = 0; i < pairs.length; i++) {
                if (pairs[i].bodyA.label == "Ball" || pairs[i].bodyB.label == "Ball") {
                    if (pairs[i].bodyA.label == "OrangeSock" || pairs[i].bodyB.label == "OrangeSock") {
                        if (Math.abs(pairs[i].collision.penetration.x) > 5) {
                            //World.remove(self.sock1Constraint);
                            self.sock1Constraint.stiffness = 0;
                        }
                        console.log("End: ", pairs[i].collision.penetration);
                    }
                }
            }
        });

        this.Run = function () {
            console.log("Running game...");

            let sketch = function (p) {
                p.setup = function () {
                    p.createCanvas(self.width, self.height);
                };

                p.mouseClicked = function () {

                }

                p.keyPressed = function () {
                    switch (p.keyCode) {
                        case 37: // Left arrow
                            self.controlInfo.LR = true;
                            break;
                        case 38: // Up
                            self.controlInfo.UR = true;
                            break;
                        case 39: // Right
                            self.controlInfo.RR = true;
                            break;
                        case 40:  // Down
                            self.controlInfo.DR = true;
                            break;
                    }
                }

                p.keyReleased = function () {
                    switch (p.keyCode) {
                        case 37: // Left arrow
                            self.controlInfo.LR = false;
                            break;
                        case 38: // Up
                            self.controlInfo.UR = false;
                            break;
                        case 39: // Right
                            self.controlInfo.RR = false;
                            break;
                        case 40:  // Down
                            self.controlInfo.DR = false;
                            break;
                    }

                    if (p.keyCode == 32) {
                        let power = p.constrain(1 * self.potentialForceMultiplier, 0.005, 0.015);
                        let maxPower = p.map(power, 0.005, 0.05, 0, 100); // Map to a percentage, this can be useful for tuning the potential power to the line on screen

                        console.log(`Potential Energy: ${self.potentialForceMultiplier}`);
                        console.log(`Constrained Energy: ${power}`);
                        console.log(`Percentage Energy: ${maxPower}`);

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
                        //Body.applyForce(self.ball1, self.ball1.position, Vector.create(0.001, 0));
                    }

                    if (self.ball1.speed < 30) {
                        if (self.controlInfo.LR) // Left arrow
                            Body.applyForce(self.ball1, self.ball1.position, Vector.create(-0.001, 0));
                        if (self.controlInfo.UR) // Up
                            Body.applyForce(self.ball1, self.ball1.position, Vector.create(0, -0.001));
                        if (self.controlInfo.RR) // Right
                            Body.applyForce(self.ball1, self.ball1.position, Vector.create(0.001, 0));
                        if (self.controlInfo.DR)  // Down
                            Body.applyForce(self.ball1, self.ball1.position, Vector.create(0, 0.001));
                    }

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
                    if (self.bodyToTrack.position.x > self.width / 2)
                        self.globalOffsetX = 0 - self.bodyToTrack.position.x + self.width / 2; // 0 = origin point
                    else
                        self.globalOffsetX = 0;

                    if (self.bodyToTrack.position.y > self.height / 2)
                        self.globalOffsetY = 0 - self.bodyToTrack.position.y + self.height / 2; // 0 = origin point
                    else
                        self.globalOffsetY = 0;

                    self.globalOffsetX = p.constrain(self.globalOffsetX, -(self.gameWidth - p.width), 0);
                    self.globalOffsetY = p.constrain(self.globalOffsetY, -(self.gameHeight - p.height), 0);
                    p.translate(self.globalOffsetX, self.globalOffsetY);

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
                    (drawBall = function () {
                        p.push();
                        p.translate(self.ball1.position.x, self.ball1.position.y);
                        p.rotate(self.ball1.angle);
                        p.noStroke();
                        p.fill(180, 30, 170);
                        p.ellipse(0, 0, 20, 20); // TODO: Do not use static values for radius here
                        p.pop();
                    })();

                    (drawClothesPoles = function () {
                        p.push();
                        p.translate(self.clothesPoleLeft.position.x, self.clothesPoleLeft.position.y);
                        p.rotate(self.clothesPoleLeft.angle);
                        p.noStroke();
                        p.fill(180);
                        p.rect(0, 0, 10, 200);
                        p.pop();

                        p.push();
                        p.translate(self.clothesPoleRight.position.x, self.clothesPoleRight.position.y);
                        p.rotate(self.clothesPoleRight.angle);
                        p.noStroke();
                        p.fill(180);
                        p.rect(0, 0, 10, 200);
                        p.pop();

                        p.push();
                        p.translate(self.clothesLine.position.x, self.clothesLine.position.y);
                        p.rotate(self.clothesLine.angle);
                        p.noStroke();
                        p.fill(180);
                        p.rect(0, 0, 700 - 300, 5);
                        p.pop();
                    })();


                    // TEMP TEST ONLY - DRAW SOCK
                    sock.update(self.sockBody.position.x, self.sockBody.position.y, self.sockBody.angle);
                    sock.render(p);
                };
            };

            this.p5proj = new p5(sketch);
        };
    };
})(Game);
