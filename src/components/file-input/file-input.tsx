import {
    h,
    Event,
    EventEmitter,
    Host,
    Component,
    Element,
    Prop,
} from '@stencil/core';
import { createRandomString } from '../../util/random-string';
import { FileInfo } from '../../global/shared-types/file.types';
import { createFileInfo } from '../../util/files';

/**
 * This component enables you to seamlessly transform any other clickable component that
 * generates a `click` event into a file input selector.
 *
 * To use it, just wrap any clickable component inside the `limel-file-input` component.
 * Upon reception of the `click` event this component will open the native file selection
 * dialog.
 *
 * After receiving the files, the component emits a `filesSelected` event.
 *
 * The event detail would be an array of `FileInfo` objects,
 * each representing a file dropped into the dropzone.
 *
 * @exampleComponent limel-example-file-input
 * @exampleComponent limel-example-file-input-type-filtering
 * @private
 */
@Component({
    tag: 'limel-file-input',
    shadow: true,
})
export class FileInput {
    /**
     * Specifies the types of files that the dropzone will accept. By default, all file types are accepted.
     *
     * For media files, formats can be specified using: `audio/*`, `video/*`, `image/*`.
     * Unique file type specifiers can also be used, for example: `.jpg`, `.pdf`.
     * A comma-separated list of file extensions or MIME types is also acceptable, e.g., `image/png, image/jpeg` or
     * `.png, .jpg, .jpeg`.
     *
     * @see [HTML attribute: accept](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/accept) for more
     * details.
     */
    @Prop({ reflect: true })
    public accept: string = '*';

    /**
     * Set to `true` to disable file input selection.
     */
    @Prop({ reflect: true })
    public disabled: boolean = false;

    /**
     * Set to `true` to enable selection of multiple files
     */
    @Prop({ reflect: true })
    public multiple: boolean = false;

    /**
     * Emitted when files are selected
     */
    @Event()
    filesSelected: EventEmitter<FileInfo[]>;

    @Element()
    private element: HTMLLimelFileElement;

    private fileInput: HTMLInputElement;
    private fileInputId = createRandomString();

    public componentDidLoad() {
        // eslint-disable-next-line unicorn/prefer-query-selector
        this.fileInput = this.element.shadowRoot.getElementById(
            this.fileInputId
        ) as HTMLInputElement;
    }

    public render() {
        return (
            <Host
                onClick={this.handleClick}
                onKeyUp={this.handleKeyUp}
                onKeyDown={this.handleKeyDown}
            >
                <input
                    hidden={true}
                    id={this.fileInputId}
                    onChange={this.handleFileChange}
                    type="file"
                    accept={this.accept}
                    disabled={this.disabled}
                    multiple={this.multiple}
                />
                <slot />
            </Host>
        );
    }

    private handleClick = (event: Event) => {
        if (this.disabled) {
            event.stopPropagation();
            event.preventDefault();

            return;
        }

        this.triggerFileDialog();

        event.stopPropagation();
    };

    private handleKeyUp = (event: KeyboardEvent) => {
        event.stopPropagation();
        event.preventDefault();

        if (event.code === 'Enter') {
            this.triggerFileDialog();
        }
    };

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

    private triggerFileDialog() {
        this.fileInput.click();
    }

    private handleFileChange = (event: Event) => {
        const files = [...this.fileInput.files];
        if (files.length > 0) {
            event.stopPropagation();
            this.filesSelected.emit(files.map(createFileInfo));
            this.fileInput.value = '';
        }
    };
}
