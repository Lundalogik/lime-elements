import { FileInfo } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

@Component({
    tag: 'limel-example-file-accepted-types',
    shadow: true,
})
export class FileAcceptedTypesExample {
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
                label="Attach only images (png, jpeg)"
                onChange={this.handleChange}
                required={this.required}
                value={this.value}
                accept="image/jpeg,image/png"
            />,
        ];
    }

    private handleChange(event: CustomEvent<FileInfo>) {
        this.value = event.detail;
        console.log('onChange', this.value);
    }

    private toggleRequired() {
        this.required = !this.required;
    }
}
