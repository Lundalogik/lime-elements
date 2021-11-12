import { r as registerInstance, h } from './index-fb5abbae.js';

const Guide = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.setRoute = this.setRoute.bind(this);
    }
    componentWillLoad() {
        window.addEventListener('hashchange', this.setRoute);
        this.setRoute();
    }
    componentDidUnload() {
        window.removeEventListener('hashchange', this.setRoute);
    }
    setRoute() {
        this.route = location.hash.replace('#', '');
    }
    render() {
        this.findGuide();
        return h("kompendium-markdown", { text: this.text });
    }
    findGuide() {
        const guide = this.data.guides.find((g) => g.data.path + '/' === this.route);
        if (guide) {
            this.text = guide.content;
        }
    }
};

export { Guide as kompendium_guide };
