import { Component, Prop, h, Event, EventEmitter } from '@stencil/core';
import { ActionBarItem } from '../../action-bar/action-bar.types';
import { ListSeparator } from '../../list/list-item.types';
import { MenuItem, OpenDirection } from '../../menu/menu.types';
import { LimelMenuCustomEvent } from 'src/components';

/**
 * @private
 */
@Component({
    tag: 'limel-action-bar-overflow-menu',
    shadow: false,
})
export class ActionBarOverflowMenu {
    /**
     * List of the items that should be rendered in the overflow menu.
     */
    @Prop()
    public items: Array<MenuItem | ListSeparator>;

    /**
     * Defines the location that the content of the overflow menu
     * appears, in relation to its trigger.
     * It defaults to `bottom-end`, since in normal scenarios
     * (for example when the action bar is not floating at the bottom of the screen)
     * this menu is the right-most item in the user interface of the component.
     */
    @Prop({ reflect: true })
    public openDirection: OpenDirection = 'bottom-end';

    @Event()
    public select: EventEmitter<ActionBarItem>;

    public render() {
        return [
            <limel-menu
                openDirection={this.openDirection}
                items={this.items}
                onSelect={this.handleSelect}
            >
                <button slot="trigger">{this.countOverflowedItems()}</button>
            </limel-menu>,
        ];
    }

    private countOverflowedItems = () => {
        return `+${this.numberOfMenuItems}`;
    };

    private handleSelect = (event: LimelMenuCustomEvent<MenuItem>) => {
        event.stopPropagation();
        this.select.emit(event.detail);
    };

    private get numberOfMenuItems() {
        return this.items.filter((item) => this.isMenuItem(item)).length;
    }

    private isMenuItem(item: MenuItem | ListSeparator): item is MenuItem {
        return !('separator' in item);
    }
}
