import { FileInfo } from '@limetech/lime-elements';
import { Component, h, Host, State } from '@stencil/core';

/**
 * File progress
 *
 * Set `progress` on the file (its `FileInfo`) to a number between `0` and
 * `100` to render a determinate progress bar on that file's chip. Use it for
 * measurable work, such as uploading the file or resizing it on the client.
 *
 * `progress` is for measurable work; for indeterminate work, set `loading` on
 * the file instead — see the per-file loading example. A file typically shows
 * `loading` while it is queued or finalized, and `progress` while the bytes
 * transfer.
 *
 * :::note
 * `progress` is rendered on the file's chip, so it only has an effect while a
 * file is selected.
 * :::
 */
@Component({
    tag: 'limel-example-file-progress',
    shadow: true,
})
export class FileProgressExample {
    @State()
    private file?: FileInfo = {
        filename: 'annual-report.pdf',
        id: 1,
    };

    @State()
    private progress = 0;

    public render() {
        const value: FileInfo | undefined = this.file && {
            ...this.file,
            progress: this.progress,
        };

        return (
            <Host>
                <limel-file
                    label="Attach a file"
                    value={value}
                    onChange={this.handleChange}
                />
                <limel-example-controls
                    style={{
                        '--example-controls-column-layout': 'auto-fit',
                    }}
                >
                    <limel-slider
                        label="Progress"
                        value={this.progress}
                        valuemin={0}
                        valuemax={100}
                        unit="%"
                        onChange={this.setProgress}
                    />
                </limel-example-controls>
            </Host>
        );
    }

    private handleChange = (event: CustomEvent<FileInfo>) => {
        this.file = event.detail;
    };

    private setProgress = (event: CustomEvent<number>) => {
        event.stopPropagation();
        this.progress = event.detail;
    };
}
