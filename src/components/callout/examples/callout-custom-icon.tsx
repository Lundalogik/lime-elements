import { Component, h } from '@stencil/core';

/**
 * With custom `icon`
 *
 * By default, the icon will be defined by the `type` qualifier.
 * However, it is possible to use a `type` just to get the desired visualisation
 * (color and heading), but override the default icon, using the `icon` prop.
 */
@Component({
    tag: 'limel-example-callout-custom-icon',
    shadow: true,
})
export class CalloutCustomIconExample {
    public render() {
        return (
            <limel-callout icon="pokemon">
                <span slot="content">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Nulla et euismod nulla. Curabitur feugiat, tortor non
                    consequat finibus, justo purus auctor massa, nec semper
                    lorem quam in massa.
                </span>
            </limel-callout>
        );
    }
}
