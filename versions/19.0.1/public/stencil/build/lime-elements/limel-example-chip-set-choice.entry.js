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
        this.disabledOnChange = this.disabledOnChange.bind(this);
        this.chipSetOnChange = this.chipSetOnChange.bind(this);
    }
    render() {
        return [
            h("limel-switch", { label: "Disabled", onChange: this.disabledOnChange }),
            h("br", null),
            h("br", null),
            h("limel-chip-set", { disabled: this.disabled, type: "choice", onChange: this.chipSetOnChange, value: this.chips }),
        ];
    }
    disabledOnChange(event) {
        this.disabled = event.detail;
    }
    chipSetOnChange(event) {
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
