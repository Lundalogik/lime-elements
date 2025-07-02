import { FileInfo } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

/**
 * File type filtering
 * The component allows you to specify the types of files that the dropzone will accept.
 * By default, it accepts all file types (`*`).
 *
 * For media files, it is possible to specify any format, using:
 * `audio/*`, `video/*`, `image/*`.
 *
 * Additionally, you can use unique file type specifiers, such as:
 * `.jpg`, or `.pdf`; or use a comma-separated list of file extensions or MIME types,
 * for instance: `image/png, image/jpeg` or `.png, .jpg, .jpeg`.
 *
 * Read more about
 * [HTML attribute: accept](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/accept)
 */
@Component({
    tag: 'limel-example-file-dropzone-type-filtering',
    shadow: true,
    styleUrl: 'file-dropzone-type-filtering.scss',
})
export class FileDropzoneTypeFilteringExample {
    @State()
    private files: FileInfo[] = [];

    @State()
    private required = false;

    @State()
    private disabled = false;

    @State()
    private readonly = false;

    @State()
    private value: string;

    @State()
    private rejectedFiles: FileInfo[] = [];

    public render() {
        const MAX_LENGTH = 500;

        return [
            <limel-file-dropzone
                onFilesSelected={this.handleAcceptedFiles}
                onFilesRejected={this.handleRejectedFiles}
                accept="image/*"
                text="Drop pictures here"
            >
                <limel-input-field
                    label="Dream pet description"
                    type="textarea"
                    placeholder="What is your dream pet? Describe it here and attach a picture of it."
                    helperText="To attach files, simply drag & drop them here!"
                    maxlength={MAX_LENGTH}
                    value={this.value}
                    required={this.required}
                    onChange={this.handleChange}
                    disabled={this.disabled}
                    readonly={this.readonly}
                />
            </limel-file-dropzone>,
            <limel-file-dropzone
                onFilesSelected={this.handleAcceptedFiles}
                onFilesRejected={this.handleRejectedFiles}
                text="Drop video or pictures here"
                helperText="Only image and video files are accepted!"
                accept="image/*, video/*"
            >
                <div>
                    <p>Upload a picture or a video</p>
                </div>
            </limel-file-dropzone>,
            this.files.map((file) => (
                <limel-chip text={file.filename} icon={file.icon} />
            )),
            <limel-example-value value={this.files} />,
            <limel-example-value value={this.rejectedFiles} />,
        ];
    }

    private handleChange = (event: CustomEvent<string>) => {
        this.value = event.detail;
    };

    private handleAcceptedFiles = (event: CustomEvent<FileInfo[]>) => {
        this.files = this.files.concat(event.detail);
    };

    private handleRejectedFiles = (event: CustomEvent<FileInfo[]>) => {
        this.rejectedFiles = this.rejectedFiles.concat(event.detail);
    };
}
