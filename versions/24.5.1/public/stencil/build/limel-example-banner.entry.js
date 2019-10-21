import { r as registerInstance, h, c as getElement } from './core-804afdbc.js';

const BannerExample = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.disabled = false;
        this.message = 'This is a non-blocking but also non-transient message';
        this.openBanner = this.openBanner.bind(this);
        this.closeBanner = this.closeBanner.bind(this);
        this.someCustomAction = this.someCustomAction.bind(this);
    }
    componentDidLoad() {
        this.banner = this.host.shadowRoot.querySelector('limel-banner');
    }
    render() {
        return [
            h("limel-button", { primary: true, disabled: this.disabled, label: "Show Banner", onClick: this.openBanner }),
            h("limel-banner", { message: this.message, icon: "exclamation_mark" }, h("limel-flex-container", { justify: "end", align: "stretch", slot: "buttons" }, h("limel-button", { label: "Some Action", onClick: this.someCustomAction }), h("limel-button", { label: "Close", onClick: this.closeBanner }))),
        ];
    }
    openBanner() {
        this.banner.open();
        this.disabled = true;
    }
    closeBanner() {
        this.banner.close();
        this.disabled = false;
    }
    someCustomAction() {
        alert('Triggered an action of some sort');
        this.closeBanner();
    }
    get host() { return getElement(this); }
    static get style() { return "limel-banner {\n  --icon-background-color: var(--lime-deep-red);\n  position: fixed;\n  right: 0;\n  top: 0;\n  left: 0;\n  z-index: 10;\n}\n\@media (max-width: 720px) {\n  limel-banner {\n    position: absolute;\n  }\n}\nlimel-banner limel-button:not(last-child) {\n  margin-right: 0.625rem;\n}"; }
};

export { BannerExample as limel_example_banner };
