import {
    Component,
    Element,
    Event,
    EventEmitter,
    h,
    Host,
    Prop,
    State,
} from '@stencil/core';
import { DockItem } from './dock.types';

const DEFAULT_MOBILE_BREAKPOINT = 700;

/**
 * @exampleComponent limel-example-dock-basic
 * @exampleComponent limel-example-dock-mobile
 * @exampleComponent limel-example-dock-expanded
 * @private
 */
@Component({
    tag: 'limel-dock',
    shadow: true,
    styleUrl: 'dock.scss',
})
export class Dock {
    @Element()
    public host: HTMLLimelDockElement;

    /**
     * What dock items to render
     */
    @Prop()
    public dockItems: DockItem[] = [];

    /**
     * Fired when a dock item has been selected from the dock
     */
    @Event()
    public change: EventEmitter<DockItem>;

    /**
     * Defines the width of the component and whether it should
     * be wide and show the labels of the dock items,
     * or be small and only show icons of the items.
     */
    @Prop({ reflect: true })
    public expanded = false;

    /**
     * xxx
     */
    @Prop({ reflect: true })
    public allowResize = true;

    /**
     * xxxxxx
     */
    @Prop({ reflect: true })
    public mobileBreakPoint: number = DEFAULT_MOBILE_BREAKPOINT;

    /**
     * A document may have several <nav> elements, for example,
     * one for site navigation and one for intra-page navigation.
     * `ariaLabelledBy` can be used in such case to promote accessibility,
     */
    @Prop({ reflect: true })
    public ariaLabelledBy: string;

    /**
     * xxxxxx
     */
    @State()
    private hasMobileLayout = false;
    private observer: ResizeObserver;

    public componentDidLoad() {
        this.observer = new ResizeObserver(this.handleResize);
        this.observer.observe(document.body);
    }

    disconnectedCallback() {
        this.observer.disconnect();
    }

    public render() {
        return (
            <Host
                class={{
                    dock: true,
                    expanded: this.expanded,
                    'has-mobile-layout': this.hasMobileLayout,
                }}
            >
                <nav aria-labelledby={this.ariaLabelledBy}>
                    {this.dockItems.map(this.renderDockItem)}
                </nav>
                {this.renderExpandShrinkToggle()}
            </Host>
        );
    }

    private renderDockItem = (item: DockItem) => {
        return (
            <limel-dock-item
                class={{
                    'dock-item': true,
                    'is-first-footer-item': item.isFooterStart,
                    selected: item.selected,
                }}
                style={this.getItemStyle(item)}
                item={item}
                expanded={this.expanded && !this.hasMobileLayout}
                hasMobileLayout={this.hasMobileLayout}
                onInteract={this.handleDockItemClick(item)}
            />
        );
    };

    private handleDockItemClick = (dockItem: DockItem) => () => {
        if (!dockItem.selected) {
            this.change.emit(dockItem);
        }
    };

    private handleResize = () => {
        if (window.innerWidth <= this.mobileBreakPoint) {
            this.hasMobileLayout = true;
        } else {
            this.hasMobileLayout = false;
        }
    };

    private getItemStyle(dockItem: DockItem) {
        const style = {};
        if (dockItem?.selectedColor) {
            style['--dock-item-background-color--selected'] =
                dockItem.selectedColor;
        }

        if (dockItem?.iconColor) {
            style['--dock-item-icon-color--inactive'] = dockItem.iconColor;
        }

        return style;
    }

    private renderExpandShrinkToggle() {
        if (this.hasMobileLayout || !this.allowResize) {
            return;
        }

        return (
            <button
                class={{
                    'expand-shrink': true,
                    expanded: this.expanded,
                }}
                onClick={this.toggleDockWidth}
            >
                <limel-icon name="angle_right" />
            </button>
        );
    }

    private toggleDockWidth = () => {
        this.expanded = !this.expanded;
    };
}
