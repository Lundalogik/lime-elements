import { Component, Host, h } from '@stencil/core';

/**
 * `type="maximize"`
 * Indicates that it will maximize the current pane.
 */
@Component({
    tag: 'limel-example-navigation-button-maximize',
    shadow: true,
    styleUrl: 'navigation-button-example.scss',
})
export class NavigationButtonMaximizeExample {
    public render() {
        return (
            <Host>
                <figure>
                    <limel-navigation-button type="maximize" />
                    <figcaption>Button</figcaption>
                </figure>
                <figure>
                    <limel-navigation-button
                        type="maximize"
                        href="https://lundalogik.github.io/lime-elements/versions/latest/#/"
                        helperLabel="Rendered as a link because an href is provided"
                    />
                    <figcaption>Link</figcaption>
                </figure>
            </Host>
        );
    }
}
