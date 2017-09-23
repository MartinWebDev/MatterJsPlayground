// Import MatterJs stuff
let Engine = Matter.Engine;
let World = Matter.World;
let Bodies = Matter.Bodies;
let Body = Matter.Body;
let Vector = Matter.Vector;
let Vertices = Matter.Vertices;

// Namespace "Game"
var Game = Game || {};

(function (Game) {
    Game.Birthday = function () {
        let self = this;

        // Settings for p5js
        self.width = 800;
        self.height = 400;
        self.bgColor = 50;

        //self.gameWidth = 800;
        //self.gameHeight = 400;

        // MatterJs setup
        self.engine = Engine.create();
        self.world = self.engine.world;

        // Additional information
        self.showFps = true;

        // Create boundary bodies
        //self.ground = Bodies.rectangle(self.width / 2, self.height - 10, self.width, 40, { isStatic: true, restitution: 1, friction: 0 });
        //self.roof = Bodies.rectangle(self.gameWidth / 2, 10, self.gameWidth, 40, { isStatic: true, restitution: 1, friction: 0 });
        //self.leftWall = Bodies.rectangle(10, self.gameHeight / 2, 40, self.gameHeight, { isStatic: true, restitution: 1, friction: 0 });
        //self.rightWall = Bodies.rectangle(self.gameWidth - 10, self.gameHeight / 2, 40, self.gameHeight, { isStatic: true, restitution: 1, friction: 0 });

        // Add boundary bodies to world
        //World.addBody(self.world, self.ground);
        //World.addBody(self.world, self.roof);
        //World.addBody(self.world, self.leftWall);
        //World.addBody(self.world, self.rightWall);

        //////////////////////////////////////////////////////////////
        // Create and add bodies for this game only below this line //
        //////////////////////////////////////////////////////////////
        self.rain = [];

        for (let i = 0; i < 50; i++) {
            self.rain.push(Bodies.circle(Math.floor(Math.random() * (self.width)), Math.floor(Math.random() * (self.height)), 1, { restitution: 0.5 }));
        }

        for (let i = 0; i < self.rain.length; i++) {
            World.addBody(self.world, self.rain[i]);
        }

        console.log(self.rain);

        /////////////////
        // Game window //
        /////////////////
        //self.globalOffsetX = 0;
        //self.globalOffsetY = 0;
        //self.bodyToTrack = self.ground;

        // Potential force by holding space bar test
        self.potentialForceMultiplier = 0;

        self.applyPosition = Vector.create(0, 0);
        self.applyForce = Vector.create(0.000003, 0);

        this.Run = function () {
            console.log("Happy birthday...");

            let sketch = function (p) {
                p.setup = function () {
                    p.createCanvas(self.width, self.height);
                };

                p.draw = function () {
                    // Begin engine data
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

                    // Settings for all drawables
                    p.noFill();
                    p.stroke(255);
                    p.strokeWeight(1);
                    p.rectMode(p.CENTER);
                    p.ellipseMode(p.CENTER);

                    // Draw boundaries
                    //p.rect(self.ground.position.x, self.ground.position.y, self.width, 40);

                    /////////////////////////
                    // Draw related events //
                    /////////////////////////
                    if (p.keyIsPressed && p.keyCode == 32) {
                        for (let i = 0; i < self.rain.length; i++) {
                            Body.applyForce(self.rain[i], self.applyPosition, self.applyForce);
                        }
                    }

                    ////////////////////////////////////////////////
                    // Draw game specific objects below this line //
                    ////////////////////////////////////////////////
                    p.fill(255, 255, 0);
                    p.noStroke();

                    for (let i = self.rain.length - 1; i >= 0; i--) {
                        p.ellipse(self.rain[i].position.x, self.rain[i].position.y, 8, 8);

                        if (self.rain[i].position.y > self.height) {
                            Body.setPosition(self.rain[i], Vector.create(Math.floor(Math.random() * self.width), -Math.floor(Math.random() * 40)));
                            Body.setVelocity(self.rain[i], Vector.create(0, 0));
                        }
                    }
                };
            };

            this.p5proj = new p5(sketch);
        };
    };
})(Game);
