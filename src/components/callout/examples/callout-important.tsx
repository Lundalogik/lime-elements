import { Component, h } from '@stencil/core';

/**
 * Type: `important`
 */
@Component({
    tag: 'limel-example-callout-important',
    shadow: true,
})
export class CalloutImportantExample {
    public render() {
        return (
            <limel-callout type="important">
                You should read this.
            </limel-callout>
        );
    }
}
