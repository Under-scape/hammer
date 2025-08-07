import { FloorToMultiple } from "../utils/math";
import type { EditorManager } from "./EditorManager";
import type { EventsManager } from "./EventManager";
import type { HammerConsole } from "./HammerConsole";
import type { Tile } from "./Tile";

export class CanvasManager {

    canvas: HTMLCanvasElement | null = null;
    hevent: EventsManager;
    hconsole: HammerConsole;
    heditor: EditorManager;
    zoom: number = 0.5;

    canvasOffset = { x: 0, y: 0 };
    CanvasRectSelectPosition: { x: number, y: number } | null = null

    realMousePosition: { x: number, y: number } | null = null;
    mousePositionMap: { x: number, y: number } | null = null;

    canvasMoveClick: boolean = false;

    constructor(hevent: EventsManager, hconsole : HammerConsole, heditor : EditorManager) {
        this.hevent = hevent;
        this.hconsole = hconsole;
        this.heditor = heditor;
    }

    setCanvas(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.hevent.addEvent(this.canvas, "mouseleave", () => this.CanvasRectSelectPosition = null);
        this.hevent.addEvent(this.canvas, "mousemove", (e) => {
            this.updateCursor(e.clientX, e.clientY);
            let pos = { x: e.clientX, y: e.clientY };
            if (this.realMousePosition != null && this.canvasMoveClick) {
                this.canvasOffset.x += Math.round((pos.x - this.realMousePosition.x) * this.zoom);
                this.canvasOffset.y += Math.round((pos.y - this.realMousePosition.y) * this.zoom);
            }
            this.realMousePosition = { x: pos.x, y: pos.y };
        });

        // ? Gerer le zoom
        this.hevent.addEvent(this.canvas, "wheel", (e) => {
            e.preventDefault();
            const zoomIntensity = 0.009  ;
            const delta = e.deltaY < 0 ? 1 - zoomIntensity : 1 + zoomIntensity;
            this.zoom *= delta;
            console.log(this.zoom);
            if (this.zoom > 1.5) {
                this.zoom = 1.5;
            }
            if (this.zoom < 0.05) {
                this.zoom = 0.05;
            }
            this.updateCursor(e.clientX, e.clientY);
        });

        // ? Activer le mouvement du monde
        this.hevent.addEvent(this.canvas, "mousedown", (e) => this.canvasMoveClick = e.button == 2 && true);
        // ? Desactiver le mouvement du monde
        this.hevent.addEvent(document.body, "mouseup", (e) => this.canvasMoveClick = e.button == 2 && false);
        // ? Gestion des clicks pour les tools
        this.hevent.addEvent(this.canvas, "click", () => {
            if (this.heditor.tool == "draw") {
                const tilespos = this.heditor.tileMap.filter((t) => (t.x == this.mousePositionMap?.x && t.y == this.mousePositionMap?.y));
                if (this.mousePositionMap && tilespos.length < 2) {
                    if (tilespos.length == 1 && tilespos[0].tile == this.heditor.selected_tile) return;
                    this.heditor.tileMap.push({ tile: this.heditor.selected_tile, x: this.mousePositionMap.x, y: this.mousePositionMap.y });
                    this.hconsole.push(`Tile (${this.mousePositionMap.x / 16}, ${this.mousePositionMap.y / 16}) placed !`);
                }
            } else if (this.heditor.tool == "eraser") {
                this.heditor.tileMap = this.heditor.tileMap.filter((t) => !(t.x == this.mousePositionMap?.x && t.y == this.mousePositionMap?.y));
                if (this.mousePositionMap) {
                    this.hconsole.push(`Tile (${this.mousePositionMap.x / 16}, ${this.mousePositionMap.y / 16}) deleted !`);
                }
            }
        });
    }

