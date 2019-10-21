import { r as registerInstance, h } from './core-804afdbc.js';

const ChipSetChoiceExample = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
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
        this.chipSetOnChange = this.chipSetOnChange.bind(this);
        this.setDisabled = this.setDisabled.bind(this);
    }
    render() {
        return [
            h("limel-chip-set", { disabled: this.disabled, type: "choice", onChange: this.chipSetOnChange, value: this.chips }),
            h("p", null, h("limel-flex-container", { justify: "end" }, h("limel-checkbox", { label: "Disabled", onChange: this.setDisabled, checked: this.disabled }))),
        ];
    }
    chipSetOnChange(event) {
        console.log(event.detail);
    }
    setDisabled(event) {
        this.disabled = event.detail;
    }
};

export { ChipSetChoiceExample as limel_example_chip_set_choice };
