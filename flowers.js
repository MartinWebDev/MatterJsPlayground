function Flower(x, y) {
    this.x = x;
    this.y = y;

    this.isPlanted = false;
    this.growth = 0;

    this.petals = Math.floor(random(5, 8));
    //this.rotationAmount = (Math.PI * 2) / this.petals;
    this.rotationAmount = 360 / this.petals;

    this.colors = ["#FF0000", "#00FF00", "#0000FF", "#00FFFF", "#FF00FF", "#FFFF00"];
    this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
    this.centerColor = this.colors[Math.floor(Math.random() * this.colors.length)];
    this.maxGrowth = random(100, 300);

    this.growFlower = false;
    this.flowerSize = 0;
    this.maxFlowerSize = 50;
}

Flower.prototype.update = function () {
    if (!this.isPlanted) {
        this.y += 6;

        if (this.y > height) {
            this.isPlanted = true;
        }
    }
    else {
        if (this.growth < this.maxGrowth) {
            this.growth += 8;
        }
        else if (this.flowerSize < this.maxFlowerSize) {
            this.growFlower = true;
            this.flowerSize += 5;
        }
    }
}

Flower.prototype.show = function () {
    noFill();

    if (!this.isPlanted) {
        stroke(255);
        strokeWeight(8);
        point(this.x, this.y);
    }
    else {
        stroke(this.color);
        strokeWeight(4);
        line(this.x, height, this.x, height - this.growth);

        if (this.growFlower) {
            push();

            var petalControlX = 2;
            var petalControlY = 3;

            //noStroke();
            stroke(255);
            fill(this.color);
            translate(this.x, this.y - this.growth);
            angleMode(DEGREES);

            for (var i = 0; i < this.petals; i++) {
                bezier(
                    0, 0,
                    -petalControlX * this.flowerSize, -petalControlY * this.flowerSize,
                    petalControlX * this.flowerSize, -petalControlY * this.flowerSize,
                    0, 0
                );

                rotate(this.rotationAmount);
            }

            fill(this.centerColor);
            ellipse(0, 0, this.flowerSize);
            pop();
        }
    }
}








var grass = [];
var flowers = [];

var noiseOffset = 0;

function setup() {
    createCanvas(1000, 600);

    for (var i = 0; i < width; i += 4) {
        grass.push({ x1: i, y1: height, x2: i, y2: height - random(15, 20) });
    }
}

function mouseClicked() {
    flowers.push(new Flower(mouseX, mouseY));
}

function draw() {
    background(50);

    // Draw grass
    stroke(0, 255, 0);
    strokeWeight(1);

    for (var i = 0; i < grass.length; i++) {
        var blade = grass[i];
        var jitter = (noise(noiseOffset) * 10) - 3;

        line(blade.x1, blade.y1, blade.x2 + jitter, blade.y2);

        noiseOffset += 0.001;
    }

    // Draw flowers
    for (var i = 0; i < flowers.length; i++) {
        flowers[i].update();
        flowers[i].show();
    }
}
