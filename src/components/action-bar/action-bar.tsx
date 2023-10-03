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
import {
    ActionBarItem,
    MenuItem,
    OpenDirection,
    ListSeparator,
} from '../../interface';
import { isItem } from './isItem';

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
    public actions: Array<ActionBarItem | ListSeparator> = [];

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
     * - When set to `floating`, the component will get basic stylings
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
     * Defines the location that the content of the overflow menu
     * appears, in relation to its trigger.
     */
    @Prop({ reflect: true })
    public openDirection: OpenDirection;

    /**
     * Fired when a action bar item has been clicked.
     */
    @Event()
    public itemSelected: EventEmitter<ActionBarItem>;

    @Element()
    private host: HTMLElement;

    @State()
    private overflowCutoff: number = this.actions.length;

    private intersectionObserver: IntersectionObserver;
    private firstRender = true;
    private actionBarItems: HTMLLimelActionBarItemElement[] = [];

    public render() {
        let overflowActions: Array<MenuItem | ListSeparator> = [];
        if (this.actions.length) {
            overflowActions = this.actions.slice(this.overflowCutoff);
        }

        return (
            <Host
                aria-label={this.accessibleLabel}
                class={{
                    'is-full-width': this.layout === 'fullWidth',
                    'is-floating': this.layout === 'floating',
                }}
            >
                <div class="items">
                    {this.actions.map(this.renderActionBarItem)}
                </div>
                {this.renderOverflowMenu(overflowActions)}
            </Host>
        );
    }

    public connectedCallback() {}

    public componentDidRender() {
        if (this.haveItemsChanged()) {
            this.intersectionObserver?.disconnect();
            this.createIntersectionObserver();
        }
    }

    public disconnectedCallback() {
        this.intersectionObserver?.disconnect();
        this.intersectionObserver = undefined;
        this.actionBarItems = [];
        this.connectedCallback = () => this.createIntersectionObserver();
    }

    private renderActionBarItem = (item: ActionBarItem, index: number) => {
        return (
            <limel-action-bar-item
                item={item}
                onSelect={this.handleSelect}
                isVisible={this.isVisible(index)}
            />
        );
    };

    private renderOverflowMenu = (items: Array<MenuItem | ListSeparator>) => {
        if (!(this.actions.length - this.overflowCutoff)) {
            return;
        }

        return (
            <limel-action-bar-overflow-menu
                openDirection={this.openDirection}
                items={items}
                onSelect={this.handleSelect}
            />
        );
    };

    private isVisible(index: number) {
        return index < this.overflowCutoff;
    }

    private handleSelect = (
        event: CustomEvent<ActionBarItem | ListSeparator>
    ) => {
        event.stopPropagation();
        if (isItem(event.detail)) {
            this.itemSelected.emit(event.detail);
        }
    };

    private handleIntersection = (entries: IntersectionObserverEntry[]) => {
        const intersectingItems = entries.filter(
            (entry) => entry.isIntersecting
        );

        const notIntersectingItems = entries.filter(
            (entry) => !entry.isIntersecting
        );

        if (this.firstRender) {
            this.overflowCutoff = intersectingItems.length;
        } else {
            this.overflowCutoff =
                this.overflowCutoff +
                intersectingItems.length -
                notIntersectingItems.length;
        }

        this.firstRender = false;
    };

    private createIntersectionObserver() {
        const options = {
            root: this.host.shadowRoot.querySelector('.items'),
            rootMargin: '0px',
            threshold: 1.0,
        };

        this.overflowCutoff = this.actions.length;
        this.firstRender = true;

        this.actionBarItems = [];

        this.intersectionObserver = new IntersectionObserver(
            this.handleIntersection,
            options
        );

        this.host.shadowRoot
            .querySelectorAll('limel-action-bar-item')
            .forEach((actionBarItem) => {
                this.observe(actionBarItem);
            });
    }

    private observe(actionBarItem: HTMLLimelActionBarItemElement) {
        this.intersectionObserver.observe(actionBarItem);
        this.actionBarItems.push(actionBarItem);
    }

    private haveItemsChanged() {
        const someItemRemoved = this.actionBarItems.some(
            (actionBarItem: HTMLLimelActionBarItemElement) =>
                !this.host.shadowRoot.contains(actionBarItem)
        );

        const someItemAdded = Array.from(
            this.host.shadowRoot.querySelectorAll('limel-action-bar-item')
        ).some(
            (actionBarItem: HTMLLimelActionBarItemElement) =>
                !this.actionBarItems.includes(actionBarItem)
        );

        return someItemRemoved || someItemAdded;
    }
}
