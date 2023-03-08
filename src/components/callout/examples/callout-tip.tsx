import { Component, h } from '@stencil/core';

/**
 * Type: `tip`
 *
 * This type is useful for displaying tips & tricks, and How-Tos.
 */
@Component({
    tag: 'limel-example-callout-tip',
    shadow: true,
})
export class CalloutTipExample {
    public render() {
        return <limel-callout type="tip">You want to read this.</limel-callout>;
    }
}
