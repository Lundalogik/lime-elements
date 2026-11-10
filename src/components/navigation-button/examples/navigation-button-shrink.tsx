import { Component, Host, h } from '@stencil/core';

/**
 * `type="shrink"`
 * Indicates that the content it belongs to can be shown in a smaller view.
 * Can be used to indicate that fullscreen mode can be exited, that a main
 * view can be made into a side panel, or that a larger side panel can be
 * made into a smaller one.
 */
@Component({
    tag: 'limel-example-navigation-button-shrink',
    shadow: true,
    styleUrl: 'navigation-button-example.scss',
})
export class NavigationButtonShrinkExample {
    public render() {
        return (
            <Host>
                <figure>
                    <limel-navigation-button
                        type="shrink"
                        label="Exit fullscreen mode"
                    />
                    <figcaption>Button</figcaption>
                </figure>
                <figure>
                    <limel-navigation-button
                        type="shrink"
                        href="https://lundalogik.github.io/lime-elements/versions/latest/#/"
                        label="Exit fullscreen mode"
                        helperLabel="Rendered as a link because an href is provided"
                    />
                    <figcaption>Link</figcaption>
                </figure>
            </Host>
        );
    }
}
