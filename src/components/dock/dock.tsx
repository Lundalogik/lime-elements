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
 * @exampleComponent limel-example-dock-colors
 * @exampleComponent limel-example-dock-colors-css
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
     * Items that are placed in the dock.
     */
    @Prop()
    public dockItems: DockItem[] = [];

    /**
     * Items that are placed at the bottom of the dock. (Or at the end in mobile
     * layout.)
     */
    @Prop()
    public footerItems: DockItem[] = [];

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
     * Fired when a Dock item has been selected from the dock.
     */
    @Event()
    private selected: EventEmitter<DockItem>;

    /**
     * Is used to render the component horizontally, and place
     * the Dock items in a row.
     */
    @State()
    private useMobileLayout = false;

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
                    'has-mobile-layout': this.useMobileLayout,
                }}
            >
                <nav aria-labelledby={this.ariaLabelledBy}>
                    {this.dockItems.map(this.renderDockItem)}
                    <span class="footer-separator" />
                    {this.footerItems.map(this.renderDockItem)}
                </nav>
                {this.renderExpandShrinkToggle()}
            </Host>
        );
    }

    private renderDockItem = (item: DockItem) => {
        let ButtonComponent = 'limel-default-dock-button';
        if (item.dockButton?.componentName) {
            ButtonComponent = item.dockButton.componentName;
        }

        return (
            <ButtonComponent
                class={{
                    'dock-item': true,
                    selected: item.selected,
                }}
                item={item}
                expanded={this.expanded && !this.useMobileLayout}
                useMobileLayout={this.useMobileLayout}
                onInteract={this.handleDockItemClick}
            />
        );
    };

    private handleDockItemClick = (event: CustomEvent<DockItem>) => {
        if (!event.detail.selected) {
            this.selected.emit(event.detail);
        }
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
    };
}
