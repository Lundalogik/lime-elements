import { Component, h, State } from '@stencil/core';
import { ActionBarItem, ListSeparator } from '@limetech/lime-elements';
/**
 * Card with actions
 * An array of actions can be provided to the card, to allow the user to interact with the content.
 *
 * :::note
 * Even though cards allow displaying multiple actions,
 * use this possibility sparingly, and remember that these UI elements are
 * meant to be entry points to other contexts,
 * in which detailed information is displayed, and more complex actions
 * are possible to do.
 * :::
 */

@Component({
    shadow: true,
    tag: 'limel-example-card-actions',
    styleUrl: 'card-basic.scss',
})
export class CardActionsExample {
    @State()
    private actions: Array<ActionBarItem | ListSeparator> = [
        {
            text: 'Learn more',
        },
        {
            text: 'Get tickets',
            icon: {
                name: 'two_tickets',
                color: 'rgb(var(--color-blue-default))',
            },
        },
    ];

    public render() {
        const image = {
            src: 'https://images.unsplash.com/photo-1515017804404-92b19fdfe6ac?q=80&w=2525&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            alt: 'A bird-eye view picture of a tennis court with a net in the middle.',
        };

        return (
            <limel-card
                image={image}
                heading="Tennis Tournament Announcement!"
                subheading="Get ready to showcase your skills or cheer for your favorites! 🏆"
                value="Join us for the Grand Slam Challenge, happening 12 of March, 2025 at Vikingahallen, Lund."
                actions={this.actions}
                onActionSelected={this.handleSelected}
            />
        );
    }

    private handleSelected = (event: CustomEvent<ActionBarItem>) => {
        event.stopPropagation();
        console.log(event.detail);
    };
}
