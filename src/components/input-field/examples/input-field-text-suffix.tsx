import { Component, h, State } from '@stencil/core';

/**
 * Suffix
 * An Input Field with a unit of measurement displayed as suffix
 */
@Component({
    tag: 'limel-example-input-field-suffix',
    shadow: true,
})
export class InputFieldSuffixExample {
    @State()
    private value = '50';

    public render() {
        return (
            <limel-input-field
                label="Quantity"
                suffix="pcs"
                value={this.value}
                type="number"
                onChange={this.handleChange}
            />
        );
    }

    private handleChange = (event: CustomEvent<string>) => {
        this.value = event.detail;
    };
}
