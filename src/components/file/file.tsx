import { Chip, FileInfo } from '@limetech/lime-elements';
import { MDCTextField } from '@limetech/mdc-textfield';
import {
    Component,
    Element,
    Event,
    EventEmitter,
    h,
    Prop,
} from '@stencil/core';
import { createRandomString } from '../../util/random-string';

const CHIP_SET_TAG_NAME = 'limel-chip-set';
const DEFAULT_FILE_CHIP: Chip = {
    id: null,
    text: null,
    removable: true,
    icon: 'note',
    iconColor: 'var(--lime-light-grey)',
};

/**
 * This component lets end-users select a *single* file from their device
 * storage. Regardless of the user's device or operating system, this component
 * opens up a file picker dialog that allows the user to choose a file.
 *
 * ## Using correct labels
 *
 * This file picker can be used in different contexts. The component's distinct
 * visual design including the upload icon hints end-users that this is not a
 * normal input field like other fields in the form for example.
 *
 * However, you need to use a descriptive `label` that clarifies the
 * functionality of the file picker, and/or provides users with clear
 * instructions.
 *
 * Depending on the context, you may need to avoid labels such as:
 * - File
 * - Document
 *
 * and instead consider using labels like:
 * - Attach a file
 * - Upload a file
 * - Choose a document
 * - Choose a file
 *
 * and similar phrases...
 *
 * @exampleComponent limel-example-file
 */
@Component({
    tag: 'limel-file',
    shadow: true,
})
export class File {
    /**
     * The selected file.
     */
    @Prop()
    public value: FileInfo;

    /**
     * The input label.
     */
    @Prop({ reflectToAttr: true })
    public label: string;

    /**
     * Set to `true` to indicate that the field is required.
     * Defaults to `false`
     */
    @Prop({ reflectToAttr: true })
    public required: boolean = false;

    /**
     * True if the input should be disabled
     */
    @Prop({ reflectToAttr: true })
    public disabled: boolean = false;

    /**
     * Dispatched when a file is selected/deselected
     */
    @Event()
    private change: EventEmitter<FileInfo>;

    @Element()
    private element: HTMLLimelFileElement;

    private fileInput: HTMLInputElement;
    private fileInputId = createRandomString();
    private chipSet;
    private mdcTextField;

    constructor() {
        this.handleFileSelection = this.handleFileSelection.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.handleChipSetChange = this.handleChipSetChange.bind(this);
        this.handleFileDrop = this.handleFileDrop.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
    }

    public componentDidLoad() {
        this.fileInput = this.element.shadowRoot.getElementById(
            this.fileInputId
        ) as HTMLInputElement;
        this.chipSet = this.element.shadowRoot.querySelector(CHIP_SET_TAG_NAME);
        this.mdcTextField = new MDCTextField(
            this.chipSet.shadowRoot.querySelector('.mdc-text-field')
        );
    }

    // eslint-disable-next-line @stencil/own-methods-must-be-private
    public componentDidUnload() {
        if (this.mdcTextField) {
            this.mdcTextField.destroy();
        }
    }

    public render() {
        const chipArray = this.value
            ? [
                  {
                      ...DEFAULT_FILE_CHIP,
                      text: this.value.filename,
                      id: this.value.id,
                  },
              ]
            : [];

        return [
            <input
                id={this.fileInputId}
                type="file"
                onChange={this.handleFileChange}
                hidden={true}
            />,
            <limel-chip-set
                disabled={this.disabled}
                label={this.label}
                required={this.required}
                onKeyDown={this.handleKeyDown}
                onKeyUp={this.handleKeyUp}
                type="input"
                value={chipArray}
                onClick={this.handleFileSelection}
                onChange={this.handleChipSetChange}
                onInteract={this.preventAndStop}
                onDrop={this.handleFileDrop}
                onDragEnter={this.preventAndStop}
                onDragOver={this.preventAndStop}
                leadingIcon="upload_to_cloud"
            />,
        ];
    }

    private handleKeyDown(event: KeyboardEvent) {
        if (
            event.code === 'Tab' ||
            event.code === 'Backspace' ||
            event.code === 'Enter'
        ) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();
    }

    private handleKeyUp(event: KeyboardEvent) {
        if (event.code === 'Enter' && !this.value) {
            this.fileInput.click();
        }
    }

    private handleFileSelection(event: Event) {
        event.stopPropagation();
        event.preventDefault();
        if (!this.value) {
            this.fileInput.click();
        }
    }

    private handleFileChange(event: Event) {
        if (this.fileInput.files.length > 0) {
            event.stopPropagation();
            this.handleFile(this.fileInput.files[0]);
        }
    }

    private handleFile(file) {
        const limeFile: FileInfo = {
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

    private handleChipSetChange(event: CustomEvent) {
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

    private handleFileDrop(event: DragEvent) {
        this.preventAndStop(event);
        const dataTransfer = event.dataTransfer;
        this.handleFile(dataTransfer.files[0]);
    }

    private preventAndStop(event: Event) {
        event.stopPropagation();
        event.preventDefault();
    }
}
