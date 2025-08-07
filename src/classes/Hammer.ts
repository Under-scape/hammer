import { DownloadTextFile, IsFilenameFormat } from "../utils/file";
import { ImageToString, WaitImgByFile } from "../utils/image";
import { CanvasManager } from "./CanvasManager";
import { EditorManager } from "./EditorManager";
import { ElementManager } from "./ElementManager";
import { EventsManager } from "./EventManager";
import { HammerConsole } from "./HammerConsole";
import { HammerLoader } from "./HammerLoader";
import { Tile } from "./Tile";
import pako from "pako";

export class Hammer {
    canvas: HTMLCanvasElement | null = null;
    inputTileSheet: HTMLInputElement | null = null;

    tilesheet: HTMLImageElement | null = null;
    tiles: Tile[] = [];
    emptyTile: Tile | null = null;

    // * utils
    hconsole: HammerConsole = new HammerConsole();
    hevent: EventsManager = new EventsManager();
    helements: ElementManager = new ElementManager(this.hevent);
    hloader: HammerLoader = new HammerLoader(this.helements);
    heditor : EditorManager = new EditorManager();
    hcanvas: CanvasManager = new CanvasManager(this.hevent, this.hconsole, this.heditor);

    constructor() {
        // ? Desactiver le context menu
        this.hevent.addEvent(document, "contextmenu", (e) => e.preventDefault());

        // ? Raccourcis clavier
        this.hevent.addEvent(document, "keydown", (e: KeyboardEvent) => {
            const keypress = e.key;
            if (keypress === "c") {
                e.preventDefault();
                this.hcanvas.centerView();
            } else if (keypress === "u") {
                e.preventDefault();
                this.helements.elements.button_set_tilesheet?.click();
            } else if (keypress === "e") {
                e.preventDefault();
                this.heditor.tool = "eraser";
            } else if (keypress === "d") {
                e.preventDefault();
                this.heditor.tool = "draw";
            } else if (keypress === "F9") {
                e.preventDefault();
                this.heditor.displayImageEaster = !this.heditor.displayImageEaster;
                this.hconsole.push("It's a Easter egg! Value : " + this.heditor.displayImageEaster, "DEBUG");
            } else if (e.ctrlKey && keypress == "s") {
                e.preventDefault();
                this.mapToJson();
            }
        });

        // ? Lancer l'affichage du canvas
        this.resetTiles();
        this.displayCanvas();

        // ? Load de la tile empty
        const imgemp = new Image();
        imgemp.src = "/src/assets/images/missing_texture.png";

        imgemp.onload = async () => {
            this.emptyTile = new Tile(0, 0, imgemp);
            await this.emptyTile.loadTile();
        };
    }

    mapToJson() {
        if (this.tilesheet == null) return this.hconsole.push("Tilesheet not exist !", "ERROR");
        const tilesheet_string = ImageToString(this.tilesheet);
        if (tilesheet_string)
            // @ts-expect-error
            DownloadTextFile(pako.deflate(JSON.stringify({ tilesheet: tilesheet_string, map: this.heditor.tileMap })), "my_map.tmpx");
        else
            return this.hconsole.push("An error has occurred !", "ERROR");
    }



    resetTiles() {
        if (this.helements.elements.div_view_tiles)
            this.helements.elements.div_view_tiles.innerHTML = "";
        this.tiles = [];
        this.tilesheet = null;
    }

    async displayCanvas() {
        if (this.canvas != null && this.emptyTile) {
            // ? Update le canvas
            this.hcanvas.update();

            // ? Affichage des datas
            this.hcanvas.draw(this.tiles, this.heditor.tileMap, this.emptyTile);
        } else {

            // ? charger le canvas
            this.canvas = this.helements.elements.canvas;
            if (this.canvas != null) {
                this.hcanvas.setCanvas(this.canvas);
                this.hcanvas.centerView();
            }
        }

        // ? Relancer la function
        requestAnimationFrame(this.displayCanvas.bind(this));
    }


    async loadTileSheet(file: File) {
        // ? Verif du format
        if (!IsFilenameFormat(["png", "jpg", "jpeg"], file.name)) {
            this.hloader.reset();
            return this.hconsole.push("File format invalid !", "ERROR")
        };

        // ? Generer une image sur base du fichier
        await this.setTileSheet(await WaitImgByFile(file));
    }

    async setTileSheet(img: HTMLImageElement) {

        // ? desactiver le bouton pour add des ts
        if (this.helements.elements.button_set_tilesheet)
            this.helements.elements.button_set_tilesheet.disabled = true;
        if (this.helements.elements.button_import_map)
            this.helements.elements.button_import_map.disabled = true;

        // ? Reset l'ancien ts
        this.resetTiles();

        // ? Save le tilesheet
        this.tilesheet = img;

        // ? Recup le nombre
        const tilesMax = Math.floor(img.width / 16) * Math.floor(img.height / 16);
        this.hloader.loadingMax = tilesMax;
        this.hloader.setValue(0);

        // ? Loader les tiles
        let i = 0;
        for (let x = 0; x < img.width; x += 16) {
            for (let y = 0; y < img.height; y += 16) {
                const t = new Tile(x, y, img);
                await t.loadTile();
                if (!t.fullyTransparent) {
                    this.tiles.push(t);
                    if (this.heditor.displayImageEaster) {
                        this.heditor.tileMap.push({ tile: this.tiles.length - 1, x, y });
                    }

                    const tile = t.tile;
                    if (tile) {
                        const id = this.tiles.length - 1;
                        tile.id = "t_" + id;
                        tile.addEventListener("click", () => {
                            this.heditor.selected_tile = id;
                        });
                        t.tile && this.helements.elements.div_view_tiles?.appendChild(tile);
                    }
                }
                i++;
                this.hconsole.push("Loading tile (" + i + "/" + tilesMax + ")", "INFO", "LOADER");
                this.hloader.setValue(i);
            }
        }

        // ? Log et remettre tous correctement
        this.hconsole.push(`TileSheet Loaded ! (${this.tiles.length} tiles)`, "INFO");
        this.hloader.reset();
        if (this.helements.elements.button_set_tilesheet)
            this.helements.elements.button_set_tilesheet.disabled = false;
        if (this.helements.elements.button_import_map)
            this.helements.elements.button_import_map.disabled = false;
    }
}