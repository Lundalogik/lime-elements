import { Component, Host, h } from '@stencil/core';

/**
 * `type="expand"`
 * Typically used when content is shown in a floating panel, or in a side
 * panel of limited size, next to or above a main view. The button then
 * indicates that it will open that content as the main view.
 * :::note
 * This type should not be used if the button opens a new browser tab or
 * window. If so, use the `newTab` type instead.
 * :::
 */
@Component({
    tag: 'limel-example-navigation-button-expand',
    shadow: true,
    styleUrl: 'navigation-button-example.scss',
})
export class NavigationButtonExpandExample {
    public render() {
        return (
            <Host>
                <figure>
                    <limel-navigation-button
                        type="expand"
                        label="Go to fullscreen"
                    />
                    <figcaption>Button</figcaption>
                </figure>
                <figure>
                    <limel-navigation-button
                        type="expand"
                        href="https://lundalogik.github.io/lime-elements/versions/latest/#/"
                        label="Go to fullscreen"
                        helperLabel="Rendered as a link because an href is provided"
                    />
                    <figcaption>Link</figcaption>
                </figure>
            </Host>
        );
    }
}
