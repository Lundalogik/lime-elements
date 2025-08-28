import {
    Component,
    Host,
    Prop,
    h,
    Event,
    EventEmitter,
    Element,
} from '@stencil/core';
import { getIconName } from '../icon/get-icon-props';
import type { IconSize } from '../icon/icon.types';
import { createRandomString } from '../../util/random-string';
import { ListItem } from './list-item.types';
import { MenuItem } from '../menu/menu.types';
import { ListSeparator } from '../../global/shared-types/separator.types';
import { CheckboxTemplate } from '../checkbox/checkbox.template';
import { RadioButtonTemplate } from '../radio-button-group/radio-button.template';
import translate from '../../global/translations';
import { Languages } from '../date-picker/date.types';

/**
 * This components displays the list item.
 * This centralizes styles and functionality, and helps reduce redundant code
 * in consumer components such as `limel-list` and `limel-menu-list`.
 *
 * :::note
 * The component has `shadow: false`. There are a few reasons for it:
 * 1. This is to improve performance, and ensure that its internal elements are
 * considered as internal parts of the consumer's DOM.
 * 2. The consumer does not need to implement the interactive styles
 * (such as `visualize-keyboard-focus` mixin) on their own. Since there is no
 * shadow DOM, our mixins can be applied directly to the `limel-list-item` elements,
 * within the component's own styles.
 * 3. Most importantly, the MDCList checks the light DOM of each list item
 * to find native inputs to decide the list mode (checkbox/radio).
 * With `shadow: true`, those inputs would be hidden inside the `limel-list-items`’s
 * shadow DOM, so MDC wouldn’t detect them and therefore throw errors, when given
 * an array index (for the items).
 * With `shadow: false`, the native `<input type="checkbox/radio">` from this template
 * would be visible to MDC.
 * :::
 * @exampleComponent limel-example-list-item-basic
 * @exampleComponent limel-example-list-item-icon
 * @exampleComponent limel-example-list-item-icon-size
 * @exampleComponent limel-example-list-item-pictures
 * @exampleComponent limel-example-list-item-multiple-lines
 * @exampleComponent limel-example-list-item-interactive
 * @exampleComponent limel-example-list-item-radio
 * @exampleComponent limel-example-list-item-checkbox
 * @exampleComponent limel-example-list-item-actions
 * @exampleComponent limel-example-list-item-primary-component
 * @exampleComponent limel-example-list-item-command-text
 * @private
 */
@Component({
    tag: 'limel-list-item',
    shadow: false,
    styleUrl: 'list-item.scss',
})
export class ListItemComponent implements ListItem {
    /**
     * Defines the language for translations.
     * Will translate the translatable strings on the components.
     */
    @Prop({ reflect: true })
    public language: Languages = 'en';

    /**
     * {@inheritdoc ListItem.value}
     */
    @Prop()
    public value?: any;

    /**
     * {@inheritdoc ListItem.text}
     */
    @Prop({ reflect: true })
    public text: string;

    /**
     * {@inheritdoc ListItem.secondaryText}
     */
    @Prop({ reflect: true })
    public secondaryText?: string;

    /**
     * {@inheritdoc ListItem.disabled}
     */
    @Prop({ reflect: true })
    public disabled = false;

    /**
     * {@inheritdoc ListItem.icon}
     */
    @Prop()
    public icon?: string | ListItem['icon'];

    /**
     * Size of the icon displayed for this item.
     */
    @Prop({ reflect: true })
    public iconSize: IconSize = 'small';

    /**
     * Set to `true` if the list should display larger icons with a background
     */
    @Prop({ reflect: true })
    public badgeIcon = false;

    /**
     * {@inheritdoc ListItem.selected}
     */
    @Prop({ reflect: true })
    public selected = false;

    /**
     * {@inheritdoc ListItem.selected}
     */
    @Prop()
    public actions?: ListItem['actions'];

    /**
     * {@inheritdoc ListItem.selected}
     */
    @Prop()
    public primaryComponent?: ListItem['primaryComponent'];

    /**
     * {@inheritdoc ListItem.image}
     */
    @Prop()
    public image?: ListItem['image'];

