import {
    MenuItem,
    ListSeparator,
    LimelMenuCustomEvent,
} from '@limetech/lime-elements';
import { Component, Host, State, h } from '@stencil/core';
import { isAppleDevice } from '../../../util/device';

type SuggestionValue = {
    propertyName?: string;
    searchTerm?: string;
    applyAll?: boolean;
};

const FILTERABLE_PROPERTIES = [
    'Name',
    'Company',
    'City',
    'Country',
    'Email',
    'Phone',
    'Website',
];

/**
 * Searchable menu with hotkeys
 *
 * When it comes to menus that have a search functionality,
 * hotkeys can be a great way to speed up selection, but it can also be
 * tricky to implement in a way that feels intuitive and doesn't interfere with
 * the search experience.
 *
 * Consider that when the menu is opened, they focus is on the search input,
 * and the user is either already typing something to filter the results
 * or has typed something and is seeing the filtered results, while the focus is
 * still in the input field.
 *
 * Therefore, using a single hotkey for each item in the search results is not
 * a good idea, as it can interfere with the user's ability to type their search query.
 * For such scenarios, hotkey combinations that require a modifier
 * key (e.g. Ctrl or Cmd) can be a good solution,
 * as they allow the user to quickly select an item from the search results
 * without interfering with their ability to type.
 *
 * In this example, the first search result gets:
 * - Apple devices: <kbd>⌘</kbd> + <kbd>↩</kbd>
 * - Others: <kbd>Ctrl</kbd> + <kbd>↩</kbd>
 *
 * The final “Apply all” item (shown only when there are many results) gets:
 * - Apple devices: <kbd>⌘</kbd> + <kbd>⌥</kbd> + <kbd>↩</kbd>
 * - Others: <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>↩</kbd>
 */
@Component({
    tag: 'limel-example-menu-searchable-hotkeys',
    shadow: true,
})
export class MenuSearchableHotkeysExample {
    @State()
    private lastSelectedItem = '';

    private get primaryHotkey() {
        return isAppleDevice() ? 'meta+enter' : 'ctrl+enter';
    }

    private get applyAllHotkey() {
        return isAppleDevice() ? 'meta+alt+enter' : 'ctrl+alt+enter';
    }

    public render() {
        return (
            <Host>
                <limel-menu
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
                    label="Last selected item"
                    value={this.lastSelectedItem}
                />
            </Host>
        );
    }

    private handleSearch = async (
        queryString: string
    ): Promise<Array<MenuItem | ListSeparator>> => {
        const searchTerm = queryString?.trim() ?? '';
        if (searchTerm.length === 0) {
            return [];
        }

        const menuItems = FILTERABLE_PROPERTIES.filter((item) => {
            return item.toLowerCase().includes(searchTerm.toLowerCase());
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
            this.lastSelectedItem = `Apply all (${selectedItem.value.searchTerm})`;

            return;
        }

        this.lastSelectedItem = `${selectedItem.value.propertyName}`;
    };
}
