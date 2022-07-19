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
 * @exampleComponent limel-example-dock-custom-component
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
     * Items that are placed within the `<nav />` section of the dock.
     */
    @Prop()
    public dockItems: DockItem[] = [];

    /**
     * Fired when a Dock item has been selected from the dock.
     */
    @Event()
    public change: EventEmitter<DockItem>;

    /**
     * Defines the width of the component, when it loads.
     * - `true`: shows both icons and labels of the Dock items.
     * - `false`: only shows icons of the doc items, and displays
     * their labels as tooltip.
     *
     * Note: when `hasMobileLayout` is `true`, labels will always
     * be shown as tooltips. Read more below…
     */
    @Prop({ reflect: true })
    public expanded = false;

    /**
     * Set to `false` if you do not want to allow end-users
     * to exapnd or shrink the Dock. This will hide the
     * expand/shrink button, and the only things that defines
     * the layout will be the `expanded` property, and
     * the `mobileBreakPoint`.
     */
    @Prop({ reflect: true })
    public allowResize = true;

    /**
     * Defines the breakpoint in pixles, at which the component will be rendered
     * in a hoizontal layout. Default breakpoint is `700` pixels, which means
     * when the screen size is smaller than `700px`, the component will automatically
     * switch to a horizontal layout.
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
     * Is used to render the component horizontally, and place
     * the Dock items in a row.
     */
    @State()
    private hasMobileLayout = false;

    /**
     * Used to trigger mobileLayout, when viewport width is changed.
     */
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
