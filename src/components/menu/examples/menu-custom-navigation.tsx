import {
    MenuItem,
    ListSeparator,
    LimelMenuCustomEvent,
} from '@limetech/lime-elements';
import { Component, State, h, Host } from '@stencil/core';

const ALL_ITEMS: Array<MenuItem | ListSeparator> = [
    {
        text: 'Format',
        items: [
            {
                text: 'Bold',
                icon: 'bold',
            },
            {
                text: 'Italic',
                icon: 'italic',
            },
            {
                text: 'Lists',
                icon: 'bulleted_list',
                items: [
                    {
                        text: 'Numbered list',
                        icon: 'numbered_list',
                    },
                    {
                        text: 'Bullet list',
                        icon: 'bulleted_list',
                    },
                    {
                        text: 'Checklist',
                        icon: 'todo_list',
                    },
                ],
            },
        ],
    },
    {
        text: 'Edit',
        items: [
            {
                text: 'Copy',
                icon: 'copy',
            },
            {
                text: 'Cut',
                icon: 'cut',
            },
            {
                text: 'Paste',
                icon: 'paste',
            },
        ],
    },
];

/**
 * Customized navigation
 *
 * It is possible to open a menu at a certain point in the menu-hierarchy.
 * This is done by using the parentItem property of the MenuItem class.
 */
@Component({
    tag: 'limel-example-menu-custom-navigation',
    shadow: true,
    styleUrl: 'menu-custom-navigation.scss',
})
export class MenuSubItemsExample {
    @State()
    private items: Array<MenuItem | ListSeparator> = ALL_ITEMS;

    @State()
    private lastSelectedItem: string;

    @State()
    private selectedMenuItem: MenuItem;

    @State()
    private openMenu: boolean = false;

    public render() {
        return (
            <Host>
                {this.renderMenu()}
                <limel-example-value
                    label="Last selected item"
                    value={this.lastSelectedItem}
                />
            </Host>
        );
    }

    private renderMenu() {
        return [
            <limel-menu
                items={this.items}
                open={this.openMenu}
                selectedMenuItem={this.selectedMenuItem}
                onSelect={this.handleSelect}
                onNavigateMenu={async (
                    event: LimelMenuCustomEvent<MenuItem>
                ) => {
                    if (!event.detail) {
                        this.items = ALL_ITEMS;
                    }
                }}
                onCancel={() => {
                    this.items = ALL_ITEMS;
                    this.openMenu = false;
                }}
            >
                <limel-button label="Menu" slot="trigger" />
                <limel-button
                    label="Shortcut to Lists"
                    slot="trigger"
                    primary={true}
                    onClick={this.buttonClick}
                />
            </limel-menu>,
        ];
    }

    private buttonClick = () => {
        const selectedItem: MenuItem = {
            text: 'Lists',
            parentItem: ALL_ITEMS[0] as MenuItem,
        };
        const selectedItems: MenuItem[] = [
            {
                text: 'Numbered list',
                icon: 'numbered_list',
                parentItem: selectedItem,
            },
            {
                text: 'Bullet list',
                icon: 'bulleted_list',
                parentItem: selectedItem,
            },
            {
                text: 'Checklist',
                icon: 'todo_list',
                parentItem: selectedItem,
            },
        ];
        this.selectedMenuItem = selectedItem;
        this.items = selectedItems;
        this.openMenu = true;
    };

    private handleSelect = (event: LimelMenuCustomEvent<MenuItem>) => {
        this.selectedMenuItem = null;
        this.lastSelectedItem = event.detail.text;
        this.openMenu = false;
    };
}
