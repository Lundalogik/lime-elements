import { Component, h } from '@stencil/core';

/**
 * Custom type
 *
 * It is possible to send in a custom type,
 * and provide it with custom, icon, heading and styles
 */
@Component({
    tag: 'limel-example-custom-type',
    shadow: true,
    styleUrl: 'callout-custom-type.scss',
})
export class CalloutCustomTypeExample {
    public render() {
        return [
            <limel-callout
                icon="checked"
                heading="Success"
                type={'success' as any}
            >
                This is a custom type that we call success
            </limel-callout>,
        ];
    }
}
