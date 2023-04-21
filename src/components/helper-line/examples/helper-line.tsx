import { Component, h } from '@stencil/core';

/**
 * Basic example
 */
@Component({
    tag: 'limel-example-helper-line',
    shadow: true,
})
export class HelperLineExample {
    public render() {
        return (
            <limel-helper-line
                helperText="Do not forget to forget things!"
                length={10}
                maxLength={20}
                helperTextId="tf-helper-text"
            />
        );
    }
}
