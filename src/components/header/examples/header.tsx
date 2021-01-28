import { Component, h } from '@stencil/core';
import { Action } from '@limetech/lime-elements';

/**
 * How default layout of header works
 * All content of a header by default are placed on a horizontal row.
 * This will always render the headings on the left side, and the actions
 * on the right side.
 *
 * In small containers when having the default layout, the `actions` area
 * wins the battle of limited space! It means, if you have a very wide
 * component in the actions area, it will never shrink in size, and instead
 * forces the headings to truncate.
 *
 * :::tip
 * Users can still hover the cursor on the truncated headings to read the full
 * text.
 * :::
 *
 */

@Component({
    tag: 'limel-example-header',
    shadow: true,
    styleUrl: 'header.scss',
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
                icon="brake_warning"
                heading="Useful information"
                subheading="Oops... data couldn't be loaded!"
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
