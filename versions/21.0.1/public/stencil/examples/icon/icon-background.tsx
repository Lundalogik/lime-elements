import { Component } from '@stencil/core';

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
                size="x-small"
            />,
            <limel-icon
                badge={true}
                class="person"
                name="user_group_man_man"
                size="small"
            />,
            <limel-icon badge={true} class="deal" name="money" size="medium" />,
            <limel-icon
                badge={true}
                class="campaign"
                name="megaphone"
                size="large"
            />,
        ];
    }
}
