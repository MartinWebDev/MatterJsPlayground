// Import interfaces
import { IDrawable } from "./Interfaces/IDrawable";

// Import other modules needed
import { Renderer } from "./Renderer";

export class Game {
    renderer: Renderer;

    constructor() {
        this.renderer = new Renderer();
    }
}