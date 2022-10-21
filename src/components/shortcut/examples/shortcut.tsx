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
        return (
            <limel-shortcut
                icon="wikipedia"
                label="Wikipedia"
                linkTitle="Open Wikipedia's website in a new tab."
                href="https://www.wikipedia.org/"
                target="_blank"
            />
        );
    }
}
