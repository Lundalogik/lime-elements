import { Component, h } from '@stencil/core';

/**
 * This component is only used in our documentations
 * to provide a container for settings of examples.
 *
 * For example, it visually groups and organizes checkboxes
 * used to show different states of components,
 * such as Disabled, Required, Readonly, etc…
 *
 * @private
 */
@Component({
    tag: 'limel-example-controls',
    shadow: true,
    styleUrl: 'example-controls.scss',
})
export class ExampleControls {
    public render() {
        return <slot />;
    }
}
