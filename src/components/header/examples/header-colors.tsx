import { Component, h } from '@stencil/core';
import { Action } from '@limetech/lime-elements';

/**
 * Colorful header
 * It's up to you to choose colors for the background, text or icon.
 * When you change the default colors pay attention to how they look together.
 * For instance the text is readable and has enough contrast with a background color.
 */

@Component({
    tag: 'limel-example-header-colors',
    shadow: true,
    styleUrl: 'header-colors.scss',
})
export class HeaderExample {
    private actions = [
        {
            id: '1',
            icon: 'multiply',
            label: 'Close',
        },
    ];

    public render() {
        return (
            <limel-header
                icon={{
                    name: 'create_new',
                    color: 'rgb(var(--color-white))',
                }}
                heading="Edit note"
                subheading="Created: 17 Jan 2023"
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

    private renderActionButton = (action: Action) => {
        return (
            <limel-icon-button
                class="action-icon"
                icon={action.icon}
                label={action.label}
                onClick={this.handleActionClick(action)}
            />
        );
    };

    private handleActionClick = (action: Action) => (event: MouseEvent) => {
        event.stopPropagation();
        console.log(action);
    };
}
