const h = window.LimeElements.h;

class IconButtonExample {
    constructor() {
        this.disabled = false;
        this.toggleEnabled = this.toggleEnabled.bind(this);
    }
    render() {
        return [
            h("limel-icon-button", { label: "Add favourite", icon: "heart_outlined", disabled: this.disabled, onClick: this.onClick }),
            h("limel-flex-container", { justify: "end" },
                h("limel-button", { onClick: this.toggleEnabled, label: this.disabled ? 'Enable' : 'Disable' })),
        ];
    }
    onClick() {
        console.log('Button clicked.');
    }
    toggleEnabled() {
        this.disabled = !this.disabled;
    }
    static get is() { return "limel-example-icon-button"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "disabled": {
            "state": true
        }
    }; }
}

export { IconButtonExample as LimelExampleIconButton };
