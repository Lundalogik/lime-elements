import { Component, Prop, h, Element, Host, State, Watch } from '@stencil/core';
import { InfoTileProgress } from '../info-tile/info-tile.types';
import { Link } from '../../global/shared-types/link.types';
import { getMouseEventHandlers } from '../../util/3d-tilt-hover-effect';
import { clickOnEnterOrSpace } from '../../util/click-on-enter-or-space';
import { getRel, hasUnsafeProtocol } from '../../util/link-helper';

/**
 * This component can be used on places such as a start page or a dashboard.
 * It offers features for visualizing aggregated data along with supplementary
 * information.
 *
 * If clicking on the component should navigate the user to
 * a new screen or web page, you need to provide a URL,
 * using the `link` property.
 *
 * @exampleComponent limel-example-info-tile-basic
 * @exampleComponent limel-example-info-tile-badge
 * @exampleComponent limel-example-info-tile-progress
 * @exampleComponent limel-example-info-tile-loading
 * @exampleComponent limel-example-info-tile-primary-slot
 * @exampleComponent limel-example-info-tile-clickable
 * @exampleComponent limel-example-info-tile-styling
 * @exampleComponent limel-example-info-tile-reduced-presence
 */
@Component({
    tag: 'limel-info-tile',
    shadow: true,
    styleUrl: 'info-tile.scss',
})
export class InfoTile {
    /**
     * A piece of text or number that is the main piece of information
     * which the component is intended to visualize.
     */
    @Prop({ reflect: true })
    public value: number | string;

    /**
     * Name of icon for the info tile.
     */
    @Prop()
    public icon?: string;

    /**
     * The text to show below the info tile. Long labels will be truncated.
     */
    @Prop({ reflect: true })
    public label?: string = null;

    /**
     * A string of text that is visually placed before the value.
     */
    @Prop({ reflect: true })
    public prefix?: string;

    /**
     * A string of text that is visually placed after the value.
     */
    @Prop({ reflect: true })
    public suffix?: string;

    /**
     * Set to `true` if info tile is disabled.
     */
    @Prop({ reflect: true })
    public disabled? = false;

    /**
     * Set to `true` to render the tile with a reduced visual presence —
     * lower saturation and opacity, so the tile draws less attention.
     */
    @Prop({ reflect: true })
    public reducedPresence? = false;

    /**
     * If supplied, the info tile will display a notification badge.
     */
    @Prop({ reflect: true })
    public badge?: number | string;

    /**
     * Set to `true` to put the component in the `loading` state.
     * This does _not_ disable the link. To do so, the
     * `disabled` property should be set to `true` as well.
     */
    @Prop({ reflect: true })
    public loading? = false;

    /**
     * If supplied, the info tile will be a clickable link.
     *
     * Supplying a value also adds an elevated effect using a shadow,
     * as well as `cursor: pointer`, which appears on hover.
     * If the tile should act on a click but there is no URL to go to,
     * set `clickable` instead.
     *
     * An `href` that can run a script, such as one with the protocol
     * `javascript:`, is ignored, and the tile is then not a link.
     */
    @Prop()
    public link?: Link;

    /**
     * Set to `true` if the tile should act on a click, but has no URL to
     * navigate to. For instance, when a click opens a dialog.
     * Listen for the `click` event on the tile itself.
     *
     * The tile then gets the same interactive styling as a tile with a
     * `link`: a resting shadow, `cursor: pointer`, and on hover the
     * elevation, the tilt that follows the cursor, and the glow.
     * It can also be reached with the keyboard, where it is announced as
     * a button, and pressing `Enter` or `Space` clicks it.
     *
     * Has no effect when a `link` is supplied, since the tile then is a
     * link. Prefer a `link` whenever there is somewhere to go.
     */
    @Prop({ reflect: true })
    public clickable? = false;

    /**
     * Properties of the optional circular progress bar.
     *
     * Defaults:
     * - `maxValue`: 100
     * - `suffix`: %
     * - `displayPercentageColors`: false
     *
     * Colors change with intervals of 10 %.
     */
    @Prop()
    public progress?: InfoTileProgress;

    @Element()
    private host: HTMLElement;

    /**
     * `true` when something is assigned to the `primary` slot
     */
    @State()
    private hasPrimarySlot = false;

    private handleMouseEnter: () => void;
    private handleMouseLeave: () => void;
    private cleanup3dHoverEffect?: () => void;
    private hrefWarnedAbout?: string;

    public componentWillLoad() {
        this.warnAboutUnsafeHref();
        const { handleMouseEnter, handleMouseLeave, cleanup } =
            getMouseEventHandlers(this.host);
        this.handleMouseEnter = handleMouseEnter;
        this.handleMouseLeave = handleMouseLeave;
        this.cleanup3dHoverEffect = cleanup;
        this.updateHasPrimarySlotContent();
    }

    public disconnectedCallback() {
        this.cleanup3dHoverEffect?.();
    }

