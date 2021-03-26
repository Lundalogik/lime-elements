import { FileInfo } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

@Component({
    tag: 'limel-example-file',
    shadow: true,
})
export class FileExample {
    @State()
    private value: FileInfo = { filename: 'picture.jpg', id: 123 };

    @State()
    private required = false;

    constructor() {
        this.handleChange = this.handleChange.bind(this);
        this.handleRequiredChange = this.handleRequiredChange.bind(this);
    }

    public render() {
        return [
            <limel-file
                label="Attach a file"
                onChange={this.handleChange}
                required={this.required}
                value={this.value}
            />,
            <limel-flex-container justify="end">
                <limel-switch
                    label="Required"
                    value={this.required}
                    onChange={this.handleRequiredChange}
                />
            </limel-flex-container>,
        ];
    }

    private handleChange(event: CustomEvent<FileInfo>) {
        this.value = event.detail;
        console.log('onChange', this.value);
    }

    private handleRequiredChange(event: CustomEvent<boolean>) {
        this.required = !!event.detail;
    }
}
