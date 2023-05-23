import { Component, Prop, h, Event, EventEmitter } from '@stencil/core';
import {
    MenuItem,
    LimelMenuCustomEvent,
    ListSeparator,
    ActionBarItem,
    OpenDirection,
} from '@limetech/lime-elements';

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
    items: Array<MenuItem | ListSeparator>;

    /**
     * Defines the location that the content of the overflow menu
     * appears, in relation to its trigger.
     */
    @Prop({ reflect: true })
    public openDirection: OpenDirection;

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
