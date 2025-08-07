import type { EventsManager } from "./EventManager";

export class ElementManager {
    loaded = false;
    elements: {
        canvas : HTMLCanvasElement | null;

        button_set_tilesheet: HTMLButtonElement | null;
        button_import_map: HTMLButtonElement | null;

        div_progress_bar : HTMLDivElement | null;
        div_progress : HTMLDivElement | null;
        div_view_tiles: HTMLDivElement | null;
    } = {
        canvas: null,
        button_set_tilesheet: null,
        button_import_map: null,
        div_progress_bar: null,
        div_progress: null,
        div_view_tiles: null,
    };

    constructor(eventManager: EventsManager) {
        eventManager.addEvent(document, "DOMContentLoaded", () => {
            this.loaded = true;
        });
    }

    setElement(name: keyof ElementManager["elements"], el: null) {
        this.elements[name] = el;
    }
}
