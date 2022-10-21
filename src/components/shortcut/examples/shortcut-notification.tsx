import { Component, h } from '@stencil/core';
/**
 * Displaying a notification badge
 *
 * The component can display a notification badge, which could either be
 * a `number` or a `string`. Read more about how the badge truncates
 * or abbreviates the provided label [here](#/component/limel-badge/).
 *
 */
@Component({
    tag: 'limel-example-shortcut-notification',
    shadow: true,
    styleUrl: 'shortcut-notification.scss',
})
export class ShortcutNotificationExample {
    private label1: number = 9951;
    private label2: string = 'NEW';
    private label3: string = '';

    public render() {
        return [
            <limel-shortcut
                icon="visual_studio"
                label="Visual Studio Code"
                badge={this.label1}
            />,
            <limel-shortcut
                icon="skype_copyrighted"
                label="Skype"
                badge={this.label2}
            />,
            <limel-shortcut icon="slack" label="Slack" badge={this.label3} />,
        ];
    }
}
