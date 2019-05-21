const h = window.LimeElements.h;

class ChipSetExample {
    constructor() {
        this.disabled = false;
        this.disabledOnChange = this.disabledOnChange.bind(this);
        this.onInteract = this.onInteract.bind(this);
    }
    render() {
        return [
            h("limel-switch", { label: "Disabled", onChange: this.disabledOnChange }),
            h("br", null),
            h("br", null),
            h("limel-chip-set", { disabled: this.disabled, onInteract: this.onInteract, value: [
                    {
                        id: 1,
                        text: 'Lime',
                    },
                    {
                        id: 2,
                        text: 'Apple',
                    },
                    {
                        id: 3,
                        text: 'Banana',
                    },
                ] }),
        ];
    }
    disabledOnChange(event) {
        this.disabled = event.detail;
    }
    onInteract(event) {
        console.log(event.detail);
    }
    static get is() { return "limel-example-chip-set"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "disabled": {
            "state": true
        }
    }; }
}

export { ChipSetExample as LimelExampleChipSet };
