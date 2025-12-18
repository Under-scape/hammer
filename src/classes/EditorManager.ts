import type { Tools } from "../type";

export class EditorManager {
    tool : Tools = "draw";
    selected_tile: number = 0;
    displayImageEaster: boolean = false;
    tileMap: { x: number, y: number, tile: number }[] = [];
}