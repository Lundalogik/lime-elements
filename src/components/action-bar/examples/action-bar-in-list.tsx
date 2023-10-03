import { Component, h, State } from '@stencil/core';
import { ActionBarItem, ListSeparator } from '@limetech/lime-elements';

@Component({
    tag: 'limel-example-action-bar-in-list',
    shadow: true,
    styleUrl: 'action-bar-in-list.scss',
})
export class ActionBarInListExample {
    @State()
    private actionBarItems: Array<ActionBarItem | ListSeparator> = [
        {
            text: 'Mark as Done',
            icon: 'checkmark',
            iconColor: 'rgb(var(--color-sky-default))',
            iconOnly: true,
        },
        {
            text: 'Postpone',
            icon: 'future',
            iconOnly: true,
        },
        { separator: true },
        {
            text: 'Email',
            icon: 'email_sign_92447',
            iconOnly: true,
        },
        {
            text: 'Call',
            icon: 'phone',
            iconColor: 'rgb(var(--color-green-default))',
            iconOnly: true,
        },
    ];

    public render() {
        return (
            <limel-action-bar
                accessibleLabel="Action bar"
                actions={this.actionBarItems}
                open-openDirection="left-start"
            />
        );
    }
}
