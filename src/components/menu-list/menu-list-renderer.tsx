import { ListSeparator, MenuItem } from '../../interface';
import { h } from '@stencil/core';
import { MenuListRendererConfig } from './menu-list-renderer-config';

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
                aria-hidden={true}
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
     * @param {Array<MenuItem | ListSeparator>} items the items of the list, including any `ListSeparator`:s
     * @returns {number} the index as per the description
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
    };

    /**
     * Render a single list item
     * @param {MenuItem | ListSeparator} item the item to render
     * @param {number} index the index the item had in the `items` array
     * @returns {HTMLElement} the list item
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
                {...attributes}
            >
                {item.icon ? this.renderIcon(this.config, item) : null}
                {this.renderText(item)}
                {this.renderNotification(item)}
                {this.twoLines && this.avatarList ? this.renderDivider() : null}
            </li>
        );
    };

    /**
     * Render the text of the list item
     * @param {MenuItem} item the list item
     * @returns {HTMLElement | string} the text for the list item
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
     * @param {MenuListRendererConfig} config the config object, passed on from the `renderMenuItem` function
     * @param {MenuItem} item the list item
     * @returns {HTMLElement} the icon element
     */
    private renderIcon = (config: MenuListRendererConfig, item: MenuItem) => {
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
}
