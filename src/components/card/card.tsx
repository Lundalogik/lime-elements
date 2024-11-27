import {
    Component,
    h,
    Prop,
    Event,
    EventEmitter,
    Element,
    Host,
} from '@stencil/core';
import { Image } from '../../global/shared-types/image.types';
import { Icon } from '../../global/shared-types/icon.types';
import { isItem } from '../action-bar/isItem';
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
 * @beta
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
    public icon?: string | Icon;

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

    @Element()
    private host: HTMLElement;

    private handleMouseEnter: () => void;
    private handleMouseLeave: () => void;

    public componentWillLoad() {
        const { handleMouseEnter, handleMouseLeave } = getMouseEventHandlers(
            this.host,
        );
        this.handleMouseEnter = handleMouseEnter;
        this.handleMouseLeave = handleMouseLeave;
    }

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
                    <div class="limel-3d-hover-effect-glow" />
                </section>
            </Host>
        );
    }

    private renderImage() {
        if (!this.image) {
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
            typeof this.icon !== 'string' ? this.icon?.color : undefined;

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

        return <h1>{this.heading}</h1>;
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
        return <limel-markdown value={this.value} />;
    }

    private handleActionSelect = (
        event: CustomEvent<ActionBarItem | ListSeparator>,
    ) => {
        event.stopPropagation();
        if (isItem(event.detail)) {
            this.actionSelected.emit(event.detail);
        }
    };

    private renderActionBar() {
        if (!this.actions.length) {
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
