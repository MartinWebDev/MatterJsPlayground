var Engine = Matter.Engine;
var Render = Matter.Render;
var World = Matter.World;
var Bodies = Matter.Bodies;
var Vertices = Matter.Vertices;

var engine;
var world;
var ground;

var boxes = [];
var plinks = [];

var horseShoe;
var hs;

var bouncy = { resitution: 0.8, friction: 0.2 };
var bouncyStatic = { resitution: 0.8, friction: 0.2, isStatic: true };

function setup() {
    createCanvas(400, 400);

    engine = Engine.create();
    world = engine.world;

    ground = Bodies.rectangle(width / 2, 390, 400, 20, { isStatic: true });

    // TEST
    horseShoe = Vertices.fromPath('35 7 19 17 14 38 14 58 25 79 45 85 65 84 65 66 46 67 34 59 30 44 33 29 45 23 66 23 66 7 53 7');
    hs = Bodies.fromVertices(width / 2, height / 2, horseShoe, bouncy);

    World.addBody(world, hs);

    console.log(hs);

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

    Engine.run(engine);
}

function mousePressed() {
    var newBox = Bodies.rectangle(mouseX, mouseY, 40, 40, bouncy);
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

    // Draw horseshoe
    noFill();
    stroke(255);
    push();
    var verts = hs.vertices;
    var ang = hs.angle;

    translate(ang);

    var firstV = verts[0];
    var previousV = firstV
    for (var i = 1; i < verts.length; i++) {
        line(previousV.x, previousV.y, verts[i].x, verts[i].y);
        previousV = verts[i];
    }
    line(previousV.x, previousV.y, firstV.x, firstV.y);
    pop();
}