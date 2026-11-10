import { Component, Host, h } from '@stencil/core';

/**
 * Keyboard shortcut
 * When the action of the button has a keyboard shortcut, set it as the
 * `hotkey`. The tooltip shows it, and screen readers read it as a part of
 * the description of the button.
 * :::note
 * The button only shows the shortcut. It does not listen for the keys, so
 * it is up to you to handle them.
 * :::
 */
@Component({
    tag: 'limel-example-navigation-button-hotkey',
    shadow: true,
    styleUrl: 'navigation-button-example.scss',
})
export class NavigationButtonHotkeyExample {
    public render() {
        return (
            <Host>
                <figure>
                    <limel-navigation-button type="close" hotkey="escape" />
                    <figcaption>Button</figcaption>
                </figure>
                <figure>
                    <limel-navigation-button
                        type="close"
                        href="https://lundalogik.github.io/lime-elements/versions/latest/#/"
                        hotkey="escape"
                    />
                    <figcaption>Link</figcaption>
                </figure>
            </Host>
        );
    }
}
