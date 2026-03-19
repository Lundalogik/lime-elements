import { Component, h } from '@stencil/core';

/**
 * With `helperLabel`
 *
 * You can use the `helperLabel` prop to display additional
 * helper text in the tooltip, for example a keyboard shortcut.
 */
@Component({
    tag: 'limel-example-icon-button-helper-label',
    shadow: true,
})
export class IconButtonHelperLabelExample {
    public render() {
        return (
            <limel-icon-button
                label="Add favourite"
                helperLabel="alt + F"
                icon="heart_outlined"
            />
        );
    }
}
