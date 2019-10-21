import { r as registerInstance, h } from './core-804afdbc.js';

const ButtonClickExample = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.loading = false;
        this.disabled = false;
    }
    render() {
        return (h("limel-button", { label: "Click me!", primary: true, loading: this.loading, disabled: this.disabled, onClick: this.onClick }));
    }
    onClick() {
        this.disabled = true;
        this.loading = true;
        const TIME_LOADING = 1000;
        const TIME_DISABLED = 4000;
        setTimeout(() => {
            this.loading = false;
            setTimeout(() => {
                this.disabled = false;
            }, TIME_DISABLED);
        }, TIME_LOADING);
    }
};

export { ButtonClickExample as limel_example_button_click };
