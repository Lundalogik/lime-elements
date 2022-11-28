import { Component, h } from '@stencil/core';
/**
 * Basic example
 */
@Component({
    tag: 'limel-example-shortcut',
    shadow: true,
    styleUrl: 'shortcut.scss',
})
export class ShortcutExample {
    public render() {
        const link = {
            href: 'https://www.wikipedia.org/',
            title: 'Open Wikipedia in a new tab.',
            target: '_blank',
        };

        return (
            <limel-shortcut icon="wikipedia" label="Wikipedia" link={link} />
        );
    }
}
