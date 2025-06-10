import { Component, h } from '@stencil/core';

/**
 * Icon
 */
@Component({
    tag: 'limel-example-collapsible-section-icon',
    shadow: true,
})
export class CollapsibleSectionIconExample {
    public render() {
        const icon = {
            name: 'ok',
            title: 'Checkmark icon',
            color: 'rgb(var(--color-green-default))',
        };

        return (
            <limel-collapsible-section header="Header" icon={icon}>
                <p>Body</p>
            </limel-collapsible-section>
        );
    }
}
