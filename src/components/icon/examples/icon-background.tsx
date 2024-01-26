import { Component, h } from '@stencil/core';

/**
 * Example with colors
 *:::note
 * Note that `badge` is set to `true` to provide more space around the icon,
 * and make sure the background color is nicely displayed.
 *:::
 */
@Component({
    tag: 'limel-example-icon-background',
    shadow: true,
    styleUrl: 'icon-background.scss',
})
export class IconBackgroundExample {
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
