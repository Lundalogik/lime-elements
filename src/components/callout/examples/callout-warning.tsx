import { Component, h } from '@stencil/core';

/**
 * Type: `warning`
 */
@Component({
    tag: 'limel-example-callout-warning',
    shadow: true,
})
export class CalloutWarningExample {
    public render() {
        return (
            <limel-callout type="warning">You need to read this.</limel-callout>
        );
    }
}
