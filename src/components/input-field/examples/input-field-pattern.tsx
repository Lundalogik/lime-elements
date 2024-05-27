import { Component, h, State } from '@stencil/core';

/**
 * Input Field with pattern
 */
@Component({
    tag: 'limel-example-input-field-pattern',
    shadow: true,
})
export class InputFieldPatternExample {
    @State()
    private value;

    public render() {
        return (
            <limel-input-field
                label="Personal identity number (YYYYMMDD-XXXX)"
                value={this.value}
                pattern={'[0-9]{8}-[0-9]{4}'}
                onChange={this.handleChange}
            />
        );
    }

    private handleChange = (event) => {
        this.value = event.detail;
    };
}
