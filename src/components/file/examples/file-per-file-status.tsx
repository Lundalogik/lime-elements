import { FileInfo } from '@limetech/lime-elements';
import { Component, h, Host, State } from '@stencil/core';

/**
 * File status
 *
 * Set `statusText` on a file's `FileInfo` to show a short status label on the
 * chip as a badge. This is where the file size otherwise would be displayed
 * by default.
 *
 * For example, use `Uploading…` while a file is being uploaded.
 * You can also pair it with `progress` (a determinate bar) or `loading`
 * (an indeterminate spinner): `statusText` says *what* is happening while
 * those visual indicators convey *that* something is.
 *
 * :::note
 * `statusText` is read by assistive technologies as part of the file chip's
 * accessible name, so a screen-reader user hears it when they navigate to the
 * file. Treat it as a passive label, not a spoken alert. The component does
 * not interrupt the user to read it out.
 *
 * If your app needs to announce a change the moment it happens — for example
 * `Upload complete` or `Upload failed` — handle that in your app with your own
 * live region. Only your app knows which transitions are worth interrupting
 * for, and how to phrase them in the user's language.
 * :::
 */
@Component({
    tag: 'limel-example-file-per-file-status',
    shadow: true,
})
export class FilePerFileStatusExample {
    @State()
    private file?: FileInfo = {
        filename: 'annual-report.pdf',
        id: 1,
        size: 2 * 1024 * 1024,
    };

    @State()
    private statusText = 'Uploading…';

    @State()
    private progress = 40;

    public render() {
        const value: FileInfo | undefined = this.file && {
            ...this.file,
            statusText: this.statusText,
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
                    <limel-input-field
                        label="Status text"
                        value={this.statusText}
                        onChange={this.setStatusText}
                    />
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

    private setStatusText = (event: CustomEvent<string>) => {
        event.stopPropagation();
        this.statusText = event.detail;
    };

    private setProgress = (event: CustomEvent<number>) => {
        event.stopPropagation();
        this.progress = event.detail;
    };
}
