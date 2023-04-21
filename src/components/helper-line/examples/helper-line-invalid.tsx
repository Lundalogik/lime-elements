import { Component, h } from '@stencil/core';

/**
 * Invalid example
 */
@Component({
    tag: 'limel-example-helper-line-invalid',
    shadow: true,
})
export class HelperLineInvalidExample {
    public render() {
        return (
            <limel-helper-line
                helperText="This field is required!"
                length={0}
                maxLength={20}
                helperTextId="tf-helper-text"
                invalid={true}
            />
        );
    }
}
