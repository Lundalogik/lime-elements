import { ListItem, ListSeparator, MenuItem } from '@limetech/lime-elements';
import { h } from '@stencil/core';
import { CheckboxTemplate } from '../checkbox/checkbox.template';
import { ListRendererConfig } from './list-renderer-config';
import { RadioButtonTemplate } from './radio-button/radio-button.template';

export class ListRenderer {
    private defaultConfig: ListRendererConfig = {
        isOpen: true,
        badgeIcons: false,
    };

    private config: ListRendererConfig;

    private hasIcons: boolean;
    private twoLines: boolean;
    private avatarList: boolean;
    private commandKey: boolean;

    private applyTabIndexToItemAtIndex: number;

    public constructor() {
        this.renderListItem = this.renderListItem.bind(this);
        this.renderDivider = this.renderDivider.bind(this);
    }

    public render(
        items: Array<ListItem | ListSeparator | MenuItem>,
        config: ListRendererConfig = {}
    ) {
        items = items || [];
        this.config = { ...this.defaultConfig, ...config };

        this.twoLines = items.some((item) => {
            return 'secondaryText' in item && !!item.secondaryText;
        });

        this.commandKey = items.some((item) => {
            return 'commandText' in item && !!item.commandText;
        });

        this.hasIcons = items.some((item) => {
            return 'icon' in item && !!item.icon;
        });

        this.avatarList = this.config.badgeIcons && this.hasIcons;
        const selectableListTypes = ['selectable', 'radio', 'checkbox', 'menu'];

        let role;
        switch (this.config.type) {
            case 'checkbox':
                role = 'group';
                break;
            case 'radio':
                role = 'radiogroup';
                break;
            default:
                role = this.config.type === 'menu' ? 'menu' : 'listbox';
        }

        this.applyTabIndexToItemAtIndex =
            this.getIndexForWhichToApplyTabIndex(items);

        const classNames = {
            'mdc-deprecated-list': true,
            'mdc-deprecated-list--two-line': this.twoLines,
            selectable: selectableListTypes.includes(this.config.type),
            'mdc-deprecated-list--avatar-list': this.avatarList,
            'list--compact':
                this.twoLines &&
                this.commandKey &&
                ['small', 'x-small'].includes(this.config.iconSize),
        };

        return (
            <ul
                class={classNames}
                aria-hidden={(this.config.type === 'menu').toString()}
                role={role}
                aria-orientation="vertical"
            >
                {items.map(this.renderListItem)}
            </ul>
        );
    }

    /**
     * Determine which ListItem should have the `tab-index` attribute set,
     * and return the index at which that ListItem is located in `items`.
     * Returns `undefined` if no item should have the attribute set.
     * See https://github.com/material-components/material-components-web/tree/e66a43a75fef4f9179e24856649518e15e279a04/packages/mdc-list#accessibility
     *
     * @param {Array<ListItem | ListSeparator | MenuItems>} items the items of the list, including any `ListSeparator`:s
     * @returns {number} the index as per the description
     */
    private getIndexForWhichToApplyTabIndex(
        items: Array<ListItem | ListSeparator | MenuItem>
    ) {
        let result;
        for (let i = 0, max = items.length; i < max; i += 1) {
            if ('separator' in items[i]) {
                // Ignore ListSeparator
            } else {
                const item = items[i] as ListItem<any>;
                if (item.selected) {
                    result = i;
                    break;
                }

                if (result === undefined && !item.disabled) {
                    result = i;
                    // Do NOT break, as any later item with
                    // `selected=true` should get the tab-index instead!
                }
            }
        }

        return result;
    }

    /**
     * Render a single list item
     *
     * @param {ListItem | ListSeparator | MenuItems} item the item to render
     * @param {number} index the index the item had in the `items` array
     * @returns {HTMLElement} the list item
     */
    private renderListItem(
        item: ListItem | ListSeparator | MenuItem,
        index: number
    ) {
        if ('separator' in item) {
            return <li class="mdc-deprecated-list-divider" role="separator" />;
        }

        if (['radio', 'checkbox'].includes(this.config.type)) {
            return this.renderVariantListItem(this.config, item, index);
        }

        const classNames = {
            'mdc-deprecated-list-item': true,
            'mdc-deprecated-list-item--disabled': item.disabled,
            'mdc-deprecated-list-item--selected': item.selected,
        };

        const attributes: { tabindex?: string } = {};
        if (index === this.applyTabIndexToItemAtIndex) {
            attributes.tabindex = '0';
        }

        return (
            <li
                class={classNames}
                role={this.config.type === 'menu' ? 'menuitem' : ''}
                aria-disabled={item.disabled ? 'true' : 'false'}
                aria-selected={item.selected ? 'true' : 'false'}
                data-index={index}
                {...attributes}
            >
                {item.icon ? this.renderIcon(this.config, item) : null}
                {this.renderText(item)}
                {this.twoLines && this.avatarList ? this.renderDivider() : null}
                {this.renderActionMenu(item.actions)}
            </li>
        );
    }

