var Engine = Matter.Engine;
var Render = Matter.Render;
var World = Matter.World;
var Bodies = Matter.Bodies;

var engine;
var world;
var ground;

var boxes = [];
var plinks = [];

function setup() {
    createCanvas(400, 400);

    engine = Engine.create();
    world = engine.world;

    ground = Bodies.rectangle(width / 2, 390, 400, 20, { isStatic: true });

    for (var i = 0; i < 5; i++) {
        for (var j = 0; j < 5; j++) {
            let y = ((height / 5) * i) + 20;
            let x = ((width / 5) * j) + (i % 2 == 0 ? 20 : 60);
            var newPlink = Bodies.circle(x, y, 10, { isStatic: true });
            plinks.push(newPlink);

            World.addBody(world, newPlink);
        }
    }

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

    fill(255);
    noStroke();
    for (var i = 0; i < plinks.length; i++) {
        ellipse(plinks[i].position.x, plinks[i].position.y, 10);
    }
}