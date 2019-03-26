const h = window.LimeElements.h;

class ChipSetChoiceExample {
    constructor() {
        this.chips = [
            {
                id: 1,
                text: 'Lime',
                icon: 'citrus',
            },
            {
                id: 2,
                text: 'Apple',
                selected: true,
                icon: 'apple',
            },
            {
                id: 3,
                text: 'Banana',
                icon: 'banana',
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
            h("limel-chip-set", { disabled: this.disabled, type: "choice", onChange: this.handleChange, value: this.chips }),
        ];
    }
    handleChange(event) {
        console.log(event.detail);
    }
    static get is() { return "limel-example-chip-set-choice"; }
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

export { ChipSetChoiceExample as LimelExampleChipSetChoice };