    /**
     * The semantic role of the list item. This affects the ARIA role
     * and the interaction behavior.
     *
     * - 'option' → selectable via click/Enter/Space, aria-selected
     * - 'radio'/'checkbox' → selectable, aria-checked
     * - 'menuitem'/'listitem' → activation only, no selection toggle
     */
    @Prop({ reflect: true })
    public type: 'listitem' | 'menuitem' | 'option' | 'radio' | 'checkbox' =
        'listitem';

    /**
     * Emitted when the list item toggles selection (only for selectable types and not disabled).
     */
    @Event()
    public interact: EventEmitter<{
        selected: boolean;
        item: ListItem;
    }>;

    @Element()
    private host: HTMLLimelListItemElement;

    /**
     * Used to describe the list item for assistive technology.
     */
    private readonly descriptionId: string;

    /**
     * Used to label the list item for assistive technology.
     */
    private readonly labelId: string;

    // Memoized reference for the action items to avoid unnecessary updates
    private memoizedActions?: Array<MenuItem | ListSeparator>;

    constructor() {
        this.labelId = createRandomString();
        this.descriptionId = createRandomString();
    }

    public render() {
        const ariaProps: any = {
            'aria-labelledby': this.labelId,
            'aria-describedby': this.secondaryText
                ? this.descriptionId
                : undefined,
            'aria-disabled': this.disabled ? 'true' : 'false',
        };

        // ARIA state depending on `role`/`type`
        if (this.type === 'radio' || this.type === 'checkbox') {
            ariaProps['aria-checked'] = this.selected ? 'true' : 'false';
        } else if (this.type === 'option' || this.type === 'menuitem') {
            // aria-selected for `option` (spec);
            // also keep for `menuitem` for visual state consistency
            ariaProps['aria-selected'] = this.selected ? 'true' : 'false';
        }

        return (
            <Host
                role={this.getHostRole()}
                class={{
                    'has-primary-component': !!this.primaryComponent?.name,
                }}
                {...ariaProps}
                onClick={this.onClick}
                onKeyDown={this.onKeyDown}
            >
                {this.renderRadioButton()}
                {this.renderCheckbox()}
                {this.renderIcon()}
                {this.renderImage()}
                {this.renderPrimaryComponent()}
                <div class="text">
                    {this.renderLabel()}
                    {this.renderDescription()}
                </div>
                {this.renderActionMenu(this.actions)}
            </Host>
        );
    }

    private renderLabel = () => {
        return (
            <span class="label" id={this.labelId}>
                {this.text}
            </span>
        );
    };

    private renderDescription = () => {
        if (!this.secondaryText) {
            return;
        }

        return (
            <span class="description" id={this.descriptionId}>
                {this.secondaryText}
            </span>
        );
    };

    private renderIcon = () => {
        const iconName = getIconName(this.icon);
        if (!iconName) {
            return;
        }

        let iconColor: string | undefined;
        let iconBackgroundColor: string | undefined;
        let title: string | undefined;

        if (typeof this.icon === 'object') {
            iconColor = this.icon.color;
            iconBackgroundColor = this.icon.backgroundColor;
            title = this.icon.title;
        }

        const iconProps = {
            'aria-label': title,
            'aria-hidden': title ? null : 'true',
            name: iconName,
            style: {
                color: iconColor,
                'background-color': iconBackgroundColor,
            },
            badge: this.badgeIcon,
            size: this.iconSize,
        };

        return <limel-icon {...iconProps} />;
    };

    private renderPrimaryComponent = () => {
        const primary = this.primaryComponent;
        if (!primary?.name) {
            return;
        }

        const PrimaryComponent: any = primary.name;
        const props = primary.props || {};

        return <PrimaryComponent {...props} />;
    };

    private renderImage = () => {
        if (!this.image) {
            return;
        }

        return <img src={this.image.src} alt={this.image.alt} loading="lazy" />;
    };

    private renderActionMenu = (actions: Array<MenuItem | ListSeparator>) => {
        if (!actions || actions.length === 0) {
            return;
        }

        const stableActions = this.getStableActions(actions);
        return (
            <limel-menu
                class="mdc-deprecated-list-item__meta"
                items={stableActions}
                openDirection="left-start"
            >
                <limel-icon-button
                    class="action-menu-trigger"
                    slot="trigger"
                    icon="menu_2"
                    label={this.actionMenuLabel()}
                />
            </limel-menu>
        );
    };

