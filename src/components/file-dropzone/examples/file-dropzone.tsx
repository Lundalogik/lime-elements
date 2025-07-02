import { FileInfo } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

/**
 * Basic example
 */
@Component({
    tag: 'limel-example-file-dropzone',
    shadow: true,
    styleUrl: 'file-dropzone.scss',
})
export class FileDropzoneExample {
    @State()
    private disabled = false;

    @State()
    private readonly = false;

    @State()
    private files: FileInfo[] = [];

    public render() {
        return [
            <limel-file-dropzone
                onFilesSelected={this.handleDrop}
                disabled={this.disabled || this.readonly}
                text="Drop your file here"
            >
                <div>
                    <p>This div is a dropzone</p>
                </div>
            </limel-file-dropzone>,
            this.files.map((file) => (
                <limel-chip
                    text={file.filename}
                    icon={file.icon}
                    disabled={this.disabled}
                    readonly={this.readonly}
                />
            )),
            <limel-example-controls>
                <limel-checkbox
                    checked={this.disabled}
                    label="Disabled"
                    onChange={this.setDisabled}
                />
                <limel-checkbox
                    checked={this.readonly}
                    label="Readonly"
                    onChange={this.setReadonly}
                />
            </limel-example-controls>,
            <limel-example-value value={this.files} />,
        ];
    }

    private handleDrop = (event: CustomEvent<FileInfo[]>) => {
        this.files = this.files.concat(event.detail);
    };

    private setDisabled = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.disabled = event.detail;
    };

    private setReadonly = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.readonly = event.detail;
    };
}
