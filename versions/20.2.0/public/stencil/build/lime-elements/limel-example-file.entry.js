const h = window.LimeElements.h;

import './chunk-b81c6061.js';
import './chunk-2005b219.js';
import './chunk-21be808b.js';
import './chunk-0566d4fa.js';
import { a as createRandomString } from './chunk-f12b16ef.js';
import './chunk-10e16363.js';
import { a as MDCTextField } from './chunk-16be9a50.js';

class FileExample {
    constructor() {
        this.value = { filename: 'bla.jpg', id: 123 };
        this.required = false;
        this.handleChange = this.handleChange.bind(this);
        this.toggleRequired = this.toggleRequired.bind(this);
    }
    render() {
        return [
            h("limel-switch", { label: "Toggle required", value: this.required, onChange: this.toggleRequired }),
            h("limel-file", { label: "File", value: this.value, required: this.required, onChange: this.handleChange }),
        ];
    }
    handleChange(event) {
        this.value = event.detail;
        console.log('onChange', this.value);
    }
    toggleRequired() {
        this.required = !this.required;
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
const DEFAULT_FILE_CHIP = {
    id: null,
    text: null,
    removable: true,
    icon: 'note',
    iconColor: 'var(--lime-light-grey)',
};
class File {
    constructor() {
        /**
         * Set to `true` to indicate that the field is required.
         * Defaults to `false`
         */
        this.required = false;
        /**
         * True if the input should be disabled
         */
        this.disabled = false;
        this.fileInputId = createRandomString();
        this.handleFileSelection = this.handleFileSelection.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.handleChipSetChange = this.handleChipSetChange.bind(this);
        this.handleFileDrop = this.handleFileDrop.bind(this);
    }
    componentDidLoad() {
        this.fileInput = this.element.shadowRoot.getElementById(this.fileInputId);
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
            ? [
                Object.assign({}, DEFAULT_FILE_CHIP, { text: this.value.filename, id: this.value.id }),
            ]
            : [];
        return [
            h("input", { id: this.fileInputId, type: "file", onChange: this.handleFileChange, hidden: true }),
            h("limel-chip-set", { disabled: this.disabled, label: this.label, required: this.required, type: "input", value: chipArray, onFocus: this.handleFileSelection, onChange: this.handleChipSetChange, onInteract: this.preventAndStop, onDrop: this.handleFileDrop, onDragEnter: this.preventAndStop, onDragOver: this.preventAndStop }),
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
            this.handleFile(this.fileInput.files[0]);
        }
    }
    handleFile(file) {
        const limeFile = {
            id: createRandomString(),
            filename: file.name,
            contentType: file.type,
            size: file.size,
            fileContent: file,
        };
        this.change.emit(limeFile);
        this.chipSet.blur();
        this.mdcTextField.valid = true;
    }
    handleChipSetChange(event) {
        event.stopPropagation();
        const file = !event.detail.length ? event.detail[0] : null;
        this.chipSet.blur();
        if (!file) {
            this.fileInput.value = '';
            this.change.emit(file);
            if (this.required) {
                this.mdcTextField.valid = false;
            }
        }
    }
    handleFileDrop(event) {
        this.preventAndStop(event);
        const dataTransfer = event.dataTransfer;
        this.handleFile(dataTransfer.files[0]);
    }
    preventAndStop(event) {
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
            "attr": "label",
            "reflectToAttr": true
        },
        "required": {
            "type": Boolean,
            "attr": "required",
            "reflectToAttr": true
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
        }]; }
}

export { FileExample as LimelExampleFile, File as LimelFile };
