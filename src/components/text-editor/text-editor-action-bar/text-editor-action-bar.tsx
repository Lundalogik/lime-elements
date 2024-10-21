import { Component, h, Prop, Event, EventEmitter } from '@stencil/core';
import translate from '../../../global/translations';
import { Languages } from '../../date-picker/date.types';
import { ListSeparator } from '../../list/list-item.types';
import { MenuItem } from '../../menu/menu.types';
import { ActionBarItem } from '../../action-bar/action-bar.types';

/**
 * This private & internal component renders a secondary action bar, intended to be used
 * together with `limel-text-editor` component.
 *
 * This component is responsible for:
 * 1. Visualizing the built-in actions that our text editor natively supports, such as
 * typing an ﹫ to mention a user, or typing a # to create a tag.
 * 1. Visualizing custom actions that a consumer wants to add to the text editor.
 * 1. Visualizing a split button that performs a primary action (such as `Send`),
 * and an optional array secondary actions (such as _Schedule send_, _Send & close ticket_, etc).
 *
 * @exampleComponent limel-example-text-editor-action-bar-basic
 * @exampleComponent limel-example-text-editor-action-bar-primary-action-button
 * @exampleComponent limel-example-text-editor-action-bar-custom-component
 *
 * @beta
 * @Private
 */
@Component({
    tag: 'limel-text-editor-action-bar',
    shadow: true,
    styleUrl: 'text-editor-action-bar.scss',
})
export class TextEditorSecondaryActionBar {
    /**
     * Defines the language for translations.
     * Will translate the translatable strings on the components.
     */
    @Prop({ reflect: true })
    public language: Languages = 'en';

    /**
     * The text to show on the split button.
     * It is the primary action of the split button.
     */
    @Prop({ reflect: true })
    public primaryActionLabel?: string;

    /**
     * The text to show as a tooltip on the split button.
     * Suitable for UIs where space is limited, or having a
     * visible label is not desired.
     */
    @Prop({ reflect: true })
    public primaryActionTooltip?: string;

    /**
     * Optional icon for the split button.
     * Should depict the primary action, which is usually
     * sending, adding or posting the content.
     */
    @Prop({ reflect: true })
    public primaryActionIcon: string = 'send_plane_tilted';

    /**
     * Defines whether the primary action button is disabled or not.
     */
    @Prop({ reflect: true })
    public primaryActionDisabled: boolean = false;

    /**
     * A list of items and separators to show
     * for in the split button's menu.
     */
    @Prop()
    public secondaryActions?: Array<MenuItem | ListSeparator> = [];

    /**
     * Items that are placed in the action bar.
     */
    @Prop()
    public toolbarActions: Array<ActionBarItem | ListSeparator> = [];

    /**
     * Event emitted when the split button is clicked.
     */
    @Event()
    public primaryActionClick: EventEmitter<void>;

    /**
     * Event emitted when a menu item inside the split button is selected.
     */
    @Event()
    public secondaryActionItemSelect: EventEmitter<MenuItem>;

    /**
     * Event emitted when an action bar item is selected.
     */
    @Event()
    public toolbarItemSelect: EventEmitter<ActionBarItem>;

    public render() {
        return [
            this.renderLimelActionBar(),
            this.renderLimelSplitButton(),
            this.renderSplitButtonTooltip(),
        ];
    }

    private renderLimelActionBar() {
        return (
            <limel-action-bar
                accessibleLabel={translate.get(
                    'secondary-action-bar',
                    this.language,
                )}
                actions={this.toolbarActions}
                onItemSelected={this.handleActionBarItemSelect}
            />
        );
    }

    private renderLimelSplitButton() {
        if (!this.primaryActionLabel && !this.primaryActionTooltip) {
            return;
        }

        return (
            <limel-split-button
                id="limel-text-editor-primary-action-button"
                primary={true}
                disabled={this.primaryActionDisabled}
                label={this.primaryActionLabel}
                icon={this.primaryActionIcon}
                items={this.secondaryActions}
                onClick={this.handleSplitButtonClick}
                onSelect={this.handleSplitButtonItemSelect}
            />
        );
    }

    private renderSplitButtonTooltip() {
        if (!this.primaryActionTooltip) {
            return;
        }

        return (
            <limel-tooltip
                elementId="limel-text-editor-primary-action-button"
                label={this.primaryActionTooltip}
            />
        );
    }

    private handleActionBarItemSelect = (event: CustomEvent<ActionBarItem>) => {
        event.stopPropagation();
        const setSelection = (item: ActionBarItem) => {
            return {
                ...item,
                selected: item.text === event.detail.text,
            };
        };

        this.toolbarActions = this.toolbarActions.map(setSelection);
        this.toolbarItemSelect.emit(event.detail);
    };

    private handleSplitButtonClick = (event: MouseEvent) => {
        event.stopPropagation();
        this.primaryActionClick.emit();
    };

    private handleSplitButtonItemSelect = (event: CustomEvent<MenuItem>) => {
        event.stopPropagation();
        const setSelection = (item: MenuItem) => {
            return {
                ...item,
                selected: item.text === event.detail.text,
            };
        };

        this.secondaryActions = this.secondaryActions.map(setSelection);
        this.secondaryActionItemSelect.emit(event.detail);
    };
}