    updateCursor(x: number, y: number) {
        if (this.canvas) {
            const pos = {
                x: ((x - this.canvas.getClientRects()[0].left) * this.zoom) - (this.canvasOffset.x % 16),
                y: ((y - this.canvas.getClientRects()[0].top) * this.zoom) - (this.canvasOffset.y % 16)
            }

            this.CanvasRectSelectPosition = FloorToMultiple(pos, 16, 16);

            const pos1 = {
                x: ((x - this.canvas.getClientRects()[0].left) * this.zoom) - this.canvasOffset.x,
                y: ((y - this.canvas.getClientRects()[0].top) * this.zoom) - this.canvasOffset.y
            }

            this.mousePositionMap = FloorToMultiple(pos1, 16, 16);
        }
    }

    update() {
        if (this.canvas) {
            this.canvas.style.cursor = this.canvasMoveClick ? "grab" : ""

            const width = this.canvas.getClientRects()[0].width;
            const height = this.canvas.getClientRects()[0].height;
            this.canvas.width = width * this.zoom;
            this.canvas.height = height * this.zoom;
            this.canvas.style.width = `${width}px`;
            this.canvas.style.height = `${height}px`;
        }
    }

    draw(tiles: Tile[], tileMap: { x: number, y: number, tile: number }[], emptyTile: Tile) {
        if (this.canvas) {

            const ctx = this.canvas.getContext("2d");
            const width = this.canvas.getClientRects()[0].width;
            const height = this.canvas.getClientRects()[0].height;

            if (ctx) {
                // ? Reset le canvas
                ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

                // ? afficher le centre de la map
                ctx.strokeStyle = "white";
                ctx.globalAlpha = 0.3;
                ctx.beginPath();
                ctx.moveTo(0 + this.canvasOffset.x, 0 + this.canvasOffset.y - 32);
                ctx.lineTo(0 + this.canvasOffset.x, 0 + this.canvasOffset.y + 32);
                ctx.stroke();
                ctx.moveTo(0 + this.canvasOffset.x - 32, 0 + this.canvasOffset.y);
                ctx.lineTo(0 + this.canvasOffset.x + 32, 0 + this.canvasOffset.y);
                ctx.stroke();

                // ? Gestion des tiles  
                ctx.globalAlpha = 1;
                // * Exemple :  
                // if (this.tiles.length > 0) {
                //     if (this.emptyTile && this.emptyTile.tile) {
                //         ctx.drawImage(this.emptyTile.tile, (16 * 0) + this.canvasOffset.x, (16 * 0) + this.canvasOffset.y, 16, 16);
                //     }
                // }
                if (tiles.length !== 0) {
                    tileMap.forEach((t) => {
                        if (t.x + this.canvasOffset.x >= -16 && t.x + this.canvasOffset.x <= width * this.zoom && t.y + this.canvasOffset.y >= -16 && t.y + this.canvasOffset.y <= height * this.zoom) {
                            if (tiles.length >= t.tile + 1) {
                                const ti = tiles[t.tile].tile;
                                if (ti) {
                                    ctx.drawImage(ti, t.x + this.canvasOffset.x, t.y + this.canvasOffset.y, 16, 16);
                                }
                            } else {
                                if (emptyTile && emptyTile.tile) {
                                    ctx.drawImage(emptyTile.tile, t.x + this.canvasOffset.x, t.y + this.canvasOffset.y, 16, 16);
                                }
                            }
                        }
                    });
                }

                // ? Afficher la position du curseur :
                if (this.CanvasRectSelectPosition != null) {
                    ctx.fillStyle = "white";
                    ctx.globalAlpha = 0.2
                    ctx.fillRect(this.CanvasRectSelectPosition.x + (this.canvasOffset.x % 16), this.CanvasRectSelectPosition.y + (this.canvasOffset.y % 16), 16, 16);
                }
            }
        }
    }

    centerView() {
        if (this.canvas) {
            const width = this.canvas.getClientRects()[0].width;
            const height = this.canvas.getClientRects()[0].height;
            this.canvasOffset.x = Math.round(width / 2 * this.zoom);
            this.canvasOffset.y = Math.round(height / 2 * this.zoom);
        }
    }
}