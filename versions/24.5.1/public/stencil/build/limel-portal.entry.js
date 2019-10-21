import { r as registerInstance, h, c as getElement } from './core-804afdbc.js';

const Portal = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        /**
         * True if the content within the portal should be visible
         *
         * If the content is from within a dialog for instance, this can be set to
         * true from false when the dialog opens to position the content properly
         */
        this.visible = false;
        /**
         * Dynamic styling that can be applied to the container holding the content
         */
        this.containerStyle = {};
        /**
         * Parent element to move the content to
         */
        this.parent = document.body;
    }
    connectedCallback() {
        this.attachContainer();
        this.styleContainer();
    }
    disconnectedCallback() {
        this.removeContainer();
    }
    componentDidLoad() {
        this.createContainer();
        this.attachContainer();
        this.styleContainer();
    }
    componentDidUpdate() {
        this.styleContainer();
    }
    render() {
        return h("slot", null);
    }
    createContainer() {
        const slot = this.host.shadowRoot.querySelector('slot');
        const content = slot.assignedElements();
        this.container = document.createElement('div');
        this.container.setAttribute('id', this.containerId);
        content.forEach(element => {
            this.container.appendChild(element);
        });
    }
    attachContainer() {
        if (!this.container) {
            return;
        }
        this.parent.appendChild(this.container);
    }
    removeContainer() {
        this.container.parentElement.removeChild(this.container);
    }
    styleContainer() {
        if (!this.container) {
            return;
        }
        const rect = this.host.getBoundingClientRect();
        const [x, y] = this.getPosition(rect);
        const viewportHeight = this.getViewportHeight();
        const containerHeight = viewportHeight - rect.y;
        this.container.style.position = 'absolute';
        this.container.style.left = `${x}px`;
        this.container.style.top = `${y}px`;
        this.container.style.width = `${rect.width}px`;
        this.container.style.height = `${containerHeight}px`;
        this.container.style.display = 'block';
        if (!this.visible) {
            this.container.style.display = 'none';
        }
        Object.keys(this.containerStyle).forEach(property => {
            this.container.style[property] = this.containerStyle[property];
        });
    }
    getPosition(rect) {
        let x = rect.x;
        let y = rect.y;
        let element = this.container.parentElement;
        while (element) {
            x += element.scrollLeft;
            y += element.scrollTop;
            element = element.parentElement;
        }
        return [x, y];
    }
    getViewportHeight() {
        return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    }
    get host() { return getElement(this); }
    static get style() { return ":host(limel-portal) {\n  display: block;\n}"; }
};

export { Portal as limel_portal };
