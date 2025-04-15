import { Action } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

/**
 * Header actions
 * An array of actions can be given to the component.
 * The actions will be rendered as icon buttons inside the Header.
 * They can allow for additional functionality like edit, delete, etc.
 *
 * :::important
 * The actions should be about the entire section or group of content,
 * and affect it as a whole. This is due to how they are displayed along
 * with the header of the group.
 * :::
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
        label: 'No action clicked',
    };

    private actions = [
        {
            id: '1',
            label: 'Delete',
            icon: 'trash',
        },
        {
            id: '2',
            label: 'Update',
            icon: 'available_updates',
            disabled: true,
        },
        {
            id: '3',
            label: 'More',
            icon: 'menu_2',
        },
    ];

    public render() {
        return (
            <limel-collapsible-section
                header="This section has actions"
                actions={this.actions}
                onAction={this.handleAction}
            >
                <p>Last clicked action:</p>
                <ul>
                    <li>
                        ID: <code>{this.action.id}</code>
                    </li>
                    <li>
                        Label: <code>{this.action.label}</code>
                    </li>
                    <li>
                        Icon: <code>{this.action.icon}</code>
                        <limel-icon name={this.action.icon} size="x-small" />
                    </li>
                </ul>
            </limel-collapsible-section>
        );
    }

    private handleAction = (event: CustomEvent<Action>) => {
        this.action = event.detail;
    };
}
