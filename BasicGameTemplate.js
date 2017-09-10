// Import MatterJs stuff
let Engine = Matter.Engine;
let World = Matter.World;
let Bodies = Matter.Bodies;
let Body = Matter.Body;

// Namespace "Game"
var Game = Game || {};

(function (Game) {
    Game.GAMENAME = function () {
        let self = this;

        // Settings for p5js
        self.width = 800;
        self.height = 400;
        self.bgColor = 50;

        // MatterJs setup
        self.engine = Engine.create();
        self.world = self.engine.world;

        // Additional information
        self.showFps = true;

        // Create initial bodies
        self.ground = Bodies.rectangle(self.width / 2, self.height - 10, self.width, 40, { isStatic: true, restitution: 1, friction: 0 });
        self.roof = Bodies.rectangle(self.width / 2, 10, self.width, 40, { isStatic: true, restitution: 1, friction: 0 });
        self.leftWall = Bodies.rectangle(10, self.height / 2, 40, self.height, { isStatic: true, restitution: 1, friction: 0 });
        self.rightWall = Bodies.rectangle(self.width - 10, self.height / 2, 40, self.height, { isStatic: true, restitution: 1, friction: 0 });

        // Add boundary bodies to world
        World.addBody(self.world, self.ground);
        World.addBody(self.world, self.roof);
        World.addBody(self.world, self.leftWall);
        World.addBody(self.world, self.rightWall);

        this.Run = function () {
            console.log("Running game...");

            let sketch = function (p) {
                p.setup = function () {
                    p.createCanvas(self.width, self.height);
                };

                p.draw = function () {
                    Engine.update(self.engine);

                    p.background(self.bgColor);

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
                    p.rectMode(p.CENTER);
                    p.ellipseMode(p.CENTER);

                    // Draw boundaries
                    p.rect(self.ground.position.x, self.ground.position.y, p.width, 40);
                    p.rect(self.roof.position.x, self.roof.position.y, p.width, 40);
                    p.rect(self.leftWall.position.x, self.leftWall.position.y, 40, p.width);
                    p.rect(self.rightWall.position.x, self.rightWall.position.y, 40, p.width);
                };
            };

            this.p5proj = new p5(sketch);
        };
    };
})(Game);