    public render() {
        const extendedAriaLabel =
            this.checkProps(this?.prefix) +
            this.value +
            ' ' +
            this.checkProps(this?.suffix) +
            this.checkProps(this?.label) +
            '. ' +
            this.checkProps(this?.progress?.prefix) +
            this.checkProps(this?.progress?.value) +
            this.checkProps(this?.progress?.suffix) +
            this.checkProps(this?.link?.title);

        const hasLink = !!this.getSafeHref();
        const isClickable = (hasLink || this.clickable) && !this.disabled;
        const actsAsButton = this.clickable && !hasLink;
        const Tag = hasLink ? 'a' : 'div';
        const linkAttributes = hasLink
            ? this.getLinkAttributes(isClickable, extendedAriaLabel)
            : {};
        const buttonAttributes = actsAsButton
            ? this.getButtonAttributes(isClickable, extendedAriaLabel)
            : {};

        return (
            <Host
                onMouseEnter={isClickable ? this.handleMouseEnter : undefined}
                onMouseLeave={this.handleMouseLeave}
                class={{ 'has-primary-slot-content': this.hasPrimarySlot }}
            >
                <Tag
                    {...linkAttributes}
                    {...buttonAttributes}
                    onClick={this.stopClickWhenDisabled}
                    aria-busy={this.loading ? 'true' : 'false'}
                    aria-live="polite"
                    class={{
                        tile: true,
                        'is-clickable': isClickable,
                    }}
                >
                    {this.renderIcon()}
                    {this.renderProgress()}
                    <slot
                        name="primary"
                        onSlotchange={this.updateHasPrimarySlotContent}
                    />
                    <div class="value-group">
                        {this.renderPrefix()}
                        <div class="value-and-suffix">
                            {this.renderValue()}
                            {this.renderSuffix()}
                        </div>
                        {this.renderSpinner()}
                    </div>
                    {this.renderLabel()}
                    {isClickable && <limel-3d-hover-effect-glow />}
                </Tag>
                {this.renderNotification()}
            </Host>
        );
    }

    private getLinkAttributes(isClickable: boolean, ariaLabel: string) {
        return {
            title: this.link.title,
            href: this.disabled ? undefined : this.getSafeHref(),
            role: this.disabled ? 'link' : undefined,
            target: this.link.target,
            rel: getRel(this.link.target, this.link.rel),
            tabindex: isClickable ? 0 : undefined,
            'aria-label': ariaLabel,
            'aria-disabled': this.disabled ? 'true' : 'false',
        };
    }

    private getButtonAttributes(isClickable: boolean, ariaLabel: string) {
        return {
            role: 'button',
            tabindex: isClickable ? 0 : undefined,
            onKeyDown: isClickable ? this.handleKeyDown : undefined,
            'aria-label': ariaLabel,
            'aria-disabled': this.disabled ? 'true' : 'false',
        };
    }

    private getSafeHref(): string | undefined {
        const href = this.link?.href;
        if (href && !hasUnsafeProtocol(href)) {
            return href;
        }
    }

    // The watcher is active before the component has loaded, so without the
    // memory of the last warning, a `link` that is set right after the
    // element is created would be warned about twice.
    @Watch('link')
    protected warnAboutUnsafeHref() {
        const href = this.link?.href;
        const unsafeHref = href && hasUnsafeProtocol(href) ? href : undefined;
        if (unsafeHref === this.hrefWarnedAbout) {
            return;
        }

        this.hrefWarnedAbout = unsafeHref;
        if (!unsafeHref) {
            return;
        }

        console.warn(
            'limel-info-tile: the `href` of the `link` is ignored, because it is not a string, or because a URL with its protocol can run a script.'
        );
    }

    private checkProps(propValue) {
        return propValue ? propValue + ' ' : '';
    }

    private renderPrefix = () => {
        if (this.prefix) {
            return <span class="prefix">{this.prefix}</span>;
        }
    };

    private renderValue = () => {
        if (!this.value && this.loading) {
            return <span class="value">···</span>;
        }

        if (!this.value) {
            return;
        }

        const characterCount = this.value.toString().length;

        return (
            <span
                class={{
                    value: true,
                    [`ch-${characterCount}`]: true,
                }}
            >
                {this.value}
            </span>
        );
    };

    private renderSuffix = () => {
        if (this.suffix) {
            return <span class="suffix">{this.suffix}</span>;
        }
    };

    private renderIcon = () => {
        if (this.icon) {
            return <limel-icon class="icon" name={this.icon} />;
        }
    };

    private readonly stopClickWhenDisabled = (event: MouseEvent) => {
        if (!this.disabled) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();
    };

    private readonly handleKeyDown = (event: KeyboardEvent) => {
        clickOnEnterOrSpace(event, this.host);
    };

    private updateHasPrimarySlotContent = (e?: Event) => {
        const slot =
            (e?.target as HTMLSlotElement) ??
            this.host.shadowRoot.querySelector('slot[name="primary"]');
        this.hasPrimarySlot = slot && slot.assignedElements().length > 0;
    };

    private renderProgress = () => {
        if (this.hasPrimarySlot) {
            return;
        }

        if (!this.progress?.value && this.progress?.value !== 0) {
            return;
        }

        return (
            <limel-circular-progress
                class="progress"
                prefix={this.progress.prefix}
                value={this.progress.value}
                suffix={this.progress.suffix}
                maxValue={this.progress.maxValue}
                displayPercentageColors={this.progress.displayPercentageColors}
            />
        );
    };

    private renderLabel = () => {
        if (this.label) {
            return <span class="label">{this.label}</span>;
        }
    };

    private renderNotification = () => {
        if (this.badge) {
            return (
                <limel-badge
                    label={this.badge}
                    onClick={this.stopClickWhenDisabled}
                />
            );
        }
    };

    private renderSpinner = () => {
        if (this.loading) {
            return <limel-linear-progress indeterminate={true} />;
        }
    };
}
