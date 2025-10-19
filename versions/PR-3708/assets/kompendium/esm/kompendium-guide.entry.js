import { r as registerInstance, h } from './index-DOaZxWLP.js';

const Guide = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.setRoute = this.setRoute.bind(this);
    }
    connectedCallback() {
        window.addEventListener('hashchange', this.setRoute);
        this.setRoute();
    }
    disconnectedCallback() {
        window.removeEventListener('hashchange', this.setRoute);
    }
    setRoute() {
        this.route = location.hash.replace('#', '');
    }
    render() {
        this.findGuide();
        return h("kompendium-markdown", { key: '8df12c70deaae9f377a9e0674b7f274bc62076df', text: this.text });
    }
    findGuide() {
        const guide = this.data.guides.find((g) => g.data.path + '/' === this.route);
        if (guide) {
            this.text = guide.content;
        }
    }
};

export { Guide as kompendium_guide };
//# sourceMappingURL=kompendium-guide.entry.js.map
