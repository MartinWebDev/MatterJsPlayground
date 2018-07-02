// Import MatterJs stuff
let Engine = Matter.Engine;
let World = Matter.World;
let Bodies = Matter.Bodies;
let Body = Matter.Body;
let Vector = Matter.Vector;
let Vertices = Matter.Vertices;
let Events = Matter.Events;

// Namespace "Game"
var Game = Game || {};

const STATE = {
    PAUSE: 0,
    PLAY: 1
};

var GAME_STATE = STATE.PLAY;

(function (Game) {
    Game.GAMENAME = function () {
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
        self.ground = Bodies.rectangle(self.gameWidth / 2, self.gameHeight - 10, self.gameWidth, 40, { isStatic: true, restitution: 1, friction: 0, label: "Ground" });
        self.roof = Bodies.rectangle(self.gameWidth / 2, 10, self.gameWidth, 40, { isStatic: true, restitution: 1, friction: 0, label: "Roof" });
        self.leftWall = Bodies.rectangle(10, self.gameHeight / 2, 40, self.gameHeight, { isStatic: true, restitution: 1, friction: 0, label: "Left wall" });
        self.rightWall = Bodies.rectangle(self.gameWidth - 10, self.gameHeight / 2, 40, self.gameHeight, { isStatic: true, restitution: 1, friction: 0, label: "Right wall" });

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

        /////////////////
        // Game window //
        /////////////////
        self.globalOffsetX = 0;
        self.globalOffsetY = 0;
        self.bodyToTrack = self.ball1;

        // World events
        Events.on(self.engine, 'collisionStart', function (event) {
            var pairs = event.pairs;

            for (let i = 0; i < pairs.length; i++) {
                console.log("Start: ", pairs[i].collision.penetration);
            }
        });

        // an example of using collisionActive event on an engine
        Events.on(self.engine, 'collisionActive', function (event) {
            var pairs = event.pairs;

            //for (let i = 0; i < pairs.length; i++) {
            //    console.log("Active: " + pairs[i].collision.penetration);
            //}
        });

        // an example of using collisionEnd event on an engine
        Events.on(self.engine, 'collisionEnd', function (event) {
            var pairs = event.pairs;

            for (let i = 0; i < pairs.length; i++) {
                console.log("End: ", pairs[i].collision.penetration);
            }
        });

        this.Run = function () {
            console.log("Running game...");

            let sketch = function (p) {
                p.setup = function () {
                    p.createCanvas(self.width, self.height);

                    // Add pause button, explode button, mode toggle, and frame step button
                    self.pauseButton = p.createButton("Play/Pause");
                    self.pauseButton.mousePressed(() => {
                        if (GAME_STATE == STATE.PAUSE) GAME_STATE = STATE.PLAY;
                        else GAME_STATE = STATE.PAUSE;
                    });

                    self.stepFrame = p.createButton("Step Frame");
                    self.stepFrame.mousePressed(() => {
                        if (GAME_STATE == STATE.PAUSE) Engine.update(self.engine); // Manually update a frame
                    });

                    self.explodeButton = p.createButton("Explode");
                    self.explodeButton.mousePressed(() => {
                        // TODO: Begin the explosion here
                        console.log("Bang");
                    });
                };

                p.mouseClicked = function () {
                    console.log(`Click at X: ${p.mouseX}, Y:${p.mouseY}`);
                }

                p.keyPressed = function () {
                    console.log(`Key Code: ${p.keyCode}`);
                }

                p.keyReleased = function () {
                    console.log(`Key Code: ${p.keyCode}`);
                }

                p.draw = function () {
                    // Begin engine data
                    if (GAME_STATE == STATE.PLAY)
                        Engine.update(self.engine);

                    p.background(self.bgColor);

                    p.fill(200);
                    p.noStroke();

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
