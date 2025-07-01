import { ListSeparator } from '../list/list-item.types';
import { MenuItem } from '../menu/menu.types';
import { h } from '@stencil/core';
import { MenuListRendererConfig } from './menu-list-renderer-config';
import {
    getIconColor,
    getIconName,
    getIconTitle,
} from '../icon/get-icon-props';
import { isFunction } from 'lodash-es';

export class MenuListRenderer {
    private defaultConfig: MenuListRendererConfig = {
        isOpen: true,
        badgeIcons: false,
    };

    private config: MenuListRendererConfig;

    private hasIcons: boolean;
    private twoLines: boolean;
    private avatarList: boolean;
    private commandKey: boolean;

    private applyTabIndexToItemAtIndex: number;

    public render(
        items: Array<MenuItem | ListSeparator>,
        config: MenuListRendererConfig = {}
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

        this.applyTabIndexToItemAtIndex =
            this.getIndexForWhichToApplyTabIndex(items);

        const classNames = {
            'mdc-deprecated-list': true,
            'mdc-deprecated-list--two-line': this.twoLines,
            selectable: true,
            'mdc-deprecated-list--avatar-list': this.avatarList,
            'list--compact':
                this.twoLines &&
                this.commandKey &&
                ['small', 'x-small'].includes(this.config.iconSize),
        };

        return (
            <ul
                class={classNames}
                role="menu"
                aria-orientation="vertical"
                style={{ '--maxLinesSecondaryText': '2' }}
            >
                {items.map(this.renderMenuItem)}
            </ul>
        );
    }

    /**
     * Determine which MenuItem should have the `tab-index` attribute set,
     * and return the index at which that MenuItem is located in `items`.
     * Returns `undefined` if no item should have the attribute set.
     * See https://github.com/material-components/material-components-web/tree/e66a43a75fef4f9179e24856649518e15e279a04/packages/mdc-list#accessibility
     *
     * @param items - the items of the list, including any `ListSeparator`:s
     * @returns the index as per the description
     */
    private getIndexForWhichToApplyTabIndex = (
        items: Array<MenuItem | ListSeparator>
    ) => {
        let result;
        for (let i = 0, max = items.length; i < max; i += 1) {
            if ('separator' in items[i]) {
                // Ignore ListSeparator
            } else {
                const item = items[i] as MenuItem<any>;
                if (item.disabled) {
                    // Skip disabled items - they should never get tabindex
                    continue;
                }

                if (item.selected) {
                    result = i;
                    break;
                }

                if (result === undefined) {
                    result = i;
                    // Do NOT break, as any later item with
                    // `selected=true` should get the tab-index instead!
                }
            }
        }

        return result;
    };

    /**
     * Render a single list item
     *
     * @param item - the item to render
     * @param index - the index the item had in the `items` array
     * @returns the list item
     */
    private renderMenuItem = (
        item: MenuItem | ListSeparator,
        index: number
    ) => {
        if ('separator' in item) {
            return (
                <li class="mdc-deprecated-list-divider" role="separator">
                    {this.rendertext(item)}
                    <div class="limel-list-divider-line" />
                </li>
            );
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
                role="menuitem"
                aria-disabled={item.disabled ? 'true' : 'false'}
                aria-selected={item.selected ? 'true' : 'false'}
                data-index={index}
                data-text={item.text}
                {...attributes}
            >
                {this.renderIcon(this.config, item)}
                {this.renderText(item)}
                {this.renderSubMenuIcon(item)}
                {this.renderNotification(item)}
                {this.twoLines && this.avatarList ? this.renderDivider() : null}
            </li>
        );
    };

    /**
     * Render the text of the list item
     *
     * @param item - the list item
     * @returns the text for the list item
     */
    private renderText = (item: MenuItem) => {
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
    };

    private renderSubMenuIcon = (item: MenuItem) => {
        if (!this.hasSubItems(item)) {
            return;
        }

        return <limel-icon class="sub-menu-icon" name="-lime-caret-right" />;
    };

    private rendertext = (item: ListSeparator) => {
        if ('text' in item) {
            return <h2 class="limel-list-divider-title">{item.text}</h2>;
        }
    };

    private renderCommandText = (item: MenuItem) => {
        if (!('commandText' in item)) {
            return;
        }

        return (
            <div class="mdc-deprecated-list-item__command-text">
                {item.commandText}
            </div>
        );
    };

    private isSimpleItem = (item: MenuItem): boolean => {
        if ('commandText' in item) {
            return false;
        }

        return !('secondaryText' in item);
    };

    /**
     * Render an icon for a list item
     *
     * @param config - the config object, passed on from the `renderMenuItem` function
     * @param item - the list item
     * @returns the icon element
     */
    private renderIcon = (config: MenuListRendererConfig, item: MenuItem) => {
        const style: any = {};
        const name = getIconName(item.icon);
        if (!name) {
            return;
        }

        const color = getIconColor(item.icon, item.iconColor);
        const title = getIconTitle(item.icon);

        if (color) {
            if (config.badgeIcons) {
                style['--icon-background-color'] = color;
            } else {
                style.color = color;
            }
        }

        return (
            <limel-icon
                badge={config.badgeIcons}
                class="mdc-deprecated-list-item__graphic"
                name={name}
                style={style}
                size={config.iconSize}
                aria-label={title}
                aria-hidden={title ? null : 'true'}
            />
        );
    };

    private renderNotification = (item: MenuItem) => {
        if (item.badge !== undefined) {
            return <limel-badge label={item.badge} />;
        }
    };

    private renderDivider = () => {
        const classes = {
            'mdc-deprecated-list-divider': true,
            'mdc-deprecated-list-divider--inset': true,
        };
        if (this.config.iconSize) {
            classes[this.config.iconSize] = true;
        }

        return <hr class={classes} />;
    };

    private hasSubItems = (item: MenuItem): boolean => {
        return (
            (Array.isArray(item.items) && item.items.length > 0) ||
            isFunction(item.items)
        );
    };
}
