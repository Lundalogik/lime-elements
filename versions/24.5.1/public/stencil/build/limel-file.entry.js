import { r as registerInstance, d as createEvent, h, c as getElement } from './core-804afdbc.js';
import './tslib.es6-f504def8.js';
import './component-67e7368b.js';
import './index-0dd051fb.js';
import './index-353004cc.js';
import './component-d9fd1f66.js';
import { M as MDCTextField } from './index-103021da.js';
import { c as createRandomString } from './random-string-60cd3186.js';

const CHIP_SET_TAG_NAME = 'limel-chip-set';
const DEFAULT_FILE_CHIP = {
    id: null,
    text: null,
    removable: true,
    icon: 'note',
    iconColor: 'var(--lime-light-grey)',
};
const File = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
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
        this.change = createEvent(this, "change", 7);
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
                Object.assign(Object.assign({}, DEFAULT_FILE_CHIP), { text: this.value.filename, id: this.value.id }),
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
    get element() { return getElement(this); }
};

export { File as limel_file };
