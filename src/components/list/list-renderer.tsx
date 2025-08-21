import { ListItem } from './list-item.types';
import { ListSeparator } from '../../global/shared-types/separator.types';
import { h } from '@stencil/core';
import { ListRendererConfig } from './list-renderer-config';

export class ListRenderer {
    private defaultConfig: ListRendererConfig = {
        isOpen: true,
        badgeIcons: false,
    };

    private config: ListRendererConfig;

    private applyTabIndexToItemAtIndex: number;

    public render(
        items: Array<ListItem | ListSeparator>,
        config: ListRendererConfig = {}
    ) {
        items = items || [];
        this.config = { ...this.defaultConfig, ...config };

        let role;
        switch (this.config.type) {
            case 'checkbox': {
                role = 'group';
                break;
            }
            case 'radio': {
                role = 'radiogroup';
                break;
            }
            default: {
                role = 'listbox';
            }
        }

        this.applyTabIndexToItemAtIndex =
            this.getIndexForWhichToApplyTabIndex(items);

        return (
            <ul
                class="mdc-deprecated-list"
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
     * @param items - the items of the list, including any `ListSeparator`:s
     * @returns the index as per the description
     */
    private getIndexForWhichToApplyTabIndex = (
        items: Array<ListItem | ListSeparator>
    ) => {
        let result;
        for (let i = 0, max = items.length; i < max; i += 1) {
            if ('separator' in items[i]) {
                // Ignore ListSeparator
            } else {
                const item = items[i] as ListItem<any>;
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
    private renderListItem = (
        item: ListItem | ListSeparator,
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

        let itemType: 'radio' | 'checkbox' | 'option' | 'listitem';
        if (this.config.type === 'radio' || this.config.type === 'checkbox') {
            itemType = this.config.type;
        } else if (this.config.type === 'selectable') {
            itemType = 'option';
        } else {
            itemType = 'listitem';
        }

        const key = (item as any).id ?? `item-${index}`;
        const classNames = {
            'mdc-deprecated-list-item': true, // required for keyboard navigation with arrow keys
            'mdc-deprecated-list-item--disabled': !!item.disabled, // MDC’s foundation checks for the disabled class before toggling selected state
        };
        return (
            <limel-list-item
                key={key}
                class={classNames}
                {...attributes}
                data-index={index}
                type={itemType}
                text={item.text}
                secondaryText={item.secondaryText}
                icon={item.icon}
                image={item.image}
                primaryComponent={item.primaryComponent}
                badgeIcon={this.config.badgeIcons}
                iconSize={this.config.iconSize}
                selected={item.selected}
                disabled={item.disabled}
                actions={item.actions}
            />
        );
    };

    private renderTextForSeparator = (item: ListSeparator) => {
        if ('text' in item) {
            return <h2 class="limel-list-divider-title">{item.text}</h2>;
        }
    };
}
