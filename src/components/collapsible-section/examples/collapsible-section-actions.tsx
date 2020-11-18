import { Action } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

/**
 * Example with actions
 */
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
            icon: 'trash',
        },
        {
            id: '2',
            icon: 'available_updates',
            disabled: true,
        },
        {
            id: '3',
            icon: 'menu_2',
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
