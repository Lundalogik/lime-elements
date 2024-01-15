import {
    MenuItem,
    ListSeparator,
    LimelMenuCustomEvent,
} from '@limetech/lime-elements';
import { Component, State, h, Host } from '@stencil/core';
import { CascadingMenuItems } from './item-constants';

/**
 * Opening sub-menus programmatically
 *
 * **This example is currently not in use because it's an experimental feature**
 *
 * It is possible to open any sub-menu in the menu-hierarchy.
 * This is done by using the parentItem property of the MenuItem class.
 *
 * @sourceFile item-constants.ts
 */
@Component({
    tag: 'limel-example-menu-open-sub-menu-programmatically',
    shadow: true,
    styleUrl: 'menu-open-sub-menu-programmatically.scss',
})
export class MenuOpenSubMenuProgrammaticallyExample {
    private readonly rootItems: Array<MenuItem | ListSeparator> =
        CascadingMenuItems;

    @State()
    private items: Array<MenuItem | ListSeparator> = this.rootItems;

    @State()
    private lastSelectedItem: string;

    @State()
    private currentSubMenu: MenuItem;

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
                    currentSubMenu={this.currentSubMenu}
                    onSelect={this.handleSelect}
                    onNavigateMenu={this.handleNavigateMenu}
                    onCancel={this.handleMenuCancel}
                >
                    <limel-button label="Menu" slot="trigger" />
                </limel-menu>
                <limel-button
                    label='Shortcut to "Bullets and numbering"'
                    primary={true}
                    onClick={this.buttonClick}
                />
            </div>
        );
    }

    private handleNavigateMenu = (event: LimelMenuCustomEvent<MenuItem>) => {
        if (!event.detail) {
            this.items = this.rootItems;
        }
    };

    private handleMenuCancel = () => {
        this.items = this.rootItems;
        this.openMenu = false;
    };

    private buttonClick = () => {
        const formatMenuItem = this.rootItems.find(
            (i) => i.text === 'Format',
        ) as MenuItem;

        const menuToOpen = (
            formatMenuItem.items as Array<MenuItem | ListSeparator>
        ).find((i) => i.text === 'Bullets and numbering') as MenuItem;

        this.currentSubMenu = {
            ...menuToOpen,
            parentItem: formatMenuItem,
        };
        this.items = menuToOpen.items as Array<MenuItem | ListSeparator>;
        this.openMenu = true;
    };

    private handleSelect = (event: LimelMenuCustomEvent<MenuItem>) => {
        this.currentSubMenu = null;
        this.items = this.rootItems;
        this.lastSelectedItem = event.detail.text;
        this.openMenu = false;
    };
}
