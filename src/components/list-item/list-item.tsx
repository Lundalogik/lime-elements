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
import { createRandomString } from '../../util/random-string';
import { ListItem as ListItemType } from '../list/list-item.types';
import { MenuItem } from '../menu/menu.types';
import { ListSeparator } from '../../global/shared-types/separator.types';
import {
    makeEnterClickable,
    removeEnterClickable,
} from '../../util/make-enter-clickable';
import { CheckboxTemplate } from '../checkbox/checkbox.template';
import { RadioButtonTemplate } from '../list/radio-button/radio-button.template';

/**
 * This components displays the list item.
 * This centralizes styles and functionality, and helps reduce redundant code
 * in consumer components such as `limel-list` and `limel-menu-list`.
 * @exampleComponent limel-example-list-item-basic
 * @exampleComponent limel-example-list-item-icon
 * @exampleComponent limel-example-list-item-pictures
 * @exampleComponent limel-example-list-item-multiple-lines
 * @exampleComponent limel-example-list-item-interactive
 * @exampleComponent limel-example-list-item-actions
 * @exampleComponent limel-example-list-item-radio
 * @exampleComponent limel-example-list-item-checkbox
 * @private
 */
@Component({
    tag: 'limel-list-item',
    shadow: { delegatesFocus: true },
    styleUrl: 'list-item.scss',
})
export class ListItem implements ListItemType {
    /** @inheritDoc */
    @Prop()
    public value?: any;

    /** @inheritDoc */
    @Prop({ reflect: true })
    public text: string;

    /** @inheritDoc */
    @Prop({ reflect: true })
    public secondaryText?: string;

    /** @inheritDoc */
    @Prop({ reflect: true })
    public disabled = false;

    /** @inheritDoc */
    @Prop()
    public icon?: string | ListItemType['icon'];

    /**
     * A list item that is selectable can be selected by the user.
     * This is used in lists where the user can select one or more items.
     * Once the item is selected, it will have a visual and accessible
     * indications of being selected.
     */
    @Prop({ reflect: true })
    public selectable = false;

    /** @inheritDoc */
    @Prop({ reflect: true })
    public selected = false;

    /** @inheritDoc */
    @Prop()
    public actions?: ListItemType['actions'];

    /** @inheritDoc */
    @Prop()
    public primaryComponent?: ListItemType['primaryComponent'];

    /** @inheritDoc */
    @Prop()
    public image?: ListItemType['image'];

    /**
     * The semantic role of the list item. This affects the ARIA role
     * and potentially the rendering behavior.
     */
    @Prop()
    public type: 'listitem' | 'menuitem' | 'option' | 'radio' | 'checkbox' =
        'listitem';

    /**
     * Emitted when the list item is clicked (only if selectable and not disabled).
     */
    @Event()
    public interact: EventEmitter<{ selected: boolean; item: ListItemType }>;

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

    constructor() {
        this.labelId = createRandomString();
        this.descriptionId = createRandomString();
    }

    public componentWillLoad() {
        makeEnterClickable(this.host);
    }

    public disconnectedCallback() {
        removeEnterClickable(this.host);
    }

    public render() {
        return (
            <Host
                role={this.type}
                aria-labelledby={this.labelId}
                aria-describedby={
                    this.secondaryText ? this.descriptionId : undefined
                }
                aria-disabled={this.disabled ? 'true' : 'false'}
                aria-selected={this.selected ? 'true' : 'false'}
                onClick={this.filterClickWhenDisabled}
            >
                {this.renderRadioButton()}
                {this.renderCheckbox()}
                {this.renderIcon()}
                {this.renderImage()}
                <div class="text">
                    {this.renderLabel()}
                    {this.renderDescription()}
                </div>
                {this.renderActionMenu(this.actions)}
            </Host>
        );
    }

    private renderLabel = () => {
        return <label id={this.labelId}>{this.text}</label>;
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
        };

        return <limel-icon {...iconProps} />;
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

        return (
            <limel-menu
                class="mdc-deprecated-list-item__meta"
                items={actions}
                openDirection="left-start"
            >
                <limel-icon-button
                    class="action-menu-trigger"
                    slot="trigger"
                    icon="menu_2"
                />
            </limel-menu>
        );
    };

    private filterClickWhenDisabled = (event: MouseEvent) => {
        if (this.disabled || !this.selectable) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }

        this.handleInteraction();
    };

    private handleInteraction = () => {
        // Calculate the new selected state (toggled)
        const newSelected = !this.selected;

        // Create the item object to emit
        const item: ListItemType = {
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

        // Emit the interact event
        this.interact.emit({
            selected: newSelected,
            item: item,
        });
    };

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
}
