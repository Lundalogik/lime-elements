import { Component, State } from '@stencil/core';
import { Chip } from '../../components/chip-set/chip';

@Component({
    tag: 'limel-example-file',
    shadow: true,
})
export class FileExample {
    @State()
    private value: Chip = { id: 'bla', text: 'bla.jpg' };

    @State()
    private required = false;

    public render() {
        return [
            <limel-switch
                label="Toggle required"
                value={this.required}
                onChange={() => {
                    this.required = !this.required;
                }}
            />,
            <limel-file
                label="File"
                value={this.value}
                required={this.required}
                onChange={this.handleChange.bind(this)}
                onInteract={event => {
                    console.log('onInteract', event.detail);
                }}
            />,
        ];
    }

    private handleChange(event) {
        console.log('onChange', event.detail);
        this.value = event.detail;
    }
}
