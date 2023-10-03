import { Component, h, Prop } from '@stencil/core';
import { ListItem } from '@limetech/lime-elements';

@Component({
    tag: 'limel-example-header-menu',
    shadow: true,
    styleUrl: 'header-menu.scss',
})
export class HeaderMenu {
    @Prop()
    public items: ListItem[];

    @Prop()
    public icon: string;

    private menuOpen = true;

    public render() {
        return (
            <limel-menu items={this.items} open={this.menuOpen}>
                <limel-icon slot="trigger" name={this.icon} size="x-small" />
            </limel-menu>
        );
    }
}
