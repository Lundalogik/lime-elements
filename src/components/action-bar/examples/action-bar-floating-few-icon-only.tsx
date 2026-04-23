import { Component, h, State } from '@stencil/core';
import { ActionBarItem, ListSeparator } from '@limetech/lime-elements';

/**
 * Floating action bar with only a few icon-only actions
 *
 * When a `collapsible` action bar contains fewer than 4 icon-only actions,
 * the expand/shrink button is omitted. Icon-only actions already take minimal
 * space, so collapsing them has no visual benefit and the toggle would just
 * add noise.
 *
 * Toggle the switch below to add a 4th icon-only action and watch the
 * expand/shrink button appear.
 *
 */
@Component({
    tag: 'limel-example-action-bar-floating-few-icon-only',
    shadow: true,
    styleUrl: 'action-bar-floating.scss',
})
export class ActionBarFloatingFewIconOnlyExample {
    @State()
    private showFourthAction = false;

    private readonly baseItems: Array<ActionBarItem | ListSeparator> = [
        {
            text: 'Add',
            icon: 'plus_math',
            iconOnly: true,
        },
        {
            text: 'Refresh',
            icon: 'refresh',
            iconOnly: true,
        },
        { separator: true },
        {
            text: 'Assign me',
            commandText: 'Cmd + H',
            icon: 'whole_hand_right',
            iconOnly: true,
        },
    ];

    private readonly fourthAction: ActionBarItem = {
        text: 'Archive',
        icon: 'archive',
        iconOnly: true,
    };

    public render() {
        const actions = this.showFourthAction
            ? [...this.baseItems, this.fourthAction]
            : this.baseItems;

        return [
            <div class="application has-floating-action-bar is-resizable">
                <limel-action-bar
                    accessibleLabel="Contextual Action Bar"
                    actions={actions}
                    openDirection="top"
                    layout="floating"
                    collapsible={true}
                />
            </div>,
            <limel-example-controls>
                <limel-checkbox
                    checked={this.showFourthAction}
                    label="Add a 4th action"
                    onChange={this.setShowFourthAction}
                />
            </limel-example-controls>,
        ];
    }

    private setShowFourthAction = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.showFourthAction = event.detail;
    };
}
