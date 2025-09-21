import { useEffect, useRef } from "react"
import { Hammer } from "./classes/Hammer";
import pako from "pako";

function App() {

    // ? elements
    // * Canvas
    const canvas = useRef(null);

    // * Buttons
    const button_set_tilesheet = useRef(null);
    const button_import_map = useRef(null);

    // * Divs
    const div_progress_bar = useRef(null);
    const div_progress = useRef(null);
    const div_view_tiles = useRef(null);

    // * Input (a part)
    const inputFileTilesheet = useRef<HTMLInputElement>(null);
    const inputFileMap = useRef<HTMLInputElement>(null);

    // ? hammer
    const hammerRef = useRef<Hammer | null>(null);

    useEffect(() => {
        hammerRef.current = new Hammer();
        hammerRef.current.helements.setElement("canvas", canvas.current);
        hammerRef.current.helements.setElement("button_set_tilesheet", button_set_tilesheet.current);
        hammerRef.current.helements.setElement("button_import_map", button_import_map.current);
        hammerRef.current.helements.setElement("div_progress_bar", div_progress_bar.current);
        hammerRef.current.helements.setElement("div_progress", div_progress.current);
        hammerRef.current.helements.setElement("div_view_tiles", div_view_tiles.current);
        return () => {
            hammerRef.current?.hevent.destroy();
        }
    }, []);

    // ? functions
    const handleLoadTilesheet = () => {
        if (hammerRef.current != null) {
            const files = inputFileTilesheet.current?.files;
            if (files && files?.length > 0) {
                hammerRef.current.loadTileSheet(files[0]);
            }
        }
    }
    const handleLoadMap = async () => {
        if (hammerRef.current != null) {
            const files = inputFileMap.current?.files;
            if (files && files.length > 0) {
                hammerRef.current.hconsole.push("Importing the current map...");
                // ? Verif du format
                let filenameSplit = files[0].name.split(".");
                if (!["tmpx"].includes(filenameSplit[filenameSplit.length - 1])) {
                    return hammerRef.current.hconsole.push("File format invalid !", "ERROR")
                };
                try {
                    let reader = new FileReader();
                    reader.readAsArrayBuffer(files[0]);
                    reader.onload = (evt) => {
                        if (evt.target) {
                            // @ts-expect-error
                            const uncompressed_data = pako.inflate(evt.target.result, {to: "string"});
                            console.log(uncompressed_data)
                            const data = JSON.parse(uncompressed_data as string);
                            if (hammerRef.current) {
                                const tl = new Image();
                                tl.src = data.tilesheet;
                                tl.onload = () => {
                                    if (hammerRef.current) {
                                        hammerRef.current.setTileSheet(tl);
                                        hammerRef.current.heditor.tileMap = data.map;
                                    }
                                };

                            }
                        }
                    }
                } catch (error) {
                    hammerRef.current.hconsole.push("Error importing map.", "ERROR");
                }
            }
        }
    }

    return (
        <>
            <div ref={div_progress_bar} className="progress-bar nodisplay">
                <div ref={div_progress} className="progress"></div>
            </div>


            <div className="div-hammer-container">
                <div className="tools">

                    <button onClick={() => inputFileMap.current?.click()} ref={button_import_map}><img src="/assets/images/import.png" alt="import" />
                        <span>Import Map (I)</span>
                        <input type="file" id="inputFileMap" ref={inputFileMap} onChange={handleLoadMap} className="nodisplay" accept=".tmpx" />
                    </button>

                    <button onClick={() => { hammerRef.current && hammerRef.current.mapToJson() }}>
                        <img src="/assets/images/save.png" alt="save" />
                        <span>Save local copy (ctrl + s)</span>
                    </button>

                    <hr />

                    <button onClick={() => inputFileTilesheet.current?.click()} ref={button_set_tilesheet}>
                        <img src="/assets/images/palet.png" alt="palet" />
                        <span>Upload Tilesheet (U)</span>
                        <input type="file" id="inputFileTS" ref={inputFileTilesheet} onChange={handleLoadTilesheet} className="nodisplay"  accept="image/png, image/jpg, image/jpeg" />
                    </button>

                    <button onClick={() => { if (hammerRef.current) { hammerRef.current.heditor.tool = "draw"; } }}>
                        <img src="/assets/images/pen.png" alt="pen" />
                        <span>Draw (D)</span>
                    </button>

                    <button onClick={() => { if (hammerRef.current) { hammerRef.current.heditor.tool = "eraser"; } }}>
                        <img src="/assets/images/erase.png" alt="erase" />
                        <span>Erase (E)</span>
                    </button>

                    <button>
                        <img src="/assets/images/bucket.png" alt="bucket" />
                        <span>Bucket (B)</span>
                    </button>

                    <button>
                        <img src="/assets/images/rect.png" alt="rect" />
                        <span>Rectangle (R)</span>
                    </button>

                    <button>
                        <img src="/assets/images/measure.png" alt="measure" />
                        <span>Measure (M)</span>
                    </button>

                    <hr />

                    <button>
                        <img src="/assets/images/center.png" alt="center" onClick={() => hammerRef.current && hammerRef.current.hcanvas.centerView()} />
                        <span>Center view (C)</span>
                    </button>

                </div>
                <div className="div-container-map">
                    <div className="container-tiles">
                        <div ref={div_view_tiles} className="div-scroll-tiles">

                        </div>
                    </div>
                    <div className="div-container-view">
                        <div className="div-canvas-container">
                            <canvas ref={canvas} id="canvasHammer"></canvas>
                        </div>

                        <div className="div-console" contentEditable="true">
                        </div>
                    </div>
                </div>

            </div>

        </>
    )
}

export default App
