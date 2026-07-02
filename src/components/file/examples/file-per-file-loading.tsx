import { FileInfo } from '@limetech/lime-elements';
import { Component, h, Host, State } from '@stencil/core';

/**
 * File loading
 *
 * A file can carry its own busy state via `loading` on its `FileInfo`, which
 * renders an indeterminate indicator on that file's chip — for example while
 * that specific file is being processed.
 *
 * Because a busy file means the component has work in progress, setting a
 * file's `loading` also automatically puts the parent component into a
 * temporary loading state, informing both users and assistive tech about
 * the status.
 */
@Component({
    tag: 'limel-example-file-per-file-loading',
    shadow: true,
})
export class FilePerFileLoadingExample {
    @State()
    private file?: FileInfo = {
        filename: 'annual-report.pdf',
        id: 1,
    };

    @State()
    private loading = false;

    public render() {
        const value: FileInfo | undefined = this.file && {
            ...this.file,
            loading: this.loading,
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
                    <limel-switch
                        label="File loading"
                        value={this.loading}
                        onChange={this.setLoading}
                    />
                </limel-example-controls>
            </Host>
        );
    }

    private handleChange = (event: CustomEvent<FileInfo>) => {
        this.file = event.detail;
    };

    private setLoading = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.loading = event.detail;
    };
}
