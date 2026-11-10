import { Component, Host, h } from '@stencil/core';

/**
 * `type="minimize"`
 * Indicates that it will minimize the current pane.
 */
@Component({
    tag: 'limel-example-navigation-button-minimize',
    shadow: true,
    styleUrl: 'navigation-button-example.scss',
})
export class NavigationButtonMinimizeExample {
    public render() {
        return (
            <Host>
                <figure>
                    <limel-navigation-button type="minimize" />
                    <figcaption>Button</figcaption>
                </figure>
                <figure>
                    <limel-navigation-button
                        type="minimize"
                        href="https://lundalogik.github.io/lime-elements/versions/latest/#/"
                        helperLabel="Rendered as a link because an href is provided"
                    />
                    <figcaption>Link</figcaption>
                </figure>
            </Host>
        );
    }
}
