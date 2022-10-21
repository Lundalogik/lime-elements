import { Component, h } from '@stencil/core';
/**
 * How to style the shortcut
 *
 * The component offers different CSS variables for styling
 * the color of the shortcut, and it's icon; as well as
 * radius of it's rounded corners, and colors of the notification badge
 * and its text.
 */
@Component({
    tag: 'limel-example-shortcut-styling',
    shadow: true,
    styleUrl: 'shortcut-styling.scss',
})
export class ShortcutStylingExample {
    private label1: number = 9951;
    private label2: string = '⚠️';

    public render() {
        return [
            <limel-shortcut icon="visual_studio" label="Visual Studio Code" />,
            <limel-shortcut
                icon="skype_copyrighted"
                label="Skype"
                badge={this.label1}
            />,
            <limel-shortcut icon="slack" label="Slack" badge={this.label2} />,
        ];
    }
}
