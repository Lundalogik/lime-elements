import {
    Component,
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
 * @exampleComponent limel-example-dock-notification
 * @exampleComponent limel-example-dock-mobile
 * @exampleComponent limel-example-dock-expanded
 * @exampleComponent limel-example-dock-colors-css
 */
@Component({
    tag: 'limel-dock',
    shadow: true,
    styleUrl: 'dock.scss',
})
export class Dock {
    /**
     * Items that are placed in the dock.
     */
    @Prop()
    public dockItems: DockItem[] = [];

    /**
     * Items that are placed at the bottom of the dock. (Or at the end in mobile
     * layout.)
     */
    @Prop()
    public dockFooterItems?: DockItem[] = [];

    /**
     * A label used to describe the purpose of the navigation element to users
     * of assistive technologies, like screen readers. Especially useful when
     * there are multiple navigation elements in the user interface.
     * Example value: "Primary navigation"
     */
    @Prop({ reflect: true })
    public accessibleLabel?: string;

    /**
     * Defines the width of the component, when it loads.
     * - `true`: shows both icons and labels of the Dock items.
     * - `false`: only shows icons of the doc items, and displays
     * their labels as tooltip.
     *
     * Note: when `useMobileLayout` is `true`, labels will always
     * be shown as tooltips. Read more below…
     */
    @Prop({ reflect: true })
    public expanded? = false;

    /**
     * Set to `false` if you do not want to allow end-users
     * to exapnd or shrink the Dock. This will hide the
     * expand/shrink button, and the only things that defines
     * the layout will be the `expanded` property, and
     * the `mobileBreakPoint`.
     */
    @Prop({ reflect: true })
    public allowResize? = true;

    /**
     * Defines the breakpoint in pixles, at which the component will be rendered
     * in a hoizontal layout. Default breakpoint is `700` pixels, which means
     * when the screen size is smaller than `700px`, the component will automatically
     * switch to a horizontal layout.
     */
    @Prop({ reflect: true })
    public mobileBreakPoint?: number = DEFAULT_MOBILE_BREAKPOINT;

    /**
     * Fired when a dock item has been selected from the dock.
     */
    @Event()
    public itemSelected: EventEmitter<DockItem>;

    /**
     * Fired when a dock menu is opened.
     */
    @Event()
    public menuOpen: EventEmitter<DockItem>;

    /**
     * Fired when the popover is closed.
     */
    @Event()
    public close: EventEmitter<void>;

    /**
     * Fired when a Dock is expanded or collapsed.
     */
    @Event()
    private dockExpanded: EventEmitter<boolean>;

    /**
     * Is used to render the component horizontally, and place
     * the Dock items in a row.
     */
    @State()
    private useMobileLayout = false;

    private resizeObserver: ResizeObserver;

    public componentDidLoad() {
        this.resizeObserver = new ResizeObserver(this.handleResize);
        this.resizeObserver.observe(document.body);
    }

    disconnectedCallback() {
        this.resizeObserver.disconnect();
    }

    public render() {
        return (
            <Host
                class={{
                    dock: true,
                    expanded: this.expanded,
                    'has-mobile-layout': this.useMobileLayout,
                }}
            >
                <nav aria-label={this.accessibleLabel}>
                    {this.dockItems.map(this.renderDockItem)}
                    {this.renderSeparator()}
                    {this.dockFooterItems.map(this.renderDockItem)}
                </nav>
                {this.renderExpandShrinkToggle()}
            </Host>
        );
    }

    private renderSeparator = () => {
        return this.useMobileLayout ? null : <span class="footer-separator" />;
    };

    private renderDockItem = (item: DockItem) => {
        return (
            <limel-dock-button
                class={{
                    'dock-item': true,
                    selected: item.selected,
                }}
                item={item}
                expanded={this.expanded && !this.useMobileLayout}
                useMobileLayout={this.useMobileLayout}
            />
        );
    };

    private handleResize = () => {
        if (window.innerWidth <= this.mobileBreakPoint) {
            this.useMobileLayout = true;
        } else {
            this.useMobileLayout = false;
        }
    };

    private renderExpandShrinkToggle() {
        if (this.useMobileLayout || !this.allowResize) {
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
        this.dockExpanded.emit(this.expanded);
    };
}
