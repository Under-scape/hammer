export class Tile {
    x: number;
    y: number;
    tilesheet: HTMLImageElement;
    tile: HTMLImageElement | null = null;
    fullyTransparent: boolean = true;

    constructor(x: number, y: number, tilesheet: HTMLImageElement) {
        this.x = x;
        this.y = y;
        this.tilesheet = tilesheet;
    }

    async loadTile() {
        const canvas = new OffscreenCanvas(16, 16);
        const ctx = canvas.getContext("2d");

        ctx?.drawImage(this.tilesheet, this.x, this.y, 16, 16, 0, 0, 16, 16);
        const img = document.createElement("img");
        const blob = await canvas.convertToBlob();
        img.src = URL.createObjectURL(blob);
        // img.loading = "eager";

        this.tile = img;

        if (ctx) {
            const data = ctx.getImageData(0, 0, 16, 16).data;
            for (let i = 3; i < data.length; i += 4) {
                if (data[i] !== 0) {
                    this.fullyTransparent = false;
                    break;
                }
            }
        }
    }
}