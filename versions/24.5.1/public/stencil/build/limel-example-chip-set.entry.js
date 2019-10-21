import { r as registerInstance, h } from './core-804afdbc.js';

const ChipSetExample = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.disabled = false;
        this.onInteract = this.onInteract.bind(this);
        this.toggleEnabled = this.toggleEnabled.bind(this);
    }
    render() {
        return [
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
            h("p", null, h("limel-flex-container", { justify: "end" }, h("limel-checkbox", { label: "Disabled", onChange: this.toggleEnabled, checked: this.disabled }))),
        ];
    }
    onInteract(event) {
        console.log(event.detail);
    }
    toggleEnabled() {
        this.disabled = !this.disabled;
    }
};

export { ChipSetExample as limel_example_chip_set };
