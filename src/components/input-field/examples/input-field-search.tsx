import { Component, h, State } from '@stencil/core';

/**
 * Input Field of Type Search
 */
@Component({
    tag: 'limel-example-input-field-search',
    shadow: true,
})
export class InputFieldSearchExample {
    @State()
    private value;

    public render() {
        return (
            <limel-input-field
                label="Search"
                type="search"
                leadingIcon="search"
                value={this.value}
                onChange={this.handleChange}
            />
        );
    }

    private handleChange = (event) => {
        this.value = event.detail;
    };
}
