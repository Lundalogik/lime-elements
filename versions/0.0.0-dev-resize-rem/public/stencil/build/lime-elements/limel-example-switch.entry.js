const h = window.LimeElements.h;

class SwitchExample {
    constructor() {
        this.valueOne = false;
        this.valueTwo = true;
        this.valueThree = false;
        this.valueFour = true;
        this.toggleExampleValue = false;
    }
    render() {
        return [
            h("section", null,
                h("h3", null, "Basic usage"),
                h("limel-switch", { label: `${this.valueOne} - Enabled`, value: this.valueOne, onChange: event => {
                        this.valueOne = event.detail;
                    } }),
                h("limel-switch", { label: `${this.valueTwo} - Enabled`, value: this.valueTwo, onChange: event => {
                        this.valueTwo = event.detail;
                    } }),
                h("limel-switch", { label: `${this.valueThree} - Disabled`, value: this.valueThree, disabled: true, onChange: event => {
                        this.valueThree = event.detail;
                    } }),
                h("limel-switch", { label: `${this.valueFour} - Disabled`, value: this.valueFour, disabled: true, onChange: event => {
                        this.valueFour = event.detail;
                    } })),
            h("section", null,
                h("h3", null, "Updating the value from outside the component"),
                h("limel-button", { label: "Toggle", primary: true, onClick: () => {
                        this.toggleExampleValue = !this.toggleExampleValue;
                    } }),
                h("limel-switch", { label: `Current value: ${this.toggleExampleValue.toString()}`, value: this.toggleExampleValue, onChange: event => {
                        this.toggleExampleValue = event.detail;
                    } })),
        ];
    }
    static get is() { return "limel-example-switch"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "toggleExampleValue": {
            "state": true
        },
        "valueFour": {
            "state": true
        },
        "valueOne": {
            "state": true
        },
        "valueThree": {
            "state": true
        },
        "valueTwo": {
            "state": true
        }
    }; }
    static get style() { return "limel-switch {\n  margin: 1.25rem 0;\n  display: block; }"; }
}

export { SwitchExample as LimelExampleSwitch };
