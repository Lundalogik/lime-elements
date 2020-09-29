export class ElementPool {
    private pool: Record<string, HTMLElement[]>;
    private usedElements: WeakMap<Element, boolean>;
    private document: Document;

    constructor(document: Document) {
        this.document = document;
        this.releaseAll();
        this.clear();
    }

    /**
     * Get an element from the pool
     *
     * @param {string} name tag name of the element
     *
     * @returns {HTMLElement} the element
     */
    public get(name: string): HTMLElement {
        let element = this.pool[name]?.find(this.isFree);
        if (!element) {
            element = this.createElement(name);
        }

        this.usedElements.set(element, true);

        return element;
    }

    private isFree = (element: HTMLElement) => {
        return !this.usedElements.has(element);
    };

    /**
     * Release an element from the pool so that it can be reused
     *
     * @param {HTMLElement} element the element to release from the pool
     */
    public release(element: HTMLElement): void {
        this.usedElements.delete(element);
    }

    /**
     * Release all elements from the pool so that they can be reused
     */
    public releaseAll() {
        this.usedElements = new WeakMap();
    }

    /**
     * Remove all elements from the pool and makes them available for garbage
     * collection
     */
    public clear() {
        this.pool = {};
    }

    private createElement(name: string) {
        const element = this.document.createElement(name);
        if (!(name in this.pool)) {
            this.pool[name] = [];
        }

        this.pool[name].push(element);

        return element;
    }
}
