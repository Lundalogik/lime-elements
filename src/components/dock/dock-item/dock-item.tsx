import {
    Component,
    Element,
    Event,
    EventEmitter,
    h,
    Prop,
    State,
} from '@stencil/core';
import { DockItem, DockItemConfig } from '../dock.types';
import { createRandomString } from '../../../util/random-string';

/**
 * @private
 */
@Component({
    tag: 'limel-dock-item',
    shadow: false,
    styleUrl: 'dock-item.scss',
})
export class DefaultDockItem implements DockItem {
    /**
     * The Dock item that should be rendered.
     */
    @Prop()
    public item: DockItemConfig = null;

    /**
     * Tells the individual items whether the parent is expanded or not.
     */
    @Prop()
    public expanded: boolean;

    /**
     * Tells the individual items whether the parent has a horizontal layout or a vertical one.
     */
    @Prop()
    public useMobileLayout: boolean;

    /**
     * Fired when clicking on the flow item
     */
    @Event()
    public interact: EventEmitter<void>;

    @Element()
    public element: HTMLLimelDockItemElement;

    @State()
    private isOpen = false;

    private tooltipId: string;

    constructor() {
        this.tooltipId = createRandomString();
    }

    public render() {
        if (this.item?.component) {
            return this.renderPopover();
        }

        return this.renderButton(this.handleClick, '');
    }

    private renderPopover() {
        const CustomComponent = this.item?.component?.name;
        if (!CustomComponent) {
            return;
        }

        return (
            <limel-popover
                openDirection={this.useMobileLayout ? 'top' : 'right'}
                open={this.isOpen}
                onClose={this.onPopoverClose}
            >
                {this.renderButton(this.openPopover, 'trigger')}
                <CustomComponent />
            </limel-popover>
        );
    }

    private renderButton(universalHandleClick, slot) {
        return (
            <button
                slot={slot}
                tabindex="0"
                id={this.tooltipId}
                type="button"
                class={{
                    button: true,
                    selected: this.item?.selected,
                }}
                onClick={universalHandleClick}
            >
                {this.renderIcon()}
                {this.renderLabel()}
                {this.renderTooltip()}
            </button>
        );
    }

    private openPopover = (event: MouseEvent) => {
        event.stopPropagation();
        this.isOpen = true;
    };

    private onPopoverClose = (event: CustomEvent) => {
        event.stopPropagation();
        this.isOpen = false;
    };

    private handleClick = () => {
        this.interact.emit();
    };

    private renderIcon() {
        if (!this.item.icon) {
            return;
        }

        return <limel-icon name={this.item.icon} class="icon" />;
    }

    private renderLabel() {
        if (this.expanded) {
            return <span class="text">{this.item.label}</span>;
        }
    }

    private renderTooltip() {
        if (!this.expanded && this.item.label) {
            return (
                <limel-tooltip
                    elementId={this.tooltipId}
                    label={this.item.label}
                    helperLabel={this.item.helperLabel}
                />
            );
        }

        if (this.expanded && this.item.helperLabel) {
            return (
                <limel-tooltip
                    elementId={this.tooltipId}
                    label={this.item.helperLabel}
                />
            );
        }
    }
}
