import { FileInfo } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

/**
 * See an instant preview
 * Select a file from your local machine using the file picker below,
 * and `limel-file-viewer` component will display the file, if the format
 * is supported.
 */
@Component({
    tag: 'limel-example-file-viewer-with-picker',
    shadow: true,
    styleUrl: 'limel-example-file-viewer-with-picker.scss',
})
export class FileViewerWithPickerExample {
    @State()
    private value: FileInfo;

    @State()
    private dataUrl: string = '';

    constructor() {
        this.handleChange = this.handleChange.bind(this);
    }

    public render() {
        return [
            <limel-file
                label="Choose a file…"
                onChange={this.handleChange}
                value={this.value}
            />,
            <p>and view it below ↓</p>,
            <limel-file-viewer
                url={this.dataUrl}
                type={this.value && this.value.contentType}
            />,
        ];
    }

    private handleChange(event: CustomEvent<FileInfo>) {
        this.value = event.detail;
        if (!this.value) {
            return;
        }

        this.dataUrl =
            (event.detail.fileContent &&
                URL.createObjectURL(event.detail.fileContent)) ||
            '';
    }
}
