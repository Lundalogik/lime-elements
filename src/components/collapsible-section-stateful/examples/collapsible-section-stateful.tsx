import { Component, h } from '@stencil/core';

@Component({
    tag: 'limel-example-collapsible-section-stateful',
    shadow: true,
})
export class CollapsibleSectionStatefulExample {
    public render() {
        return (
            <div>
                <limel-collapsible-section-stateful
                    header="Open me!"
                    stateKey="yourKeyShouldBeUnique"
                >
                    <p>
                        This element remembers its open-state across page-loads.
                    </p>
                </limel-collapsible-section-stateful>
            </div>
        );
    }
}
