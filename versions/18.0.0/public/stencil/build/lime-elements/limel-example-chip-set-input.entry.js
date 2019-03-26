const h = window.LimeElements.h;

import { a as ENTER, b as ENTER_KEY_CODE } from './chunk-5c5c8253.js';

class ChipSetInputExample {
    constructor() {
        this.textValue = '';
        this.disabled = false;
        this.value = [
            this.createChip('Elephant'),
            this.createChip('Caterpillar'),
            this.createChip('Badger'),
            this.createChip('Fish'),
        ];
        this.value[0].iconColor = 'var(--lime-red)'; // tslint:disable-line:no-magic-numbers
        this.value[1].iconColor = 'var(--lime-orange)'; // tslint:disable-line:no-magic-numbers
        this.value[2].iconColor = 'var(--lime-green)'; // tslint:disable-line:no-magic-numbers
        this.value[3].iconColor = 'var(--lime-blue)'; // tslint:disable-line:no-magic-numbers
    }
    render() {
        return [
            h("limel-switch", { label: "Disabled", onChange: event => {
                    return (this.disabled = event.detail);
                } }),
            h("br", null),
            h("br", null),
            h("limel-chip-set", { label: "Animal", type: "input", value: this.value, required: true, disabled: this.disabled, onChange: this.handleChange.bind(this), onInput: this.handleInput.bind(this), onKeyUp: this.handleKeyUp.bind(this) }),
        ];
    }
    handleInput(event) {
        this.textValue = event.detail;
    }
    handleKeyUp(event) {
        if (event.key === ENTER || event.keyCode === ENTER_KEY_CODE) {
            this.value = [...this.value, this.createChip(this.textValue)];
            this.textValue = null;
        }
    }
    handleChange(event) {
        console.log(event.detail);
        this.value = event.detail;
    }
    createChip(name) {
        return {
            id: name,
            text: name,
            removable: true,
            icon: `${name}`.toLowerCase(),
        };
    }
    static get is() { return "limel-example-chip-set-input"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "disabled": {
            "state": true
        },
        "textValue": {
            "state": true
        },
        "value": {
            "state": true
        }
    }; }
    static get style() { return "limel-chip-set[type=\"input\"] {\n  --icon-background-color: rgb(173, 173, 173);\n  --icon-color: white; }"; }
}

export { ChipSetInputExample as LimelExampleChipSetInput };
