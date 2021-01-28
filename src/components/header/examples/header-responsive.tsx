import { Component, h } from '@stencil/core';
import { Action } from '@limetech/lime-elements';
/**
 * How Responsive layout of header works
 * However, sometimes you may need to make the layout be responsive and split
 * into two rows, at a break point.
 *
 * To activate this responsive layout, you can simply add the `has-responsive-layout`
 * class to your `limel-header` component.
 *
 * This makes a few changes in the layout. Firstly, both the left side (icon and
 * headings) and right side (actions slot) will occupy 50% of the total header
 * width each. However, the width of left and right side will never become smaller
 * than `22rem`.
 *
 * :::tip
 * The value of `22rem` is the default breakpoint. But you can easily change it
 * by tweaking the `--header-responsive-breakpoint` variable in your component.
 * :::
 *
 */

@Component({
    tag: 'limel-example-header-responsive',
    shadow: true,
    styleUrl: 'header-responsive.scss',
})
export class HeaderExample {
    private actions = [
        {
            id: '1',
            icon: 'refresh',
            label: 'Refresh',
        },
        {
            id: '2',
            icon: 'delete',
            label: 'Delete',
            disabled: true,
        },
        {
            id: '3',
            icon: 'edit',
            label: 'Edit',
        },
    ];

    constructor() {
        this.renderActionButton = this.renderActionButton.bind(this);
    }

    public render() {
        return (
            <limel-header
                class="has-responsive-layout"
                icon="resize_horizontal"
                heading="This header is responsive"
                subheading="Resize the container of this header to see how it works"
            >
                {this.renderActions()}
            </limel-header>
        );
    }

    private renderActions() {
        if (!this.actions) {
            return;
        }

        return (
            <div class="actions">
                {this.actions.map(this.renderActionButton)}
            </div>
        );
    }

    private renderActionButton(action: Action) {
        return (
            <limel-icon-button
                icon={action.icon}
                label={action.label}
                disabled={action.disabled}
                onClick={this.handleActionClick(action)}
            />
        );
    }

    private handleActionClick = (action: Action) => (event: MouseEvent) => {
        event.stopPropagation();
        console.log(action);
    };
}
