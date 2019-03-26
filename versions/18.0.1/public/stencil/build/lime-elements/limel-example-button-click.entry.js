const h = window.LimeElements.h;

class ButtonClickExample {
    constructor() {
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
    static get is() { return "limel-example-button-click"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "disabled": {
            "state": true
        },
        "loading": {
            "state": true
        }
    }; }
}

export { ButtonClickExample as LimelExampleButtonClick };
