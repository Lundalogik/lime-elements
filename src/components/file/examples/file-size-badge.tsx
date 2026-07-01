import { FileInfo } from '@limetech/lime-elements';
import { Component, h, Host, State } from '@stencil/core';

/**
 * File size badge
 * When the size of the selected file is known, `limel-file` displays it as a
 * badge on the chip, giving end-users a quick sense of how large the file is.
 *
 * The size is picked up automatically when a user chooses a file from their
 * device. When a file is provided programmatically, for example when loaded
 * from a server, the badge is only shown if the `size` property (in bytes) is
 * set on the `FileInfo` object. Toggle the switch below to see the difference.
 */
@Component({
    tag: 'limel-example-file-size-badge',
    shadow: true,
})
export class FileSizeBadgeExample {
    @State()
    private includeSize = true;

    @State()
    private value: FileInfo = {
        filename: 'annual-report.pdf',
        id: 123,
        size: 2_411_724,
    };

    public render() {
        const value = this.getValue();

        return (
            <Host>
                <limel-file
                    label="Attach a file"
                    onChange={this.handleChange}
                    value={value}
                />
                <limel-example-controls
                    style={{
                        '--example-controls-column-layout': 'auto-fit',
                    }}
                >
                    <limel-switch
                        value={this.includeSize}
                        label="Include file size"
                        onChange={this.setIncludeSize}
                    />
                </limel-example-controls>
                <limel-example-value value={value} />
            </Host>
        );
    }

    private getValue(): FileInfo {
        if (!this.value || this.includeSize) {
            return this.value;
        }

        const value = { ...this.value };
        delete value.size;

        return value;
    }

    private handleChange = (event: CustomEvent<FileInfo>) => {
        this.value = event.detail;
        console.log('onChange', this.value);
    };

    private setIncludeSize = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.includeSize = event.detail;
    };
}
