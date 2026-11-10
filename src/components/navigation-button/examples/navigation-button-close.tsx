import { Component, Host, h } from '@stencil/core';

/**
 * `type="close"`
 * Indicates that it will close what it belongs to, typically a dialog,
 * popover or panel.
 */
@Component({
    tag: 'limel-example-navigation-button-close',
    shadow: true,
    styleUrl: 'navigation-button-example.scss',
})
export class NavigationButtonCloseExample {
    public render() {
        return (
            <Host>
                <figure>
                    <limel-navigation-button type="close" />
                    <figcaption>Button</figcaption>
                </figure>
                <figure>
                    <limel-navigation-button
                        type="close"
                        href="https://lundalogik.github.io/lime-elements/versions/latest/#/"
                        helperLabel="Rendered as a link because an href is provided"
                    />
                    <figcaption>Link</figcaption>
                </figure>
            </Host>
        );
    }
}
