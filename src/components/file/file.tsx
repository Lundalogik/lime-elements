import translate from '../../global/translations';
import { Chip } from '../chip-set/chip.types';
import { Languages } from '../date-picker/date.types';
import { Component, Event, EventEmitter, h, Prop } from '@stencil/core';
import {
    getFileBackgroundColor,
    getFileColor,
    getFileExtensionTitle,
    getFileIcon,
} from '../../util/file-metadata';
import { FileInfo } from '../../global/shared-types/file.types';

const DEFAULT_FILE_CHIP: Chip = {
    id: null,
    text: null,
    removable: true,
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
 * :::important
 * you need to use a descriptive `label` that clarifies the
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
 * :::
 *
 * @exampleComponent limel-example-file
 * @exampleComponent limel-example-file-custom-icon
 * @exampleComponent limel-example-file-accepted-types
 * @exampleComponent limel-example-file-composite
 */
@Component({
    tag: 'limel-file',
    shadow: true,
    styleUrl: 'file.scss',
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
    @Prop({ reflect: true })
    public label: string;

    /**
     * Set to `true` to indicate that the field is required.
     */
    @Prop({ reflect: true })
    public required: boolean = false;

    /**
     * True if the input should be disabled
     */
    @Prop({ reflect: true })
    public disabled: boolean = false;

    /**
     * Set to `true` to disable adding and removing files, but allow interaction
     * with any already existing file.
     */
    @Prop({ reflect: true })
    public readonly: boolean = false;

    /**
     * Set to `true` to indicate that the current value of the chosen file is
     * invalid.
     */
    @Prop({ reflect: true })
    public invalid = false;

    /**
     * The [accepted file types](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#unique_file_type_specifiers)
     */
    @Prop({ reflect: true })
    public accept: string = '*';

    /**
     * Defines the localisation for translations.
     */
    @Prop()
    public language: Languages = 'en';

    /**
     * Dispatched when a file is selected/deselected
     */
    @Event()
    private change: EventEmitter<FileInfo>;

    /**
     * Dispatched when clicking on a chip
     */
    @Event()
    private interact: EventEmitter<number | string>;

    public render() {
        return [
            <limel-file-dropzone
                disabled={this.disabled || this.readonly || !!this.value}
                accept={this.accept}
                onFilesSelected={this.handleNewFiles}
            >
                {this.renderChipset()}
            </limel-file-dropzone>,
            this.renderDragAndDropTip(),
        ];
    }

    private renderDragAndDropTip() {
        if (this.value || this.disabled || this.readonly) {
            return;
        }

        return (
            <div class="drag-and-drop-tip">
                <span class="invisible-label-mock" role="presentation">
                    {this.label}
                </span>
                <span class="tip">{this.dropZoneTip()}</span>
            </div>
        );
    }

    private dropZoneTip = (): string => {
        return this.getTranslation('file.drag-and-drop-tips');
    };

    private handleNewFiles = (event: CustomEvent<FileInfo[]>) => {
        this.preventAndStop(event);
        this.change.emit(event.detail[0]);
    };

    private getChipArray(): Chip[] {
        if (!this.value) {
            return [];
        }

        return [
            {
                ...DEFAULT_FILE_CHIP,
                text: this.value.filename,
                id: this.value.id,
                icon: {
                    name: getFileIcon(this.value),
                    title: getFileExtensionTitle(this.value),
                    color: getFileColor(this.value),
                    backgroundColor: getFileBackgroundColor(this.value),
                },
                href: this.value.href,
            },
        ];
    }

    private renderChipset() {
        const chipset = (
            <limel-chip-set
                disabled={this.disabled}
                readonly={this.readonly}
                invalid={this.invalid}
                label={this.label}
                leadingIcon="upload_to_cloud"
                language={this.language}
                onChange={this.handleChipSetChange}
                onInteract={this.handleChipInteract}
                required={this.required}
                type="input"
                value={this.getChipArray()}
            />
        );

        if (this.value) {
            return chipset;
        }

        return (
            <limel-file-input
                accept={this.accept}
                disabled={this.disabled || this.readonly}
            >
                {chipset}
            </limel-file-input>
        );
    }

    private handleChipSetChange = (event: CustomEvent) => {
        event.stopPropagation();
        const file = !event.detail.length ? event.detail[0] : null;
        if (!file) {
            this.change.emit(file);
        }
    };

    private handleChipInteract = (event: CustomEvent<Chip>) => {
        this.preventAndStop(event);
        this.interact.emit(event.detail.id);
    };

    private preventAndStop(event: Event) {
        event.stopPropagation();
        event.preventDefault();
    }

    private getTranslation(key: string) {
        return translate.get(key, this.language);
    }
}
