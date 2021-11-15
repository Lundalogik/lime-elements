import { MenuItem, ListSeparator } from '@limetech/lime-elements';
import { Component, h } from '@stencil/core';

/**
 * With icons
 */
@Component({
    tag: 'limel-example-menu-icons',
    shadow: true,
})
export class MenuIconsExample {
    private items: Array<MenuItem | ListSeparator> = [
        { text: 'Copy', icon: 'copy' },
        { text: 'Cut', icon: 'cut' },
        { separator: true },
        { text: 'Paste', icon: 'paste' },
    ];

    public render() {
        return (
            <limel-menu items={this.items}>
                <limel-button label="Menu" slot="trigger" />
            </limel-menu>
        );
    }
}
