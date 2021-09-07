import {
    Component,
    Element,
    Event,
    EventEmitter,
    h,
    Prop,
    State,
} from '@stencil/core';
import { DockItem } from '../dock.types';
import { createRandomString } from '../../../util/random-string';

/**
 * @private
 */
@Component({
    tag: 'limel-dock-item',
    shadow: false,
    styleUrl: 'dock-item.scss',
})

// buttons in a menu component
export class DockItemMenu {
    @Element()
    public element: HTMLLimelDockItemElement;

    /**
     * The flow item that should be rendered
     */
    @Prop()
    public item: DockItem = null;

    /**
     * xxxx
     */
    @Prop()
    public expanded: boolean;

    /**
     * xxxx
     */
    @Prop()
    public hasMobileLayout: boolean;

    /**
     * Fired when clicking on the flow item
     */
    @Event()
    public interact: EventEmitter<void>;

    @State()
    private isOpen = false;

    private tooltipId: string;

    constructor() {
        this.tooltipId = createRandomString();
    }

    public render() {
        const props = this.item?.component?.props;
        if (props) {
            return this.renderCustomDockItem();
        }

        if (this.item?.component) {
            return this.renderPopover();
        }

        return this.renderButton(this.handleClick, '');
    }

    private renderCustomDockItem() {
        const CustomComponent = this.item?.component?.name;

        return <CustomComponent {...this.item?.component?.props} />;
    }

    private renderPopover() {
        const CustomComponent = this.item?.component?.name;
        if (!CustomComponent) {
            return;
        }

        return (
            <limel-popover
                openDirection={this.hasMobileLayout ? 'top' : 'right'}
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
