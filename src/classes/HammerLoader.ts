import type { ElementManager } from "./ElementManager";

export class HammerLoader {
    loadingMax: number = 0;
    loadingValue: number = 0;
    elements: ElementManager;

    constructor(elements : ElementManager) {
        this.elements = elements;
    }

    setValue(value: number) {
        this.loadingValue = value;
        const progress = this.elements.elements.div_progress;
        const progressValue = this.elements.elements.div_progress_bar;
        if (progress && progressValue) {
            progressValue.classList.remove("nodisplay");
            progress.style.width = ((this.loadingValue / this.loadingMax) * 100) + "%";
        }
    }

    reset() {
        this.loadingValue = 0;
        const progress = this.elements.elements.div_progress;
        const progressValue = this.elements.elements.div_progress_bar;
        if (progress && progressValue) {
            progressValue.classList.add("nodisplay");
            progress.style.width = "0%";
        }
    }
}