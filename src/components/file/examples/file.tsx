import { FileInfo } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

/**
 * Basic example
 */
@Component({
    tag: 'limel-example-file',
    shadow: true,
})
export class FileExample {
    @State()
    private value: FileInfo = { filename: 'letter.docx', id: 123 };

    @State()
    private required = false;

    @State()
    private disabled = false;

    @State()
    private readonly = false;

    public render() {
        return [
            <limel-file
                label="Attach a file"
                onChange={this.handleChange}
                required={this.required}
                value={this.value}
                disabled={this.disabled}
                readonly={this.readonly}
            />,
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
                <limel-checkbox
                    checked={this.required}
                    label="Required"
                    onChange={this.setRequired}
                />
            </limel-example-controls>,
            <limel-example-value value={this.value} />,
        ];
    }

    private handleChange = (event: CustomEvent<FileInfo>) => {
        this.value = event.detail;
        console.log('onChange', this.value);
    };

    private setRequired = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.required = !!event.detail;
    };

    private setDisabled = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.disabled = !!event.detail;
    };

    private setReadonly = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.readonly = !!event.detail;
    };
}
