import { Component, h, State } from '@stencil/core';

@Component({
    tag: 'limel-example-input-field-search',
    shadow: true,
    styleUrl: 'input-field.scss',
})
export class InputFieldSearchExample {
    @State()
    private value;

    constructor() {
        this.onChange = this.onChange.bind(this);
    }

    public render() {
        return (
            <limel-input-field
                label="Search"
                type="search"
                leadingIcon="search"
                value={this.value}
                onChange={this.onChange}
            />
        );
    }

    private onChange(event) {
        this.value = event.detail;
    }
}
