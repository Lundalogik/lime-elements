import { Action } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

@Component({
    tag: 'limel-example-collapsible-section-actions',
    shadow: true,
})
export class CollapsibleSectionActionsExample {
    @State()
    private action: Action = {
        id: '0',
        icon: 'test_tube',
    };

    private actions = [
        {
            id: '1',
            icon: 'activity_history',
        },
        {
            id: '2',
            icon: 'fsociety_mask',
            disabled: true,
        },
        {
            id: '3',
            icon: 'sack_of_flour',
        },
    ];

    constructor() {
        this.handleAction = this.handleAction.bind(this);
    }

    public render() {
        return (
            <limel-collapsible-section
                header="This section has actions"
                actions={this.actions}
                onAction={this.handleAction}
            >
                <limel-icon name={this.action.icon} size="large" />
            </limel-collapsible-section>
        );
    }

    private handleAction(event: CustomEvent<Action>) {
        this.action = event.detail;
    }
}
