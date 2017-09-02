var Engine = Matter.Engine;
var Render = Matter.Render;
var World = Matter.World;
var Bodies = Matter.Bodies;

var engine;
var world;
var ground;

var boxes = [];

function setup() {
    createCanvas(400, 400);

    engine = Engine.create();
    world = engine.world;

    ground = Bodies.rectangle(width / 2, 390, 400, 20, { isStatic: true });

    World.addBody(world, ground);

    Engine.run(engine);
}

function mousePressed() {
    var newBox = Bodies.rectangle(mouseX, mouseY, 40, 40);
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
}