import { MenuItem, ListSeparator } from '@limetech/lime-elements';
import { Component, Element, Host, State, h } from '@stencil/core';

/**
 * Resize the menu drop-down
 */
@Component({
    tag: 'limel-example-menu-size',
    styleUrl: 'menu-size.scss',
    shadow: true,
})
export class MenuSubItemsExample {
    private items: Array<MenuItem | ListSeparator> = [
        {
            text: 'Real super heroes',
        },
        {
            text: 'Fake super heroes',
        },
    ];

    @Element()
    public host: HTMLElement;

    @State()
    private isMenuOpen: boolean = false;

    public render() {
        const width = this.host?.offsetWidth;

        return (
            <Host>
                <limel-button
                    label="Open the wide menu"
                    onClick={this.onButtonClick}
                />
                <limel-menu
                    open={this.isMenuOpen}
                    style={{
                        '--menu-surface-width': width ? `${width}px` : '',
                    }}
                    items={this.items}
                    onSelect={this.closeMenu}
                    onCancel={this.closeMenu}
                />
            </Host>
        );
    }

    private onButtonClick = () => {
        this.isMenuOpen = true;
    };

    private closeMenu = () => {
        this.isMenuOpen = false;
    };
}
