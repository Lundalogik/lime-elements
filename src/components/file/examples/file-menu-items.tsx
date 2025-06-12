import {
    FileInfo,
    ListSeparator,
    MenuItem,
    MenuItemEvent,
} from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';
/**
 * Custom menu items
 *
 * By providing custom menu items, you can add additional actions.
 *
 */
@Component({
    tag: 'limel-example-file-menu-items',
    shadow: true,
})
export class FileMenuItemsExample {
    @State()
    private value: FileInfo = { filename: 'deal.pdf', id: 123 };

    @State()
    private menuItems: Array<MenuItem | ListSeparator> = [
        {
            text: 'Download',
            icon: 'download',
            value: 1,
            selected: false,
        },
        {
            text: 'Share',
            icon: 'share',
            value: 2,
            selected: false,
        },
    ];

    public render() {
        return [
            <limel-file
                label="Attach a file"
                value={this.value}
                menuItems={this.menuItems}
                onChange={this.handleChange}
                onMenuItemSelected={this.handleMenuItemSelected}
            />,
            <limel-example-value value={this.menuItems} />,
        ];
    }

    private handleChange = (event: CustomEvent<FileInfo>) => {
        this.value = event.detail;
        console.log('onChange', this.value);
    };

    private handleMenuItemSelected = (event: CustomEvent<MenuItemEvent>) => {
        event.stopPropagation();
        console.log('onMenuItemSelected', event.detail.menuItem);

        this.menuItems = this.menuItems.map((item) => {
            if ('separator' in item) {
                return item;
            }

            return {
                ...item,
                selected: item.value === event.detail.menuItem.value,
            };
        });
    };
}
