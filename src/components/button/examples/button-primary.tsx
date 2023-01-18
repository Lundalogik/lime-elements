import { Component, h } from '@stencil/core';

/**
 * Primary
 *
 * Each screen (modal, or section with action buttons)
 * should contain a single prominent button like this one,
 * to emphasize the primary action.
 *
 * :::note
 * Think twice before setting `primary={true}` on buttons.
 * The arrangement of buttons and their colors should clearly
 * communicate their importance and primariness or secondariness.
 *
 * See some examples at [our design guidelines for
 * Action buttons](#/DesignGuidelines/action-buttons.md/).
 * :::
 */
@Component({
    tag: 'limel-example-button-primary',
    shadow: true,
})
export class ButtonPrimaryExample {
    public render() {
        return <limel-button label="My Button" primary={true} />;
    }
}
