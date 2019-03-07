const h = window.LimeElements.h;

import './chunk-ae7a155e.js';
import './chunk-5fe01cc9.js';
import { a as MDCTextField } from './chunk-8b1be62e.js';
import './chunk-7357609a.js';

class FileExample {
    constructor() {
        this.value = { id: 'bla', text: 'bla.jpg' };
        this.required = false;
    }
    render() {
        return [
            h("limel-switch", { label: "Toggle required", value: this.required, onChange: () => {
                    this.required = !this.required;
                } }),
            h("limel-file", { label: "File", value: this.value, required: this.required, onChange: this.handleChange.bind(this), onInteract: event => {
                    console.log('onInteract', event.detail);
                } }),
        ];
    }
    handleChange(event) {
        console.log('onChange', event.detail);
        this.value = event.detail;
    }
    static get is() { return "limel-example-file"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "required": {
            "state": true
        },
        "value": {
            "state": true
        }
    }; }
}

const CHIP_SET_TAG_NAME = 'limel-chip-set';
const FILE_INPUT_ID = 'fileInput';
const DEFAULT_FILE_CHIP = {
    id: null,
    text: null,
    removable: true,
    icon: 'note',
    iconColor: 'var(--lime-light-grey)',
};
class File {
    constructor() {
        this.required = false;
        /**
         * True if the input should be disabled
         */
        this.disabled = false;
        this.handleFileSelection = this.handleFileSelection.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.handleChipSetChange = this.handleChipSetChange.bind(this);
        this.handleChipSetInteract = this.handleChipSetInteract.bind(this);
        this.handleFileDrop = this.handleFileDrop.bind(this);
    }
    componentDidLoad() {
        this.fileInput = this.element.shadowRoot.getElementById(FILE_INPUT_ID);
        this.chipSet = this.element.shadowRoot.querySelector(CHIP_SET_TAG_NAME);
        this.mdcTextField = new MDCTextField(this.chipSet.shadowRoot.querySelector('.mdc-text-field'));
    }
    componentDidUnload() {
        if (this.mdcTextField) {
            this.mdcTextField.destroy();
        }
    }
    render() {
        const chipArray = this.value
            ? [Object.assign({}, DEFAULT_FILE_CHIP, this.value)]
            : [];
        return [
            h("input", { id: FILE_INPUT_ID, type: "file", onChange: this.handleFileChange, hidden: true }),
            h("limel-chip-set", { disabled: this.disabled, label: this.label, required: this.required, type: "input", value: chipArray, onFocus: this.handleFileSelection, onChange: this.handleChipSetChange, onDrop: this.handleFileDrop, onDragEnter: this.preventDefault, onDragOver: this.preventDefault }),
        ];
    }
    handleFileSelection(event) {
        event.stopPropagation();
        if (!this.value) {
            this.fileInput.click();
        }
    }
    handleFileChange(event) {
        if (this.fileInput.files.length > 0) {
            event.stopPropagation();
            this.handleFile(this.fileInput.files[0].name);
        }
    }
    handleFile(fileName) {
        const chip = Object.assign({}, DEFAULT_FILE_CHIP, { id: fileName, text: fileName });
        this.change.emit(chip);
        this.chipSet.blur();
        this.mdcTextField.valid = true;
    }
    handleChipSetChange(event) {
        event.stopPropagation();
        const chip = !event.detail.length ? event.detail[0] : null;
        this.change.emit(chip);
        this.chipSet.blur();
        if (!chip && this.required) {
            this.mdcTextField.valid = false;
        }
    }
    handleChipSetInteract(event) {
        event.stopPropagation();
        this.interact.emit(event.detail);
    }
    handleFileDrop(event) {
        this.preventDefault(event);
        const dataTransfer = event.dataTransfer;
        this.handleFile(dataTransfer.files[0].name);
    }
    preventDefault(event) {
        event.stopPropagation();
        event.preventDefault();
    }
    static get is() { return "limel-file"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "disabled": {
            "type": Boolean,
            "attr": "disabled",
            "reflectToAttr": true
        },
        "element": {
            "elementRef": true
        },
        "label": {
            "type": String,
            "attr": "label"
        },
        "required": {
            "type": Boolean,
            "attr": "required"
        },
        "value": {
            "type": "Any",
            "attr": "value"
        }
    }; }
    static get events() { return [{
            "name": "change",
            "method": "change",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "interact",
            "method": "interact",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
}

export { FileExample as LimelExampleFile, File as LimelFile };
