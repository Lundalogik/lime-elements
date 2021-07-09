import { Component, h, State } from '@stencil/core';

/**
 * Input Field with Leading and Trailing Icons & Action
 */
@Component({
    tag: 'limel-example-input-field-icon-both',
    shadow: true,
})
export class InputFieldIconBothExample {
    @State()
    private value;

    public render() {
        return (
            <limel-input-field
                label="Website"
                type="url"
                value={this.value}
                leadingIcon="globe"
                trailingIcon="external_link"
                onChange={this.onChange}
                onAction={this.onAction}
            />
        );
    }

    private onChange = (event) => {
        this.value = event.detail;
    };

    private onAction = () => {
        window.open(this.value);
    };
}
