import {
    Component,
    h,
    Prop,
    Event,
    EventEmitter,
    Element,
    Host,
    State,
} from '@stencil/core';
import { Image } from '../../global/shared-types/image.types';
import { Icon, IconName } from '../../global/shared-types/icon.types';
import { isItem } from '../action-bar/is-item';
import { getIconName } from '../icon/get-icon-props';
import { ListSeparator } from '../../global/shared-types/separator.types';
import { ActionBarItem } from '../action-bar/action-bar.types';
import { getMouseEventHandlers } from '../../util/3d-tilt-hover-effect';

/**
 * Card is a component that displays content about a single topic,
 * in a structured way. It can contain a header, and some supporting media such
 * as an image or an icon, a body of text, or optional actions.
 *
 * @exampleComponent limel-example-card-basic
 * @exampleComponent limel-example-card-image
 * @exampleComponent limel-example-card-actions
 * @exampleComponent limel-example-card-clickable
 * @exampleComponent limel-example-card-orientation
 * @exampleComponent limel-example-card-slot
 * @exampleComponent limel-example-card-styling
 * @exampleComponent limel-example-card-scrollable-shadow
 */
@Component({
    tag: 'limel-card',
    shadow: true,
    styleUrl: 'card.scss',
})
export class Card {
    /**
     * Heading of the card,
     * to provide a short title about the context.
     */
    @Prop({ reflect: true })
    public heading?: string;

    /**
     * Subheading of the card
     * to provide a short description of the context.
     */
    @Prop({ reflect: true })
    public subheading?: string;

    /**
     * A hero image to display in the card,
     * to enrich the content with visual information.
     */
    @Prop()
    public image?: Image;

    /**
     * An icon, to display along with the heading and subheading.
     */
    @Prop({ reflect: true })
    public icon?: IconName | Icon;

    /**
     * The content of the card.
     * Supports markdown, to provide a rich text experience.
     */
    @Prop()
    public value?: string;

    /**
     * Actions to display in the card,
     * to provide the user with options to interact with the content.
     */
    @Prop()
    public actions?: Array<ActionBarItem | ListSeparator> = [];

    /**
     * When true, improve the accessibility of the component and hints the user
     * that the card can be interacted width.
     */
    @Prop({ reflect: true })
    public clickable: boolean = false;

    /**
     * The orientation of the card,
     * specially useful when the card has an image.
     */
    @Prop({ reflect: true })
    public orientation: 'landscape' | 'portrait' = 'portrait';

    /**
     * Fired when a action bar item has been clicked.
     */
    @Event()
    public actionSelected: EventEmitter<ActionBarItem>;

    @State()
    private canScrollUp: boolean = false;

    @State()
    private canScrollDown: boolean = false;

    private markdownElement?: HTMLElement;

    @Element()
    private host: HTMLElement;

    private handleMouseEnter: () => void;
    private handleMouseLeave: () => void;
    private markdownResizeObserver?: ResizeObserver;

    public componentWillLoad() {
        const { handleMouseEnter, handleMouseLeave } = getMouseEventHandlers(
            this.host
        );
        this.handleMouseEnter = handleMouseEnter;
        this.handleMouseLeave = handleMouseLeave;
    }

    public disconnectedCallback() {
        this.markdownResizeObserver?.disconnect();
        this.markdownElement?.removeEventListener(
            'scroll',
            this.checkIfScrollable
        );
    }

    public componentDidLoad() {
        this.setMarkdownElement(this.markdownElement);
    }
    private setMarkdownElement = (element?: HTMLElement) => {
        if (element === this.markdownElement) {
            return;
        }

        if (this.markdownElement) {
            this.markdownResizeObserver?.disconnect();
            this.markdownElement.removeEventListener(
                'scroll',
                this.checkIfScrollable
            );
        }

        this.markdownElement = element;

        if (!this.markdownElement) {
            return;
        }

        this.markdownResizeObserver = new ResizeObserver(
            this.checkIfScrollable
        );
        this.markdownResizeObserver.observe(this.markdownElement);
        this.markdownElement.addEventListener(
            'scroll',
            this.checkIfScrollable,
            { passive: true }
        );
        this.checkIfScrollable();
    };

    private checkIfScrollable = () => {
        if (!this.markdownElement) {
            return;
        }

        const scrollHeight = this.markdownElement.scrollHeight;
        const clientHeight = this.markdownElement.clientHeight;
        const scrollTop = this.markdownElement.scrollTop;

        const isScrollable = scrollHeight > clientHeight;

        // Use a 2px tolerance to handle sub-pixel rounding issues
        const isScrolledToBottom = scrollTop + clientHeight >= scrollHeight - 2;
        const shouldShowBottomShadow = isScrollable && !isScrolledToBottom;

        const isScrolledToTop = scrollTop <= 1;
        const shouldShowTopShadow = isScrollable && !isScrolledToTop;

        if (this.canScrollDown !== shouldShowBottomShadow) {
            this.canScrollDown = shouldShowBottomShadow;
        }

        if (this.canScrollUp !== shouldShowTopShadow) {
            this.canScrollUp = shouldShowTopShadow;
        }
    };

    public render() {
        return (
            <Host
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
            >
                <section tabindex={this.clickable ? 0 : ''}>
                    {this.renderImage()}
                    <div class="body">
                        {this.renderHeader()}
                        {this.renderSlot()}
                        {this.renderValue()}
                        {this.renderActionBar()}
                    </div>
                    <limel-3d-hover-effect-glow />
                </section>
            </Host>
        );
    }

    private renderImage() {
        if (!this.image?.src) {
            return;
        }

        return <img src={this.image.src} alt={this.image.alt} loading="lazy" />;
    }

    private renderHeader() {
        if (!this.heading && !this.subheading && !this.icon) {
            return;
        }

        return (
            <header>
                {this.renderIcon()}
                <div class="headings">
                    {this.renderHeading()}
                    {this.renderSubheading()}
                </div>
            </header>
        );
    }

    private renderIcon() {
        const icon = getIconName(this.icon);
        const color =
            typeof this.icon === 'string' ? undefined : this.icon?.color;

        if (!icon) {
            return;
        }

        return (
            <limel-icon
                style={{
                    color: `${color}`,
                }}
                badge={true}
                name={icon}
            />
        );
    }

    private renderHeading() {
        if (!this.heading) {
            return;
        }

        return <h1 class="title">{this.heading}</h1>;
    }

    private renderSubheading() {
        if (!this.subheading) {
            return;
        }

        return <h2>{this.subheading}</h2>;
    }

    private renderSlot() {
        return <slot name="component" />;
    }

    private renderValue() {
        if (!this.value) {
            return;
        }

        return (
            <div
                class={{
                    'markdown-wrapper': true,
                    'can-scroll-up': this.canScrollUp,
                    'can-scroll-down': this.canScrollDown,
                }}
            >
                <limel-markdown
                    class="body-text"
                    ref={this.setMarkdownElement}
                    value={this.value}
                />
            </div>
        );
    }

    private handleActionSelect = (
        event: CustomEvent<ActionBarItem | ListSeparator>
    ) => {
        event.stopPropagation();
        if (isItem(event.detail)) {
            this.actionSelected.emit(event.detail);
        }
    };

    private renderActionBar() {
        if (this.actions.length === 0) {
            return;
        }

        return (
            <limel-action-bar
                actions={this.actions}
                onItemSelected={this.handleActionSelect}
            />
        );
    }
}
