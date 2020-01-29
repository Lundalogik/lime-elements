import { Component, h } from '@stencil/core';

@Component({
    tag: 'limel-example-collapsible-section',
    shadow: true,
})
export class CollapsibleSectionExample {
    public render() {
        return (
            <div>
                <limel-collapsible-section header="This text becomes the header">
                    <p>This element becomes the body.</p>
                </limel-collapsible-section>
            </div>
        );
    }
}
