export class EditorManager {
    tool : "draw" | "eraser" = "draw";
    selected_tile: number = 0;
    displayImageEaster: boolean = false;
    tileMap: { x: number, y: number, tile: number }[] = [];
}