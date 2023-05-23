import {
    Component,
    Event,
    EventEmitter,
    h,
    Host,
    Prop,
    State,
    Element,
} from '@stencil/core';
import { ActionBarItem } from './action-bar.types';
import { MenuItem, OpenDirection } from '../menu/menu.types';
import { ListSeparator } from '../list/list-item.types';

/**
 * An action bar is a user interface element commonly found in software applications and websites.
 * It typically appears at the top of the screen or within a specific section
 * and serves as a centralized hub for accessing various actions and commands
 * relevant to the current context or page.
 *
 * The action bar often contains a set of clickable icons or buttons (icons + labels)
 * that represent specific actions, such as saving, deleting, editing, sharing,
 * or bulk operations for selected items.
 *
 * The purpose of an action bar is to provide quick and convenient access to
 * frequently used functionalities, enabling users to perform common tasks efficiently.
 * It enhances usability by organizing important actions in a visually prominent and easily accessible location.
 *
 * The action bar's design and layout can vary based on the platform or application,
 * but its primary goal remains consistent—to
 * empower users to interact with the software and perform desired actions effortlessly.
 * @exampleComponent limel-example-action-bar
 * @exampleComponent limel-example-action-bar-overflow-menu
 * @exampleComponent limel-example-action-bar-colors
 * @exampleComponent limel-example-action-bar-floating
 * @exampleComponent limel-example-action-bar-styling
 * @exampleComponent limel-example-action-bar-as-primary-component
 */
@Component({
    tag: 'limel-action-bar',
    shadow: true,
    styleUrl: 'action-bar.scss',
})
export class ActionBar {
    /**
     * Items that are placed in the action bar.
     * These represent primary actions.
     */
    @Prop()
    public actionBarItems: Array<ActionBarItem | ListSeparator> = [];

    /**
     * A label used to describe the purpose of the element to users
     * of assistive technologies, like screen readers.
     * Example value: "toolbar"
     */
    @Prop({ reflect: true })
    public accessibleLabel?: string;

    /**
     * - When set to `fullWidth`, the component will take the
     * entire width of its container.
     * - When set to `true`, the component will get basic stylings
     * to visualize the floating state.
     * :::note
     * You should still properly position the component
     * according to the structure of your user interface.
     * For example, use an `absolute` or `fixed` position.
     * :::
     */
    @Prop({ reflect: true })
    public layout?: 'fullWidth' | 'floating';

    /**
     * Fired when a action bar item has been clicked.
     */
    @Event()
    public itemSelected: EventEmitter<ActionBarItem>;

    @Element()
    public element: HTMLElement;

    /**
     * Defines the location that the content of the overflow menu
     * appears, in relation to its trigger.
     */
    @Prop({ reflect: true })
    public openDirection: OpenDirection;

    @State()
    private overflowCutoff: number = this.actionBarItems.length;

    @State()
    private calculatingOverflow: boolean = false;

    private resizeObserver: ResizeObserver;
    private intersectionObserver: IntersectionObserver;
    private overflowRecalculationScheduled: boolean;
    // eslint-disable-next-line no-magic-numbers
    private RESIZE_RATE_MS = 800;
    private lastOverFlowCutoff: number = this.actionBarItems.length;

    public componentWillLoad() {
        this.resizeObserver = new ResizeObserver(this.handleResize);
    }

    disconnectedCallback() {
        this.resizeObserver.disconnect();
        this.intersectionObserver.disconnect();
    }

    public render() {
        const visibleItems = this.actionBarItems.slice(0, this.overflowCutoff);
        const overflowItems = this.actionBarItems.slice(this.overflowCutoff);

        return (
            <Host
                aria-label={this.accessibleLabel}
                class={{
                    'is-full-width': this.layout === 'fullWidth',
                    'is-floating': this.layout === 'floating',
                }}
            >
                {visibleItems.map(this.renderActionBarItem)}
                {this.renderOverflowMenu(overflowItems)}
            </Host>
        );
    }

    public componentDidRender() {
        const element = this.element.parentElement;

        if (element === null) {
            throw new Error(
                'Failed to create resizeObserver, no parent found for limel-action-bar. Consider wrapping the action-bar in an element'
            );
        }

        this.resizeObserver.observe(element);
        if (this.calculatingOverflow) {
            this.createIntersectionObserver();
        }
    }

    private renderActionBarItem = (item: ActionBarItem, index: number) => {
        return (
            <limel-action-bar-item
                item={item}
                onSelect={this.handleSelect}
                style={{
                    visibility:
                        index < this.lastOverFlowCutoff ? 'visible' : 'hidden',
                }}
            />
        );
    };

    private renderOverflowMenu = (items: Array<MenuItem | ListSeparator>) => {
        if (items.length === 0) {
            return;
        }

        return (
            <limel-action-bar-overflow-menu
                style={{
                    visibility: this.calculatingOverflow ? 'hidden' : 'visible',
                }}
                openDirection={this.openDirection}
                items={items}
                onSelect={this.handleSelect}
            />
        );
    };

    private handleSelect = (
        event: CustomEvent<ActionBarItem | ListSeparator>
    ) => {
        event.stopPropagation();
        if (this.isItem(event.detail)) {
            this.itemSelected.emit(event.detail);
        }
    };

    private handleResize = async () => {
        if (!this.overflowRecalculationScheduled) {
            this.lastOverFlowCutoff = this.overflowCutoff;
            this.overflowRecalculationScheduled = true;
            setTimeout(() => {
                this.overflowCutoff = this.actionBarItems.length;
                this.calculatingOverflow = true;
                this.overflowRecalculationScheduled = false;
            }, this.RESIZE_RATE_MS);
        }
    };

    handleIntersection = (entries: IntersectionObserverEntry[]) => {
        // IntersectionObserver sometimes holds onto leftover entries from last render
        entries = entries.filter((entry) =>
            this.element.shadowRoot.contains(entry.target)
        );

        const items = entries.filter(
            (entry) => entry.target.localName === 'limel-action-bar-item'
        );
        const intersectingItems = items.filter((entry) => entry.isIntersecting);
        const menuEntry = entries.filter(
            (entry) =>
                entry.target.localName === 'limel-action-bar-overflow-menu'
        );
        const intersectingMenuEntry = menuEntry.filter(
            (entry) => entry.isIntersecting
        );

        if (
            entries.length ===
            intersectingItems.length + intersectingMenuEntry.length
        ) {
            this.calculatingOverflow = false;
            this.intersectionObserver.disconnect();
            this.lastOverFlowCutoff = this.overflowCutoff;

            return;
        }

        if (menuEntry.length === 0) {
            this.overflowCutoff = intersectingItems.length;
        } else {
            this.overflowCutoff -= 1;
        }

        this.intersectionObserver.disconnect();
    };

    private createIntersectionObserver() {
        const options = {
            root: this.element.parentElement,
            rootMargin: '0px',
            threshold: 1.0,
        };

        this.intersectionObserver = new IntersectionObserver(
            this.handleIntersection,
            options
        );

        this.element.shadowRoot
            .querySelectorAll('limel-action-bar-item')
            .forEach((actionBar) => {
                this.intersectionObserver.observe(actionBar);
            });
        const overflowMenu = this.element.shadowRoot.querySelector(
            'limel-action-bar-overflow-menu'
        );
        if (overflowMenu) {
            this.intersectionObserver.observe(overflowMenu);
        }
    }

    private isItem(item: ActionBarItem | ListSeparator): item is ActionBarItem {
        return !('separator' in item);
    }
}
