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
    private value: FileInfo = { filename: 'picture.jpg', id: 123 };

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
            <limel-flex-container justify="end">
                <limel-switch
                    label="Required"
                    value={this.required}
                    onChange={this.handleRequiredChange}
                />
                <limel-switch
                    label="Disabled"
                    value={this.disabled}
                    onChange={this.handleDisabledChange}
                />
                <limel-switch
                    label="Readonly"
                    value={this.readonly}
                    onChange={this.handleReadonlyChange}
                />
            </limel-flex-container>,
        ];
    }

    private handleChange = (event: CustomEvent<FileInfo>) => {
        this.value = event.detail;
        console.log('onChange', this.value);
    };

    private handleRequiredChange = (event: CustomEvent<boolean>) => {
        this.required = !!event.detail;
    };

    private handleDisabledChange = (event: CustomEvent<boolean>) => {
        this.disabled = !!event.detail;
    };

    private handleReadonlyChange = (event: CustomEvent<boolean>) => {
        this.readonly = !!event.detail;
    };
}
