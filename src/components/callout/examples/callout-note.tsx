import { Component, h } from '@stencil/core';

/**
 * Type: `note`
 *
 * This is the default type.
 */
@Component({
    tag: 'limel-example-callout-note',
    shadow: true,
})
export class CalloutNoteExample {
    public render() {
        return (
            <limel-callout type="note">
                You might read this, you might not.
            </limel-callout>
        );
    }
}
