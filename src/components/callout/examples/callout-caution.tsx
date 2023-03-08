import { Component, h } from '@stencil/core';

/**
 * Type: `caution`
 */
@Component({
    tag: 'limel-example-callout-caution',
    shadow: true,
})
export class CalloutCautionExample {
    public render() {
        return (
            <limel-callout type="caution">I hope you read this.</limel-callout>
        );
    }
}
