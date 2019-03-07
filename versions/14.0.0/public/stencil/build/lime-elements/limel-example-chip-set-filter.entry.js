const h = window.LimeElements.h;

class ChipSetFilterExample {
    constructor() {
        this.chips = [
            {
                id: '1',
                text: 'Lime',
            },
            {
                id: '2',
                text: 'Apple',
                selected: true,
            },
            {
                id: '3',
                text: 'Banana',
            },
        ];
        this.disabled = false;
    }
    render() {
        return [
            h("limel-switch", { label: "Disabled", onChange: event => {
                    return (this.disabled = event.detail);
                } }),
            h("br", null),
            h("br", null),
            h("limel-chip-set", { disabled: this.disabled, type: "filter", onChange: this.handleChange, value: this.chips }),
        ];
    }
    handleChange(event) {
        console.log(event.detail);
    }
    static get is() { return "limel-example-chip-set-filter"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "chips": {
            "state": true
        },
        "disabled": {
            "state": true
        }
    }; }
}

export { ChipSetFilterExample as LimelExampleChipSetFilter };
