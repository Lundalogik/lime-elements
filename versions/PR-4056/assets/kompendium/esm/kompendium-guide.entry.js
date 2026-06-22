import { r as registerInstance, h } from './index-26EzvxF0.js';

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
        return h("kompendium-markdown", { key: '134a1e05112b69474df22dbcbd198aaad6d16fbf', text: this.text });
    }
    findGuide() {
        const guide = this.data.guides.find((g) => g.data.path + '/' === this.route);
        if (guide) {
            this.text = guide.content;
        }
    }
};

export { Guide as kompendium_guide };
