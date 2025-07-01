import {
    Component,
    h,
    Event,
    EventEmitter,
    Host,
    Prop,
    State,
} from '@stencil/core';
import { FileInfo } from '../../global/shared-types/file.types';
import { createFileInfo, isTypeAccepted } from '../../util/files';
import { partition } from 'lodash-es';

/**
 * This component enables you to seamlessly convert any region of the user interface into
 * a file dropzone area, just by wrapping it inside the `limel-file-dropzone`.
 *
 * The file dropzone can then be used to allow end-users to upload files
 * by dragging and dropping them into the specified area, for example to trigger an upload process.
 *
 * After receiving the files, the component emits a `filesSelected` event. For unsupported
 * files (specified with the `accept` prop) a `filesRejected` event will be emitted.
 *
 * The event detail would be an array of `FileInfo` objects,
 * each representing a file dropped into the dropzone.
 *
 * @exampleComponent limel-example-file-dropzone
 * @exampleComponent limel-example-file-dropzone-type-filtering
 * @private
 */
@Component({
    tag: 'limel-file-dropzone',
    shadow: true,
    styleUrl: 'file-dropzone.scss',
})
export class FileDropzone {
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
     * Set to `true` to disable the file dropzone.
     */
    @Prop()
    public disabled: boolean = false;

    /**
     * Is displayed when the user is dragging a file over the dropzone.
     * A suitable text could for instance be "Drop your files here".
     */
    @Prop()
    public text: string;

    /**
     * Is displayed to provide supplementary information to the end users,
     * for instance, which filetypes or file sizes are accepted.
     */
    @Prop()
    public helperText?: string = '';

    /**
     * Sets to true when there is a file to drop
     */
    @State()
    private hasFileToDrop: boolean = false;

    /**
     * Emitted when files are selected
     */
    @Event()
    filesSelected: EventEmitter<FileInfo[]>;

    /**
     * Emitted when files are selected but do not conform with the `accept` property specifications.
     * This can happen when the file types or formats of the selected files are not among the ones allowed by the dropzone,
     * as defined by the `accept` property.
     *
     * @see `accept` for details on how to specify acceptable file types.
     */
    @Event()
    filesRejected: EventEmitter<FileInfo[]>;

    public render() {
        return (
            <Host
                onDrop={this.handleDrop}
                onDragOver={this.handleDragOver}
                onDragLeave={this.handleDragLeave}
            >
                <slot />
                {this.renderOnDragLayout()}
            </Host>
        );
    }

    private renderOnDragLayout = () => {
        if (this.disabled || !this.hasFileToDrop) {
            return;
        }

        return (
            <div class="has-file-to-drop">
                <limel-icon class="icon" name="upload_2" />
                <div class="text-helpertext">
                    {this.renderText()}
                    {this.renderHelperText()}
                </div>
            </div>
        );
    };

    private renderText = () => {
        if (!this.text) {
            return;
        }

        return <span class="text">{this.text}</span>;
    };

    private renderHelperText = () => {
        if (!this.helperText) {
            return;
        }

        return <span class="helper-text">{this.helperText}</span>;
    };

    private handleDrop = (event: DragEvent) => {
        event.stopPropagation();
        event.preventDefault();
        this.hasFileToDrop = false;

        if (this.disabled) {
            return;
        }

        const files: File[] = [...event.dataTransfer.files];
        const fileInfos: FileInfo[] = files.map(createFileInfo);

        const [acceptedFileInfos, rejectedFileInfos] = partition(
            fileInfos,
            (file) => isTypeAccepted(file, this.accept)
        );

        if (acceptedFileInfos.length > 0) {
            this.filesSelected.emit(acceptedFileInfos);
        }

        if (rejectedFileInfos.length > 0) {
            this.filesRejected.emit(rejectedFileInfos);
        }
    };

    private handleDragOver = (event: DragEvent) => {
        this.hasFileToDrop = true;
        event.preventDefault();
    };

    private handleDragLeave = (event: DragEvent) => {
        this.hasFileToDrop = false;
        event.preventDefault();
    };
}
