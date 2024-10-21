import { Component, h, State } from '@stencil/core';
import {
    ActionBarItem,
    ListSeparator,
    MenuItem,
} from '@limetech/lime-elements';

/**
 * With primary action button
 */
@Component({
    tag: 'limel-example-text-editor-action-bar-primary-action-button',
    shadow: true,
    styleUrl: 'text-editor-action-bar-basic.scss',
})
export class TextEditorPrimaryActionButtonExample {
    @State()
    private disabled: boolean = false;

    @State()
    private selectedSecondaryAction: MenuItem | null = null;

    private toolbarActions: Array<ActionBarItem | ListSeparator> = [
        {
            text: 'Formatting options',
            icon: 'text_color',
            iconOnly: true,
        },
        {
            text: 'Attach file',
            icon: 'attach',
            iconOnly: true,
        },
        {
            text: 'Insert signature',
            icon: 'signature',
            iconOnly: true,
        },
    ];

    private secondaryActions: Array<ListSeparator | MenuItem> = [
        { text: 'Send later today', secondaryText: 'at 16:45' },
        { text: 'Send tomorrow morning', secondaryText: 'at 08:00' },
        { separator: true },
        { text: 'Custom time', icon: 'calendar' },
    ];

    public render() {
        return [
            <div>
                <limel-text-editor-action-bar
                    primaryActionLabel="Send"
                    secondaryActions={this.secondaryActions}
                    primaryActionDisabled={this.disabled}
                    toolbarActions={this.toolbarActions}
                    onPrimaryActionClick={this.handlePrimaryActionClick}
                    onSecondaryActionItemSelect={
                        this.handleSecondaryActionItemSelect
                    }
                />
            </div>,
            <limel-example-value value={this.selectedSecondaryAction} />,
            <limel-example-controls>
                <limel-checkbox
                    checked={this.disabled}
                    label="Primary Action Button Disabled"
                    onChange={this.setDisabled}
                />
            </limel-example-controls>,
        ];
    }

    private setDisabled = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.disabled = event.detail;
    };

    private handlePrimaryActionClick = () => {
        alert('Primary action clicked');
    };

    private handleSecondaryActionItemSelect = (
        event: CustomEvent<MenuItem>,
    ) => {
        event.stopPropagation();
        this.selectedSecondaryAction = event.detail;
    };
}
