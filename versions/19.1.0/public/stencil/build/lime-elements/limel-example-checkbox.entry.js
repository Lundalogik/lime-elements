const h = window.LimeElements.h;

class CheckboxExample {
    constructor() {
        this.disabled = false;
        this.value = false;
        this.changeHandler = this.changeHandler.bind(this);
        this.onClickToggleEnabled = this.onClickToggleEnabled.bind(this);
        this.onClickToggleChecked = this.onClickToggleChecked.bind(this);
    }
    render() {
        return (h("section", null,
            h("div", null,
                h("limel-checkbox", { disabled: this.disabled, label: "My fab checkbox", id: "fab", checked: this.value, onChange: this.changeHandler }),
                h("limel-flex-container", { justify: "end" },
                    h("limel-button", { onClick: this.onClickToggleEnabled, label: this.disabled ? 'Enable' : 'Disable' }),
                    h("limel-button", { onClick: this.onClickToggleChecked, label: "Toggle checked" }))),
            h("p", null,
                "Value: ",
                h("code", null, this.value.toString()))));
    }
    onClickToggleEnabled() {
        this.disabled = !this.disabled;
    }
    onClickToggleChecked() {
        this.value = !this.value;
    }
    changeHandler(event) {
        this.value = event.detail;
    }
    static get is() { return "limel-example-checkbox"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "disabled": {
            "state": true
        },
        "value": {
            "state": true
        }
    }; }
    static get style() { return "div {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-pack: justify;\n  justify-content: space-between; }\n\np {\n  font-size: small; }"; }
}

export { CheckboxExample as LimelExampleCheckbox };
