import { Component, Prop, h, Event, EventEmitter, Host } from '@stencil/core';
import { ActionBarItem } from '../../action-bar/action-bar.types';
import { ListSeparator } from '../../list-item/list-item.types';
import { MenuItem, OpenDirection } from '../../menu/menu.types';
import { LimelMenuCustomEvent } from '../../../components';
import { Icon } from '../../../global/shared-types/icon.types';

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

    /**
     * Icon to display in the overflow menu trigger.
     * If not provided, the number of items in the overflow menu will be displayed.
     */
    @Prop()
    public overFlowIcon?: Icon;

    /**
     * Fired when an item in the action bar overflow menu has been clicked.
     * @public
     */
    @Event()
    public select: EventEmitter<ActionBarItem>;

    public render() {
        return (
            <Host>
                <limel-menu
                    openDirection={this.openDirection}
                    items={this.items}
                    onSelect={this.handleSelect}
                >
                    <button type="button" slot="trigger">
                        {this.getOverflowTriggerContent()}
                    </button>
                </limel-menu>
            </Host>
        );
    }

    private getOverflowTriggerContent = () => {
        if (this.overFlowIcon) {
            const { color, name, title } = this.overFlowIcon;

            return (
                <limel-icon
                    style={{
                        color: color,
                    }}
                    name={name}
                    aria-label={title}
                />
            );
        }

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
