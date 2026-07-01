import { FileInfo } from '@limetech/lime-elements';
import { Component, h, Host, State } from '@stencil/core';

/**
 * File invalid
 *
 * Set `invalid` on a file's `FileInfo` to mark that specific file as invalid,
 * rendering its chip in an error state — for example a file that failed to
 * upload or is of a disallowed type.
 * :::note
 * This is independent of the component-level `invalid` prop, which marks the
 * whole field as invalid. Marking a file invalid does not by itself make the
 * field invalid — the consumer decides whether it should.
 * :::
 *
 * :::tip
 * When a file is invalid, explain what is wrong with a `helperText`. In this
 * example, toggling the file invalid also marks the field invalid, so the
 * helper text is rendered as an error message describing the reason.
 * :::
 *
 */
@Component({
    tag: 'limel-example-file-invalid',
    shadow: true,
})
export class FileInvalidExample {
    @State()
    private file?: FileInfo = {
        filename: 'annual-report.pdf',
        id: 1,
    };

    @State()
    private invalid = true;

    public render() {
        const value: FileInfo | undefined = this.file && {
            ...this.file,
            invalid: this.invalid,
        };
        const helperText = this.invalid
            ? 'This file exceeds the maximum allowed size of 10 MB.'
            : undefined;

        return (
            <Host>
                <limel-file
                    label="Attach a file"
                    value={value}
                    invalid={this.invalid}
                    helperText={helperText}
                    onChange={this.handleChange}
                />
                <limel-example-controls
                    style={{
                        '--example-controls-column-layout': 'auto-fit',
                    }}
                >
                    <limel-switch
                        label="File invalid"
                        value={this.invalid}
                        onChange={this.setInvalid}
                    />
                </limel-example-controls>
            </Host>
        );
    }

    private handleChange = (event: CustomEvent<FileInfo>) => {
        this.file = event.detail;
    };

    private setInvalid = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.invalid = event.detail;
    };
}
