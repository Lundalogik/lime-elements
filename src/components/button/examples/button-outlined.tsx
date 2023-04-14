import { Component, h } from '@stencil/core';

/**
 * Outlined
 *
 * By setting `outlined={true}`, you can create a style
 * of buttons which could be used to indicate an action
 * with medium emphasis.
 *
 * :::note
 * This style is useful to indicate the "secondariness" of an action.
 * Therefore, only use this style, if there is another related
 * `primary` button present on the same view or screen,
 * along with another normal button.
 *
 * Also, give such a choice a second thought by reading
 * [our guidelines for Split button](#/component/limel-split-button/).
 * :::
 */
@Component({
    tag: 'limel-example-button-outlined',
    shadow: true,
})
export class ButtonOutlinedExample {
    public render() {
        return <limel-button label="My Button" outlined={true} />;
    }
}
