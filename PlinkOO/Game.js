// Namespace "Game"
var Game = Game || {};

(function (Game) {
    this.p5proj = function (p) {
        p.setup = function () {
            p.createCanvas(400, 400)
        }
    };

    Game.Plinko = function () {
        this.width = 400;
        this.height = 400;

        this.test = function () {
            console.log("Seems to work");
        };

        this.test();
    };
})(Game);
