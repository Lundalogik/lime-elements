import {
    MenuItem,
    ListSeparator,
    LimelMenuCustomEvent,
} from '@limetech/lime-elements';
import { Component, Host, State, h } from '@stencil/core';

const isApple = /Mac|iPhone|iPad|iPod/i.test(
    (navigator as any).userAgentData?.platform ?? navigator.platform ?? ''
);

type SuggestionValue = {
    propertyName?: string;
    searchTerm?: string;
    applyAll?: boolean;
};

const ALL_PROPERTIES = [
    'Name',
    'Company',
    'City',
    'Country',
    'Email',
    'Phone',
    'Website',
];

/**
 * Keeping the menu open after selection
 *
 * By default, a menu closes as soon as the user selects an item.
 * This is the expected behavior in most cases.
 *
 * But in some workflows, the design may require a different interaction
 * pattern: the menu stays open after selection, allowing the user to make
 * multiple selections in a row.
 *
 * For instance, when applying multiple filters
 * to a dataset: the user types a keyword, selects an item to filter on,
 * then selects another item — all without leaving the keyboard.
 *
 * Setting `keepOpenOnSelect` to `true` keeps the menu open after
 * each selection. When a `searcher` is provided, the search query
 * is preserved and the `searcher` is called again, so the consumer
 * can update the result list (e.g. remove the item that was just applied).
 */
@Component({
    tag: 'limel-example-menu-keep-open',
    shadow: true,
})
export class MenuKeepOpenExample {
    @State()
    private appliedFilters: string[] = [];

    private get primaryHotkey() {
        return isApple ? 'meta+enter' : 'ctrl+enter';
    }

    private get applyAllHotkey() {
        return isApple ? 'meta+shift+enter' : 'ctrl+shift+enter';
    }

    public render() {
        return (
            <Host>
                <limel-menu
                    keepOpenOnSelect={true}
                    searcher={this.handleSearch}
                    searchPlaceholder="Find property…"
                    onSelect={this.handleSelect}
                    emptyResultMessage="No matching properties"
                >
                    <limel-chip
                        text="Filter"
                        icon={{
                            name: 'plus_math',
                            color: 'rgb(var(--contrast-800))',
                            title: 'Add',
                        }}
                        slot="trigger"
                    />
                </limel-menu>
                <limel-example-value
                    label="Applied filters"
                    value={this.appliedFilters.join(', ') || '(none)'}
                />
            </Host>
        );
    }

    private readonly handleSearch = async (
        queryString: string
    ): Promise<Array<MenuItem | ListSeparator>> => {
        const searchTerm = queryString?.trim() ?? '';
        if (searchTerm.length === 0) {
            return [];
        }

        const menuItems = ALL_PROPERTIES.filter((item) => {
            return (
                item.toLowerCase().includes(searchTerm.toLowerCase()) &&
                !this.appliedFilters.includes(item)
            );
        }).map((propertyName) => {
            return {
                text: propertyName,
                value: {
                    propertyName,
                    searchTerm,
                } satisfies SuggestionValue,
            } as MenuItem;
        });

        if (menuItems.length === 0) {
            return [];
        }

        menuItems[0] = {
            ...menuItems[0],
            hotkey: this.primaryHotkey,
        };

        if (menuItems.length <= 1) {
            return menuItems;
        }

        const applyAllMenuItem: MenuItem = {
            text: 'Apply all',
            hotkey: this.applyAllHotkey,
            value: {
                applyAll: true,
                searchTerm,
            } satisfies SuggestionValue,
        };

        return [...menuItems, { separator: true }, applyAllMenuItem];
    };

    private handleSelect = (
        event: LimelMenuCustomEvent<MenuItem<SuggestionValue>>
    ) => {
        const selectedItem = event.detail;
        if (!selectedItem?.value) {
            return;
        }

        if (selectedItem.value.applyAll) {
            const searchTerm = selectedItem.value.searchTerm ?? '';
            const remaining = ALL_PROPERTIES.filter((item) => {
                return (
                    item.toLowerCase().includes(searchTerm.toLowerCase()) &&
                    !this.appliedFilters.includes(item)
                );
            });

            this.appliedFilters = [...this.appliedFilters, ...remaining];

            return;
        }

        if (selectedItem.value.propertyName) {
            this.appliedFilters = [
                ...this.appliedFilters,
                selectedItem.value.propertyName,
            ];
        }
    };
}
