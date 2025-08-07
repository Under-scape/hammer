export class HammerConsole {
    div: HTMLDivElement | null = null;
    initialHeight: number = 0;
    lastP: HTMLParagraphElement | null = null;

    constructor() {
        this.div = document.querySelector(".div-console");
        if (this.div) {
            this.initialHeight = this.div.scrollHeight;
        }
    }

    push(text: string, status: "INFO" | "ERROR" | "WARN" | "DEBUG" = "INFO", type: "NORMAL" | "LOADER" = "NORMAL") {

        if (this.div == null) {
            this.div = document.querySelector(".div-console");
        }

        let p = this.lastP;
        if (this.lastP == null || type == "NORMAL") {
            p = document.createElement("p");
        } else {
            p = this.lastP;
        }

        p.style.color = (
            status == "INFO" ? 'white' :
                status == "DEBUG" ? 'blue' :
                    status == "ERROR" ? 'red' : 'yellow'
        );
        p.textContent = `[${status}] ` + text;
        this.lastP = type == "LOADER" ? p : null;
        this.div?.appendChild(p);
        if (this.div) {
            this.div.scrollTop = this.div.scrollHeight;
        }
    }
}