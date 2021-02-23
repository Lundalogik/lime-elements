import { FileInfo } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

/**
 * Some text
 */
@Component({
    tag: 'limel-example-file-viewer-with-picker',
    shadow: true,
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
                label="Attach a file"
                onChange={this.handleChange}
                value={this.value}
            />,
            <limel-file-viewer
                url={this.dataUrl}
                alt="Something descriptive"
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
