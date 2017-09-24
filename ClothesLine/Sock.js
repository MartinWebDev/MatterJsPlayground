// Namespace Game.ClothesLine
var Game = Game || {}

function Sock(x, y) {
    this.x = x;
    this.y = y;
    this.angle = 0;

    this.verts = [
        { x: -10, y: -20 },
        { x: 10, y: -20 },
        { x: 10, y: 20 },
        { x: -20, y: 30 },
        { x: -25, y: 25 },
        { x: -10, y: 20 }
    ];
}

Sock.prototype.getVerts = function () {
    return this.verts;
}

Sock.prototype.update = function (x, y, a) {
    this.x = x;
    this.y = y;
    this.angle = a;
};

Sock.prototype.render = function (p) {
    p.push();
    p.translate(this.x, this.y);
    p.rotate(this.angle);
    p.fill(255, 100, 80);
    p.noStroke();
    p.beginShape();
    for (let i = 0; i < this.verts.length; i++) {
        p.vertex(this.verts[i].x, this.verts[i].y);
    }
    p.endShape(p.CLOSE);
    p.pop();
};