    /**
     * Returns a stable reference for the provided actions array to avoid
     * unnecessary re-renders of the action menu when the reference is unchanged.
     *
     * @param actions The actions (and separators) to display in the menu
     * @returns The same array instance that was previously seen, if unchanged
     */
    private getStableActions(
        actions: Array<MenuItem | ListSeparator>
    ): Array<MenuItem | ListSeparator> {
        if (this.memoizedActions === actions) {
            return this.memoizedActions;
        }
        this.memoizedActions = actions;
        return actions;
    }

    private renderRadioButton = () => {
        if (this.type !== 'radio') {
            return;
        }

        return (
            <RadioButtonTemplate
                id={`radio_${this.labelId}`}
                checked={this.selected}
                disabled={this.disabled}
            />
        );
    };

    private renderCheckbox = () => {
        if (this.type !== 'checkbox') {
            return;
        }

        return (
            <CheckboxTemplate
                id={`checkbox_${this.labelId}`}
                checked={this.selected}
                disabled={this.disabled}
            />
        );
    };

    private onClick = (event: MouseEvent) => {
        if (this.disabled) {
            // Ignore toggling, but don't block embedded controls
            return;
        }

        const target = event.target as HTMLElement | null;
        const cameFromActionTrigger = !!target?.closest('.action-menu-trigger');
        const cameFromNoToggle = !!target?.closest('[data-no-toggle]');
        const cameFromMenu = !!target?.closest('limel-menu');
        if (cameFromActionTrigger || cameFromNoToggle || cameFromMenu) {
            return;
        }

        if (this.isSelectableType()) {
            this.handleInteraction();
        }
        // For non-selectable types (menuitem/listitem), allow native click to bubble
    };

    private onKeyDown = (event: KeyboardEvent) => {
        if (this.disabled) {
            return;
        }

        // Only handle keyboard when the host itself has focus.
        // This avoids toggling when Space/Enter is pressed on inner controls
        // like the action menu trigger or any primary component.
        const shadowRoot = this.host.shadowRoot;
        const activeElement = shadowRoot
            ? (shadowRoot.activeElement as HTMLElement | null)
            : null;
        if (activeElement && activeElement !== this.host) {
            return;
        }

        const isEnter = event.key === 'Enter';
        const isSpace =
            event.key === ' ' ||
            event.key === 'Space' ||
            event.key === 'Spacebar' ||
            event.code === 'Space';

        if (!isEnter && !isSpace) {
            return;
        }

        // Avoid re-triggering while key is held down and auto-repeats
        if (event.repeat) {
            // Also prevent default scroll on Space when repeating
            if (isSpace) {
                event.preventDefault();
            }
            return;
        }

        // Prevent page scroll and default button behavior on Space
        if (isSpace) {
            event.preventDefault();
        }

        if (this.isSelectableType()) {
            this.handleInteraction();
            return;
        }

        // For non-selectable items, treat Enter and Space as activation (simulate click)
        if (isEnter || isSpace) {
            this.host.click();
        }
    };

    private isSelectableType(): boolean {
        return (
            this.type === 'option' ||
            this.type === 'radio' ||
            this.type === 'checkbox'
        );
    }

    private getHostRole(): string {
        switch (this.type) {
            case 'option': {
                return 'option';
            }
            case 'radio': {
                return 'radio';
            }
            case 'checkbox': {
                return 'checkbox';
            }
            case 'menuitem': {
                return 'menuitem';
            }
            default: {
                return 'listitem';
            }
        }
    }

    private handleInteraction = () => {
        const newSelected = !this.selected;

        const item: ListItem = {
            text: this.text,
            secondaryText: this.secondaryText,
            disabled: this.disabled,
            icon: this.icon,
            selected: newSelected,
            value: this.value,
            actions: this.actions,
            primaryComponent: this.primaryComponent,
            image: this.image,
        };

        this.interact.emit({
            selected: newSelected,
            item: item,
        });
    };

    private actionMenuLabel = (): string => {
        return translate.get('file-viewer.more-actions', this.language);
    };
}
