import { r as registerInstance, h } from './core-804afdbc.js';

const ChipSetFilterExample = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.chips = [
            {
                id: 1,
                text: 'Lime',
            },
            {
                id: 2,
                text: 'Apple',
                selected: true,
            },
            {
                id: 3,
                text: 'Banana',
            },
        ];
        this.disabled = false;
        this.chipSetOnChange = this.chipSetOnChange.bind(this);
        this.setDisabled = this.setDisabled.bind(this);
    }
    render() {
        return [
            h("limel-chip-set", { disabled: this.disabled, type: "filter", onChange: this.chipSetOnChange, value: this.chips }),
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

export { ChipSetFilterExample as limel_example_chip_set_filter };
