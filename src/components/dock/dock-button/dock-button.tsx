import { Component, Event, EventEmitter, h, Prop, State } from '@stencil/core';
import { DockItem } from '../dock.types';
import { createRandomString } from '../../../util/random-string';

/**
 * @private
 */
@Component({
    tag: 'limel-dock-button',
    shadow: false,
    styleUrl: 'dock-button.scss',
})
export class DockButton {
    /**
     * Item that is placed in the dock.
     */
    @Prop()
    public item!: DockItem;

    /**
     * When the dock is expanded or collapsed, dock items
     * show labels and tooltips as suitable for the layout.
     */
    @Prop({ reflect: true })
    public expanded? = false;

    /**
     * When dock is using mobile layout, dock items
     * show labels and tooltips as suitable for the layout.
     */
    @Prop({ reflect: true })
    public useMobileLayout? = false;

    /**
     * Fired when a dock item has been selected from the dock.
     */
    @Event()
    private itemSelected: EventEmitter<DockItem>;

    /**
     * Indicated whether the popover that renders a component is open.
     */
    @State()
    private isOpen = false;

    /**
     * Fired when the popover is closed.
     */
    @Event()
    public close: EventEmitter<void>;

    private tooltipId: string;

    constructor() {
        this.tooltipId = createRandomString();
    }

    public render() {
        if (this.item?.dockMenu?.componentName) {
            return this.renderPopover();
        }

        return this.renderButton(this.handleClick);
    }

    private renderPopover() {
        const CustomComponent = this.item?.dockMenu.componentName;

        return (
            <limel-popover
                openDirection={this.useMobileLayout ? 'top' : 'right'}
                open={this.isOpen || this.item.dockMenu.menuOpen}
                onClose={this.onPopoverClose}
            >
                {this.renderButton(this.openPopover, 'trigger')}
                <CustomComponent
                    {...(this.item.dockMenu.props || {})}
                    onClose={this.onPopoverClose}
                />
            </limel-popover>
        );
    }

    private renderButton(
        handleClick: (event: MouseEvent) => void,
        slot?: string
    ) {
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
                onClick={handleClick}
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

    private onPopoverClose = () => {
        this.isOpen = false;
        this.close.emit();
    };

    private handleClick = (event: MouseEvent) => {
        event.stopPropagation();
        this.interact.emit(this.item);
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
