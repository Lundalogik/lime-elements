import { Component, h } from '@stencil/core';

/**
 * Colors
 * Icons will inherit their colors form the `color` property of the parent element.
 * For styling the background color, you can use the CSS variable
 * `--icon-background-color`.
 *:::note
 * Note that `badge` is set to `true` to provide more space around the icon,
 * and make sure the background color is nicely displayed.
 * But the `bade` has effect, only when the `size` attribute is also set.
 *:::
 */
@Component({
    tag: 'limel-example-icon-color',
    shadow: true,
    styleUrl: 'icon-color.scss',
})
export class IconColorExample {
    public render() {
        return [
            <limel-icon
                badge={true}
                class="company"
                name="organization"
                size="large"
            />,
            <limel-icon
                badge={true}
                class="person"
                name="user_group_man_man"
                size="large"
            />,
            <limel-icon badge={true} class="deal" name="money" size="large" />,
            <limel-icon
                badge={true}
                class="todo"
                name="todo_list"
                size="large"
            />,
            <limel-icon
                badge={true}
                class="campaign"
                name="megaphone"
                size="large"
            />,
        ];
    }
}
