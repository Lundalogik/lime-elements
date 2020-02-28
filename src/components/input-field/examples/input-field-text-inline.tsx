import { Component, h, State } from '@stencil/core';

@Component({
    tag: 'limel-example-input-field-text-inline',
    shadow: true,
    styleUrl: 'input-field-text-inline.scss',
})
export class InputFieldTextExample {
    @State()
    private firstValue;

    @State()
    private secondValue;

    constructor() {
        this.firstOnChange = this.firstOnChange.bind(this);
        this.secondOnChange = this.secondOnChange.bind(this);
    }

    public render() {
        return (
            <section>
                <limel-input-field
                    label="First Field"
                    helperText="This is a helper text"
                    value={this.firstValue}
                    onChange={this.firstOnChange}
                />
                <limel-input-field
                    label="Second Field"
                    helperText=""
                    value={this.secondValue}
                    onChange={this.secondOnChange}
                />
            </section>
        );
    }

    private firstOnChange(event) {
        this.firstValue = event.detail;
    }

    private secondOnChange(event) {
        this.secondValue = event.detail;
    }
}
