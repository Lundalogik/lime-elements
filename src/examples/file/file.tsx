import { Component, h, State } from '@stencil/core';
import { FileInfo } from '../../components/file/file.types';

@Component({
    tag: 'limel-example-file',
    shadow: true,
})
export class FileExample {
    @State()
    private value: FileInfo = { filename: 'bla.jpg', id: 123 };

    @State()
    private required = false;

    constructor() {
        this.handleChange = this.handleChange.bind(this);
        this.toggleRequired = this.toggleRequired.bind(this);
    }

    public render() {
        return [
            <limel-switch
                label="Toggle required"
                value={this.required}
                onChange={this.toggleRequired}
            />,
            <limel-file
                label="File"
                value={this.value}
                required={this.required}
                onChange={this.handleChange}
            />,
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
