// Global Enums
let STATE = {
    PLAY: 0,
    PAUSE: 1
};

let GAME_STATE = STATE.PLAY;

// Global variables
let width = 800;
let height = 400;

let engine = Matter.Engine.create();
let world = engine.world;

// Create single composite for the walls. They will never move, but I want to start a habit of using composites instead of bodies. 
let boundaries = Matter.Composite.create({ label: "Walls" });
Matter.Composite.add(boundaries, Matter.Bodies.rectangle(width / 2, height - 10, width, 40, { isStatic: true, restitution: 1, friction: 0, label: "Ground" }));
Matter.Composite.add(boundaries, Matter.Bodies.rectangle(width / 2, 10, width, 40, { isStatic: true, restitution: 1, friction: 0, label: "Roof" }));
Matter.Composite.add(boundaries, Matter.Bodies.rectangle(10, height / 2, 40, height, { isStatic: true, restitution: 1, friction: 0, label: "Left wall" }));
Matter.Composite.add(boundaries, Matter.Bodies.rectangle(width - 10, height / 2, 40, height, { isStatic: true, restitution: 1, friction: 0, label: "Right wall" }));

// Let's add a couple of pyyramids to the explosion area
let pyramidLeft = Matter.Composites.pyramid(100, 150, 9, 10, 0, 0, function (x, y) {
    return Matter.Bodies.rectangle(x, y, 25, 40);
});

let pyramidRight = Matter.Composites.pyramid(600, 250, 9, 10, 0, 0, function (x, y) {
    return Matter.Bodies.rectangle(x, y, 10, 20);
});

Matter.World.addComposite(world, boundaries);
Matter.World.add(world, [pyramidLeft, pyramidRight]);

// Let's add a bridge too. 
let group = Matter.Body.nextGroup(true);

let bridge = Matter.Composites.stack(100, 50, 15, 1, 0, 0, function (x, y) {
    return Matter.Bodies.rectangle(x - 20, y, 53, 20, {
        collisionFilter: { group: group },
        chamfer: 5,
        density: 0.005,
        frictionAir: 0.05,
        render: {
            fillStyle: '#575375'
        }
    });
});

Matter.Composites.chain(bridge, 0.3, 0, -0.3, 0, {
    stiffness: 1,
    length: 0,
    render: {
        visible: false
    }
});

let bridgeConstraints = [
    Matter.Constraint.create({
        pointA: { x: 50, y: 100 },
        bodyB: bridge.bodies[0],
        pointB: { x: -25, y: 0 },
        length: 2,
        stiffness: 0.9
    }),
    Matter.Constraint.create({
        pointA: { x: 600, y: 100 },
        bodyB: bridge.bodies[bridge.bodies.length - 1],
        pointB: { x: 25, y: 0 },
        length: 2,
        stiffness: 0.9
    })
];

Matter.World.add(world, [bridge, ...bridgeConstraints]);

// Now let's add the bomb, and prepare the explosion particles Composite
let bomb = Matter.Composite.create({ label: "Bomb" });
Matter.Composite.add(bomb, Matter.Bodies.circle(width / 2, height - 50, 10, { restitution: 0, label: "Bomb" }));

Matter.World.addComposite(world, bomb);

// Explosion particles
let explosion = Matter.Composite.create({ label: "Explosion" });
let particles = [];

for (let i = 0; i < 36; i++) {
    particles.push(Matter.Bodies.circle(bomb.bodies[0].position.x, bomb.bodies[0].position.y, 2, { frictionAir: 0, restitution: 1, mass: 1, friction: 0, density: 1 }));
    Matter.Composite.add(explosion, particles[i]);
}

// Explode function
function Explode() {
    console.log("Bang");

    // This method add particles to the scene and fires them outwards from the bomb
    Matter.World.addComposite(world, explosion);

    let iMax = explosion.bodies.length;
    let deg = 360 / iMax;

    for (let i = 0; i < iMax; i++) {
        // Calculate force vector
        let startVector = Matter.Vector.create(0.001, 0);
        let forceVector = Matter.Vector.rotate(startVector, (Math.PI / 180) * i * deg);

        // Reset particle position
        //explosion.bodies[i].position = bomb.bodies[0].position;

        // Apply force to body
        Matter.Body.applyForce(
            explosion.bodies[i],
            Matter.Vector.create(explosion.bodies[i].position.x, explosion.bodies[i].position.y),
            forceVector
        );
    }

    setTimeout(() => { Matter.Composite.remove(world, explosion); }, 2000);

    // // This method just applies a force to every Body
    // let comps = Matter.Composite.allComposites(world);
    // let forcePos = Matter.Vector.create(0, 0);

    // // Need to better understand how applyForce works. 
    // // Does it apply the force relative to the start position, or does it rotate based on the heading between the two vectors?
    // for (let i = 0; i < comps.length; i++) {
    //     let bods = comps[i].bodies;

    //     if (comps[i].label == "Bomb")
    //         forcePos = bods[0].position;
    // }

    // for (let i = 0; i < comps.length; i++) {
    //     let bods = comps[i].bodies;

    //     for (let j = 0; j < bods.length; j++) {
    //         if (!bods[j].isStatic)
    //             Matter.Body.applyForce(bods[j], forcePos, Matter.Vector.create(0, -0.001));
    //     }
    // }
}

// Only use this line if not updating the engine manually
Matter.Engine.run(engine);

// Start the p5 stuff
let sketch = function (p) {
    p.setup = function () {
        p.createCanvas(width, height);
    }

    p.keyPressed = function () {
        //console.log(p.keyCode);

        switch (p.keyCode) {
            case 80:
                if (GAME_STATE == STATE.PLAY) GAME_STATE = STATE.PAUSE;
                else GAME_STATE = STATE.PLAY;
                break;
            case 79:
                Matter.Engine.update(engine);
            case 66:
                Explode();
        }
    }

    p.draw = function () {
        p.background(50);
        p.stroke(255);
        p.noFill();

        // Update engine
        //if (GAME_STATE == STATE.PLAY)
        //Matter.Engine.update(engine);

        // TEST - Draw all bodies the lazy way
        let comps = Matter.Composite.allComposites(world);
        //console.log(comps);

        for (let i = 0; i < comps.length; i++) {
            let bods = comps[i].bodies;

            for (let j = 0; j < bods.length; j++) {
                let verts = bods[j].vertices;
                p.beginShape();

                for (let k = 0; k < verts.length; k++) {
                    p.vertex(verts[k].x, verts[k].y);
                }

                p.endShape(p.CLOSE);
            }
        }

        //p.noLoop();
    }
}

let project = new p5(sketch);