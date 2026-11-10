import { Component, Host, h } from '@stencil/core';

/**
 * `type="back"`
 * Indicates that it will take the user back to a previous
 * screen, place or state.
 */
@Component({
    tag: 'limel-example-navigation-button-back',
    shadow: true,
    styleUrl: 'navigation-button-example.scss',
})
export class NavigationButtonBackExample {
    public render() {
        return (
            <Host>
                <figure>
                    <limel-navigation-button type="back" />
                    <figcaption>Button</figcaption>
                </figure>
                <figure>
                    <limel-navigation-button
                        type="back"
                        href="https://lundalogik.github.io/lime-elements/versions/latest/#/"
                        helperLabel="Rendered as a link because an href is provided"
                    />
                    <figcaption>Link</figcaption>
                </figure>
            </Host>
        );
    }
}
