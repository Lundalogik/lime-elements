import { Component, h } from '@stencil/core';

@Component({
    tag: 'limel-example-controls',
    styleUrl: 'example-controls.scss',
})
export class ExampleControls {
    public render() {
        return (
            <limel-flex-container justify="end">
                <slot />
            </limel-flex-container>
        );
    }
}
