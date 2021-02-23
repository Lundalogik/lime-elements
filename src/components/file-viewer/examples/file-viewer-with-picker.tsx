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
    styleUrl: 'file-viewer-with-picker.scss',
})
export class FileViewerWithPickerExample {
    @State()
    private value: FileInfo;

    @State()
    private dataUrl: string = '';

    public render() {
        return [
            <limel-file
                label="Choose a file…"
                onChange={this.handleChange}
                value={this.value}
            />,
            <p>and view it below ↓</p>,
            <div class="view-here">{this.renderFileViewer()}</div>,
        ];
    }

    private renderFileViewer() {
        if (!this.dataUrl) {
            return;
        }

        return (
            <limel-file-viewer
                url={this.dataUrl}
                filename={this.value?.filename}
            />
        );
    }

    private handleChange = (event: CustomEvent<FileInfo>) => {
        this.value = event.detail;

        if (!this.value?.fileContent) {
            this.dataUrl = '';

            return;
        }

        URL.revokeObjectURL(this.dataUrl);
        this.dataUrl = URL.createObjectURL(this.value.fileContent);
    };
}
