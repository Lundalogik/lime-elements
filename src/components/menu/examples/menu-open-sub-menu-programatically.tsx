import {
    MenuItem,
    ListSeparator,
    LimelMenuCustomEvent,
} from '@limetech/lime-elements';
import { Component, State, h, Host } from '@stencil/core';
import { CascadingMenuItems } from './item-constants';

/**
 * Opening sub-menus programatically
 *
 * It is possible to open any sub-menu in the menu-hierarchy.
 * This is done by using the parentItem property of the MenuItem class.
 * @link item-constants.ts
 */
@Component({
    tag: 'limel-example-menu-open-sub-menu-programatically',
    shadow: true,
    styleUrl: 'menu-open-sub-menu-programatically.scss',
})
export class MenuOpenSubMenuProgramaticallyExample {
    private readonly rootItems: Array<MenuItem | ListSeparator> =
        CascadingMenuItems;

    @State()
    private items: Array<MenuItem | ListSeparator> = this.rootItems;

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
        return (
            <div class="menu-container">
                <limel-menu
                    items={this.items}
                    open={this.openMenu}
                    selectedMenuItem={this.selectedMenuItem}
                    onSelect={this.handleSelect}
                    onNavigateMenu={async (
                        event: LimelMenuCustomEvent<MenuItem>
                    ) => {
                        if (!event.detail) {
                            this.items = this.rootItems;
                        }
                    }}
                    onCancel={() => {
                        this.items = this.rootItems;
                        this.openMenu = false;
                    }}
                >
                    <limel-button label="Menu" slot="trigger" />
                </limel-menu>
                <limel-button
                    label="Shortcut to Lists"
                    primary={true}
                    onClick={this.buttonClick}
                />
            </div>
        );
    }

    private buttonClick = () => {
        const selectedItem: MenuItem = {
            text: 'Lists',
            parentItem: this.rootItems[0] as MenuItem,
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
        this.items = this.rootItems;
        this.lastSelectedItem = event.detail.text;
        this.openMenu = false;
    };
}
