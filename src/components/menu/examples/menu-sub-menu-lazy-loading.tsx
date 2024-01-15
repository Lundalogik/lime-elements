import {
    MenuItem,
    ListSeparator,
    LimelMenuCustomEvent,
} from '@limetech/lime-elements';
import { Component, State, h } from '@stencil/core';
import { LazyLoader } from './menu-sub-menu-lazy-loading-service-mock';

/**
 * Lazy loading items in sub-menus
 *
 * @sourceFile menu-sub-menu-lazy-loading-service-mock.ts
 */
@Component({
    tag: 'limel-example-menu-sub-menu-lazy-loading',
    shadow: true,
})
export class MenuSubMenuLazyLoadingExample {
    @State()
    private lastSelectedItem: string;

    private lazyLoader: LazyLoader;

    private items: Array<MenuItem | ListSeparator>;

    constructor() {
        this.lazyLoader = new LazyLoader();
        this.items = [
            {
                text: 'Format',
                items: this.lazyLoader.loadItems,
                value: 'format_menu',
            },
            {
                text: 'Edit',
                items: this.lazyLoader.loadItems,
                value: 'edit_menu',
            },
        ];
    }

    public render() {
        return [
            <limel-menu items={this.items} onSelect={this.handleSelect}>
                <limel-button label="Menu" slot="trigger" />
            </limel-menu>,
            <limel-example-value
                label="Last selected item"
                value={this.lastSelectedItem}
            />,
        ];
    }

    private handleSelect = (event: LimelMenuCustomEvent<MenuItem>) => {
        this.lastSelectedItem = event.detail.text;
    };
}
