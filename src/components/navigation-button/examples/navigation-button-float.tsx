import { Component, Host, h } from '@stencil/core';

/**
 * `type="float"`
 * Indicates that it will open the content it belongs to in a
 * floating panel on the side, on top of the current view.
 */
@Component({
    tag: 'limel-example-navigation-button-float',
    shadow: true,
    styleUrl: 'navigation-button-example.scss',
})
export class NavigationButtonFloatExample {
    public render() {
        return (
            <Host>
                <figure>
                    <limel-navigation-button
                        type="float"
                        label="Open in a side panel"
                    />
                    <figcaption>Button</figcaption>
                </figure>
                <figure>
                    <limel-navigation-button
                        type="float"
                        href="https://lundalogik.github.io/lime-elements/versions/latest/#/"
                        label="Open in a side panel"
                        helperLabel="Rendered as a link because an href is provided"
                    />
                    <figcaption>Link</figcaption>
                </figure>
            </Host>
        );
    }
}
