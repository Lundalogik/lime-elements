import { Component, h, State } from '@stencil/core';

/**
 * Prefix
 * An input Field with a currency symbol text displayed as prefix
 */
@Component({
    tag: 'limel-example-input-field-prefix',
    shadow: true,
})
export class InputFieldPrefixExample {
    @State()
    private value = '10000';

    public render() {
        return (
            <limel-input-field
                label="Price per unit"
                prefix="$"
                value={this.value}
                type="number"
                onChange={this.handleChange}
            />
        );
    }

    private handleChange = (event: CustomEvent<string | number>) => {
        this.value = event.detail + '';
    };
}
