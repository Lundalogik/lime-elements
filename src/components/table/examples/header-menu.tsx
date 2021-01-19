import { Component, h, Prop } from '@stencil/core';
import { ListItem } from 'src/components/list/list-item.types';

@Component({
    tag: 'limel-example-header-menu',
    shadow: true,
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
