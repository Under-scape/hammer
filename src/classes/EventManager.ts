export class EventsManager {
    events: { target: EventTarget, type: string, handler: EventListenerOrEventListenerObject }[] = [];

    addEvent<K extends keyof DocumentEventMap>(target: EventTarget, type: K, handler: (e: DocumentEventMap[K]) => void) {

        // @ts-expect-error
        this.events.push({ target, type, handler });
        // @ts-expect-error
        target.addEventListener(type, handler);
    }

    destroy() {
        this.events.forEach((e) => {
            e.target.removeEventListener(e.type, e.handler);
        });
    }
}