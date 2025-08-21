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
            icon: {
                name: 'copy',
                color: 'rgb(var(--color-lime-default))',
            },
        },
        {
            text: 'Cut',
            icon: {
                name: 'cut',
                color: 'rgb(var(--color-sky-default))',
            },
        },
        {
            text: 'Paste',
            icon: {
                name: 'paste',
                color: 'rgb(var(--color-amber-dark))',
            },
        },
        { separator: true },
        {
            text: 'Delete',
            icon: {
                name: 'trash',
                color: 'rgb(var(--color-white))',
                backgroundColor: 'rgb(var(--color-red-default))',
            },
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