    /**
     * Render the text of the list item
     *
     * @param {ListItem | MenuItem} item the list item
     * @returns {HTMLElement | string} the text for the list item
     */
    private renderText(item: ListItem | MenuItem) {
        if (this.isSimpleItem(item)) {
            return (
                <span class="mdc-deprecated-list-item__text">{item.text}</span>
            );
        }

        return (
            <div class="mdc-deprecated-list-item__text">
                <div class="mdc-deprecated-list-item__primary-command-text">
                    <div class="mdc-deprecated-list-item__primary-text">
                        {item.text}
                    </div>
                    {this.renderCommandText(item)}
                </div>
                <div class="mdc-deprecated-list-item__secondary-text">
                    {item.secondaryText}
                </div>
            </div>
        );
    }
    private renderCommandText(item: ListItem | MenuItem) {
        if (!('commandText' in item)) {
            return;
        }

        return (
            <div class="mdc-deprecated-list-item__command-text">
                {item.commandText}
            </div>
        );
    }
    private isSimpleItem(item: ListItem | MenuItem): boolean {
        if ('commandText' in item) {
            return false;
        }

        if ('secondaryText' in item) {
            return false;
        }

        return true;
    }

    /**
     * Render an icon for a list item
     *
     * @param {ListRendererConfig} config the config object, passed on from the `renderListItem` function
     * @param {ListItem} item the list item
     * @returns {HTMLElement} the icon element
     */
    private renderIcon(config: ListRendererConfig, item: ListItem) {
        const style: any = {};
        if (item.iconColor) {
            if (config.badgeIcons) {
                style['--icon-background-color'] = item.iconColor;
            } else {
                style.color = item.iconColor;
            }
        }

        return (
            <limel-icon
                badge={config.badgeIcons}
                class="mdc-deprecated-list-item__graphic"
                name={item.icon}
                style={style}
                size={config.iconSize}
            />
        );
    }

    private renderDivider() {
        const classes = {
            'mdc-deprecated-list-divider': true,
            'mdc-deprecated-list-divider--inset': true,
        };
        if (this.config.iconSize) {
            classes[this.config.iconSize] = true;
        }

        return <hr class={classes} />;
    }

    private renderActionMenu(actions: Array<ListItem | ListSeparator>) {
        if (!actions || actions.length === 0) {
            return;
        }

        return (
            <limel-menu
                class="mdc-deprecated-list-item__meta"
                items={actions}
                openDirection="left"
            >
                <limel-icon slot="trigger" name="menu_2" size="small" />
            </limel-menu>
        );
    }

    private renderVariantListItem(
        config: ListRendererConfig,
        item: ListItem,
        index: number
    ) {
        let itemTemplate;
        if (config.type === 'radio') {
            itemTemplate = (
                <RadioButtonTemplate
                    id={`c_${index}`}
                    checked={item.selected}
                    disabled={item.disabled}
                />
            );
        } else if (config.type === 'checkbox') {
            itemTemplate = (
                <CheckboxTemplate
                    id={`c_${index}`}
                    checked={item.selected}
                    disabled={item.disabled}
                />
            );
        }

        const classNames = {
            'mdc-deprecated-list-item': true,
            'mdc-deprecated-list-item--disabled': item.disabled,
            'mdc-deprecated-list-item__text': !item.secondaryText,
        };

        const attributes: { tabindex?: string } = {};
        if (index === this.applyTabIndexToItemAtIndex) {
            attributes.tabindex = '0';
        }

        return (
            <li
                class={classNames}
                role={config.type}
                aria-checked={item.selected ? 'true' : 'false'}
                aria-disabled={item.disabled ? 'true' : 'false'}
                data-index={index}
                {...attributes}
            >
                {this.renderVariantListItemContent(config, item, itemTemplate)}
            </li>
        );
    }

    private renderVariantListItemContent(
        config: ListRendererConfig,
        item: ListItem | MenuItem,
        itemTemplate: any
    ) {
        if (this.hasIcons) {
            return [
                item.icon ? this.renderIcon(config, item) : null,
                this.renderText(item),
                <div class="mdc-deprecated-list-item__meta">
                    {itemTemplate}
                </div>,
            ];
        }

        return [
            <div class="mdc-deprecated-list-item__graphic">{itemTemplate}</div>,
            this.renderText(item),
        ];
    }
}
