import { Component, Host, h } from '@stencil/core';

/**
 * `type="newTab"`
 * Indicates that the content it belongs to will be opened in a new
 * browser tab.
 * :::note
 * When the button has an `href`, this type automatically sets
 * `target="_blank"` on the link, so you do not need to do anything more
 * to open it in a new tab.
 *
 * Without an `href`, the button does not open anything by itself. Prefer
 * the link for this type, so that the browser and screen readers treat it
 * as one.
 * :::
 */
@Component({
    tag: 'limel-example-navigation-button-new-tab',
    shadow: true,
    styleUrl: 'navigation-button-example.scss',
})
export class NavigationButtonNewTabExample {
    public render() {
        return (
            <Host>
                <figure>
                    <limel-navigation-button
                        type="newTab"
                        label="Open in a new browser tab"
                        helperLabel="This button is only an example and doesn't actually do anything"
                    />
                    <figcaption>Button</figcaption>
                </figure>
                <figure>
                    <limel-navigation-button
                        type="newTab"
                        href="https://lundalogik.github.io/lime-elements/versions/latest/#/"
                        label="Open in a new browser tab"
                        helperLabel="Rendered as a link because an href is provided"
                    />
                    <figcaption>Link</figcaption>
                </figure>
            </Host>
        );
    }
}
