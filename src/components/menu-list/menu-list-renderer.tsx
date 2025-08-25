import { ListSeparator } from '../list/list-item.types';
import { MenuItem } from '../menu/menu.types';
import { h } from '@stencil/core';
import { MenuListRendererConfig } from './menu-list-renderer-config';
import { isFunction } from 'lodash-es';

export class MenuListRenderer {
    private defaultConfig: MenuListRendererConfig = {
        isOpen: true,
        badgeIcons: false,
    };

    private config: MenuListRendererConfig;

    private applyTabIndexToItemAtIndex: number;

    public render(
        items: Array<MenuItem | ListSeparator>,
        config: MenuListRendererConfig = {}
    ) {
        items = items || [];
        this.config = { ...this.defaultConfig, ...config };

        this.applyTabIndexToItemAtIndex =
            this.getIndexForWhichToApplyTabIndex(items);

        return (
            <ul
                class="mdc-deprecated-list"
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
                <li
                    class="mdc-deprecated-list-divider"
                    role="separator"
                    key={`sep-${index}`}
                >
                    {this.renderTextForSeparator(item)}
                    <div class="limel-list-divider-line" />
                </li>
            );
        }

        const attributes: { tabindex?: string } = {};
        if (index === this.applyTabIndexToItemAtIndex) {
            attributes.tabindex = '0';
        }

        const hasSubMenu = this.hasSubItems(item);
        const hasMeta =
            hasSubMenu ||
            item.badge !== undefined ||
            (!!('commandText' in item) && !!item.commandText);

        const primaryComponent = hasMeta
            ? {
                  name: 'limel-menu-item-meta',
                  props: {
                      commandText: (item as any).commandText,
                      badge: (item as any).badge,
                      showChevron: hasSubMenu,
                  },
              }
            : undefined;

        const key = (item as any).id ?? `item-${index}`;
        const classNames = {
            'mdc-deprecated-list-item': true, // required for keyboard navigation with arrow keys
            'mdc-deprecated-list-item--disabled': !!item.disabled, // MDC’s foundation checks for the disabled class before toggling selected state
        };
        return (
            <limel-list-item
                key={key}
                class={classNames}
                data-index={index}
                {...attributes}
                aria-haspopup={hasSubMenu ? 'menu' : undefined}
                aria-expanded={hasSubMenu ? 'false' : undefined}
                type="menuitem"
                text={item.text}
                secondaryText={item.secondaryText}
                icon={item.icon}
                primaryComponent={primaryComponent as any}
                badgeIcon={this.config.badgeIcons}
                selected={item.selected}
                disabled={item.disabled}
            />
        );
    };

    private renderTextForSeparator = (item: ListSeparator) => {
        if ('text' in item) {
            return <h2 class="limel-list-divider-title">{item.text}</h2>;
        }
    };

    private hasSubItems = (item: MenuItem): boolean => {
        return (
            (Array.isArray(item.items) && item.items.length > 0) ||
            isFunction(item.items)
        );
    };
}
