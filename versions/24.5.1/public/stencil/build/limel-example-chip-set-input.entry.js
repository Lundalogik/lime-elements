import { r as registerInstance, h } from './core-804afdbc.js';
import { E as ENTER, a as ENTER_KEY_CODE } from './keycodes-ab559a88.js';

const ChipSetInputExample = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.textValue = '';
        this.required = false;
        this.readonly = false;
        this.disabled = false;
        this.maxItems = 0;
        this.emptyInputOnBlur = true;
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
        this.chipSetOnChange = this.chipSetOnChange.bind(this);
        this.onInteract = this.onInteract.bind(this);
        this.onInput = this.onInput.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.setDisabled = this.setDisabled.bind(this);
        this.setReadonly = this.setReadonly.bind(this);
        this.setRequired = this.setRequired.bind(this);
        this.setEmptyInputOnBlur = this.setEmptyInputOnBlur.bind(this);
        this.setMaxItems = this.setMaxItems.bind(this);
    }
    render() {
        return [
            h("limel-flex-container", { align: "end" }, h("limel-chip-set", { label: "Animal", type: "input", value: this.value, required: this.required, readonly: this.readonly, disabled: this.disabled, maxItems: this.maxItems, onChange: this.chipSetOnChange, onInput: this.onInput, onInteract: this.onInteract, onKeyUp: this.onKeyUp, searchLabel: "Add an animal", emptyInputOnBlur: this.emptyInputOnBlur }), h("limel-input-field", { label: "Max items", value: this.maxItems.toString(), type: "number", onChange: this.setMaxItems })),
            h("p", null, h("limel-flex-container", { justify: "end" }, h("limel-checkbox", { label: "Empty input on blur", onChange: this.setEmptyInputOnBlur, checked: this.emptyInputOnBlur }), h("limel-checkbox", { label: "Disabled", onChange: this.setDisabled, checked: this.disabled }), h("limel-checkbox", { label: "Readonly", onChange: this.setReadonly, checked: this.readonly }), h("limel-checkbox", { label: "Required", onChange: this.setRequired, checked: this.required }))),
            h("p", null, "Value: ", h("code", null, JSON.stringify(this.value))),
        ];
    }
    onInput(event) {
        this.textValue = event.detail;
    }
    onKeyUp(event) {
        if ((event.key === ENTER || event.keyCode === ENTER_KEY_CODE) &&
            this.textValue.trim()) {
            this.value = [
                ...this.value,
                this.createChip(this.textValue.trim()),
            ];
            this.textValue = '';
        }
    }
    chipSetOnChange(event) {
        console.log(event.detail);
        this.value = event.detail;
    }
    onInteract(event) {
        console.log('Chip interacted with: ', event.detail);
    }
    createChip(name) {
        return {
            id: name,
            text: name,
            removable: true,
            icon: `${name}`.toLowerCase(),
        };
    }
    setDisabled(event) {
        this.disabled = event.detail;
    }
    setReadonly(event) {
        this.readonly = event.detail;
    }
    setRequired(event) {
        this.required = event.detail;
    }
    setEmptyInputOnBlur(event) {
        this.emptyInputOnBlur = event.detail;
    }
    setMaxItems(event) {
        this.maxItems = +event.detail;
    }
    static get style() { return "limel-chip-set[type=input] {\n  --icon-background-color: rgb(173, 173, 173);\n  --icon-color: white;\n  -ms-flex-positive: 1;\n  flex-grow: 1;\n  -ms-flex-negative: 0;\n  flex-shrink: 0;\n}\n\nlimel-input-field {\n  -ms-flex-positive: 0;\n  flex-grow: 0;\n  -ms-flex-negative: 0;\n  flex-shrink: 0;\n  margin-left: 1rem;\n  width: 6rem;\n}"; }
};

export { ChipSetInputExample as limel_example_chip_set_input };
