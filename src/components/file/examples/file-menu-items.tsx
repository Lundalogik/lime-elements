import {
    FileInfo,
    LimelMenuCustomEvent,
    MenuItem,
} from '@limetech/lime-elements';
import { Component, h, Host, State } from '@stencil/core';
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
    private value: FileInfo = {
        filename: 'deal.pdf',
        id: 123,
        menuItems: [
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
        ],
    };

    @State()
    private selectedValue: MenuItem = undefined;

    public render() {
        return (
            <Host onMenuItemSelected={this.handleMenuItemSelected}>
                <limel-file
                    label="Attach a file"
                    value={this.value}
                    onChange={this.handleChange}
                />
                <limel-example-value value={this.selectedValue} />
            </Host>
        );
    }

    private handleChange = (event: CustomEvent<FileInfo>) => {
        this.value = event.detail;
        console.log('onChange', this.value);
    };

    private handleMenuItemSelected = (
        event: LimelMenuCustomEvent<MenuItem>
    ) => {
        event.stopPropagation();
        console.log('onMenuItemSelected', event.detail);

        this.selectedValue = event.detail;
    };
}
