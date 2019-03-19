const h = window.LimeElements.h;

class ChipSetExample {
    constructor() {
        this.disabled = false;
    }
    render() {
        return [
            h("limel-switch", { label: "Disabled", onChange: event => {
                    return (this.disabled = event.detail);
                } }),
            h("br", null),
            h("br", null),
            h("limel-chip-set", { disabled: this.disabled, onInteract: this.handleInteract, value: [
                    {
                        id: '1',
                        text: 'Lime',
                    },
                    {
                        id: '2',
                        text: 'Apple',
                    },
                    {
                        id: '3',
                        text: 'Banana',
                    },
                ] }),
        ];
    }
    handleInteract(event) {
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
