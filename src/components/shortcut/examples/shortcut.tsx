import { Component, h } from '@stencil/core';
/**
 * Basic example
 *
 * This component acts as a link, and therefore comes with features
 * such as `title` and `target`.
 *
 * The `title` tag of the hyperlink can be used to
 * provide additional information about the link.
 * It improves accessibility both for users with assistive technologies,
 * and sighted users. Hovering and holding the mouse cursor will
 * display a tooltip generated with the specified `title`.
 *
 * What the `target` does is described well in
 * [mdn web docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-target).
 *
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
