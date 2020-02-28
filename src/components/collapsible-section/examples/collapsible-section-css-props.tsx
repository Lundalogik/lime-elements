import { Component, h } from '@stencil/core';

@Component({
    tag: 'limel-example-collapsible-section-css-props',
    shadow: true,
    styleUrl: 'collapsible-section.scss',
})
export class CollapsibleSectionCssPropsExample {
    public render() {
        return (
            <limel-collapsible-section header="Outer">
                <p>Lorem ipsum.</p>
                <limel-collapsible-section header="Inner">
                    <p>Dolor sit amet.</p>
                </limel-collapsible-section>
            </limel-collapsible-section>
        );
    }
}
