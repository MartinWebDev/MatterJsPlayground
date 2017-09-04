var Engine = Matter.Engine;
var Render = Matter.Render;
var World = Matter.World;
var Bodies = Matter.Bodies;
var Vertices = Matter.Vertices;
var Common = Matter.Common;
var Composites = Matter.Composites;

var engine;
var world;
var ground;
var lWall;
var rWall;

var boxes = [];
var plinks = [];

var bouncyBox = { restitution: 0.8, friction: 0.1 };
var bouncyStatic = { restitution: 1, friction: 0.1, isStatic: true };

function setup() {
    createCanvas(400, 400);

    engine = Engine.create();
    world = engine.world;

    ground = Bodies.rectangle(width / 2, 390, 400, 20, { isStatic: true });
    lWall = Bodies.rectangle(0, height / 2, 2, 1000, { isStatic: true, restitution: 5 });
    rWall = Bodies.rectangle(width, height / 2, 2, 1000, { isStatic: true, restitution: 5 });

    for (var i = 0; i < 5; i++) {
        for (var j = 0; j < 5; j++) {
            let y = ((height / 5) * i) + 20;
            let x = ((width / 5) * j) + (i % 2 == 0 ? 20 : 60);
            var newPlink = Bodies.circle(x, y, 10, bouncyStatic);
            plinks.push(newPlink);

            World.addBody(world, newPlink);
        }
    }

    World.addBody(world, ground);
    World.addBody(world, lWall);
    World.addBody(world, rWall);

    Engine.run(engine);
}

function mousePressed() {
    var newBox = Bodies.rectangle(mouseX, mouseY, 40, 40, bouncyBox);
    boxes.push(newBox);
    World.addBody(world, newBox);
}

function draw() {
    background(20);

    rectMode(CENTER);
    stroke(255);
    noFill();

    rect(width / 2, 390, 400, 20); // TODO: Use matter variables, but this is ok for now since it's static anyway. 

    for (var i = 0; i < boxes.length; i++) {
        push();
        translate(boxes[i].position.x, boxes[i].position.y);
        rotate(boxes[i].angle);
        rect(0, 0, 40, 40);
        pop();
    }

    fill(255);
    noStroke();
    for (var i = 0; i < plinks.length; i++) {
        ellipse(plinks[i].position.x, plinks[i].position.y, 10);
    }
}