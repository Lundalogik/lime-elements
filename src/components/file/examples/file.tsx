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
        this.toggleRequired = this.toggleRequired.bind(this);
    }

    public render() {
        return [
            <limel-file
                label="Attach a file"
                value={this.value}
                required={this.required}
                onChange={this.handleChange}
            />,
            <limel-flex-container justify="end">
                <limel-switch
                    label="Toggle required"
                    value={this.required}
                    onChange={this.toggleRequired}
                />
            </limel-flex-container>,
        ];
    }

    private handleChange(event) {
        this.value = event.detail;
        console.log('onChange', this.value);
    }

    private toggleRequired() {
        this.required = !this.required;
    }
}
