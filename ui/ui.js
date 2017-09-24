// Namespace "Game"
var Game = Game || {};

(function (Game) {
    Game.ui = {
        RenderVerts: function (p, origin, angle, verts) {
            p.push();
            p.translate(origin.x, origin.y);
            p.rotate(angle);
            p.beginShape();

            for (let i = 0; i < verts.length; i++) {
                p.vertex(verts[i].x, verts[i].y);
            }

            p.endShape(p.CLOSE);
            p.pop()
        }
    };
})(Game);
