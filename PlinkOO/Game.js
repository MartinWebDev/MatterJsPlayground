// Import MatterJs stuff
let Engine = Matter.Engine;
let World = Matter.World;
let Bodies = Matter.Bodies;
let Body = Matter.Body;

// Namespace "Game"
var Game = Game || {};

(function (Game) {
    Game.Plinko = function () {
        let self = this;

        // Settings for p5js
        self.width = 800;
        self.height = 400;
        self.bgColor = 50;

        // MatterJs setup
        self.engine = Engine.create();
        self.world = self.engine.world;

        // TEST - Gravity
        self.world.gravity.scale = 0;
        self.nOffset = 0;

        // Create initial bodies
        self.ground = Bodies.rectangle(self.width / 2, self.height - 10, self.width, 40, { isStatic: true, restitution: 1, friction: 0 });
        self.roof = Bodies.rectangle(self.width / 2, 10, self.width, 40, { isStatic: true, restitution: 1, friction: 0 });
        self.leftWall = Bodies.rectangle(10, self.height / 2, 40, self.height, { isStatic: true, restitution: 1, friction: 0 });
        self.rightWall = Bodies.rectangle(self.width - 10, self.height / 2, 40, self.height, { isStatic: true, restitution: 1, friction: 0 });

        self.box = Bodies.rectangle(self.width / 2, self.height / 2, 20, 20, { restitution: 1, friction: 0 });
        self.box.frictionAir = 0;

        self.boxes = [];

        for (var i = 0; i < 100; i++) {
            self.boxes.push(Bodies.rectangle(Math.random() * self.width, Math.random() * self.height, 20, 20, { restitution: 1, friction: 0 }));
            self.boxes[i].frictionAir = 0;

            World.addBody(self.world, self.boxes[i]);
        }

        // Add bodies to world
        World.addBody(self.world, self.ground);
        World.addBody(self.world, self.roof);
        World.addBody(self.world, self.leftWall);
        World.addBody(self.world, self.rightWall);
        World.addBody(self.world, self.box);

        this.Run = function () {
            console.log("Running game...");

            let sketch = function (p) {
                p.setup = function () {
                    p.createCanvas(self.width, self.height);

                    Matter.Body.applyForce(self.box, { x: 0, y: 0 }, { x: (Math.random() - 0.5) / 500, y: (Math.random() - 0.5) / 500 });
                    Matter.Body.setAngularVelocity(self.box, Math.random() / 10);
                    Body.rotate(self.box, Math.random() * 360);

                    for (var i = 0; i < self.boxes.length; i++) {
                        Matter.Body.applyForce(self.boxes[i], { x: 0, y: 0 }, { x: (Math.random() - 0.5) / 500, y: (Math.random() - 0.5) / 500 });
                        Matter.Body.setAngularVelocity(self.boxes[i], Math.random() / 100);
                        Body.rotate(self.boxes[i], Math.random() * 360);
                    }

                    //Engine.run(self.engine);
                };

                p.draw = function () {
                    Engine.update(self.engine);

                    // TEST - World gravity
                    //self.world.gravity.scale = (p.noise(self.nOffset)) / 1000;
                    //self.nOffset += 0.001;

                    p.background(self.bgColor);

                    // Framecount
                    let frameRate = `FPS: ${p.frameRate().toFixed(2)}`;

                    p.textSize(18);
                    p.noStroke();
                    p.fill(200);
                    p.textAlign(p.LEFT, p.TOP);
                    p.text(frameRate, 5, 5);

                    // Settings for all drawables
                    p.noFill();
                    p.stroke(255);
                    p.rectMode(p.CENTER);

                    // Draw boundaries
                    p.rect(self.ground.position.x, self.ground.position.y, p.width, 40);
                    p.rect(self.roof.position.x, self.roof.position.y, p.width, 40);
                    p.rect(self.leftWall.position.x, self.leftWall.position.y, 40, p.width);
                    p.rect(self.rightWall.position.x, self.rightWall.position.y, 40, p.width);

                    // Draw box
                    p.push();
                    p.translate(self.box.position.x, self.box.position.y);
                    p.rotate(self.box.angle);
                    p.rect(0, 0, 20, 20);
                    p.pop();

                    for (var i = 0; i < self.boxes.length; i++) {
                        p.push();
                        p.translate(self.boxes[i].position.x, self.boxes[i].position.y);
                        p.rotate(self.boxes[i].angle);
                        p.rect(0, 0, 20, 20);
                        p.stroke(255, 0, 0, 200);
                        p.line(0, 0, 0, 10);
                        p.pop();
                    }
                };
            };

            this.p5proj = new p5(sketch);
        };
    };
})(Game);
