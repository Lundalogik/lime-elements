import { MenuItem, ListSeparator } from '@limetech/lime-elements';
import { Component, h } from '@stencil/core';

/**
 * With badge icons
 */
@Component({
    tag: 'limel-example-menu-badge-icons',
    shadow: true,
})
export class MenuBadgeIconsExample {
    private items: Array<MenuItem | ListSeparator> = [
        {
            text: 'Copy',
            icon: 'copy',
            iconColor: 'rgb(var(--color-lime-light))',
        },
        { text: 'Cut', icon: 'cut', iconColor: 'rgb(var(--color-red-light))' },
        { separator: true },
        {
            text: 'Paste',
            icon: 'paste',
            iconColor: 'rgb(var(--color-amber-default))',
        },
    ];

    public render() {
        return (
            <limel-menu items={this.items} badgeIcons={true}>
                <limel-button label="Menu" slot="trigger" />
            </limel-menu>
        );
    }
}
