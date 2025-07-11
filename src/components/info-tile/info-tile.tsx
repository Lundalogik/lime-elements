import { Component, Prop, h, Element, Host, State } from '@stencil/core';
import { InfoTileProgress } from '../info-tile/info-tile.types';
import { Link } from '../../global/shared-types/link.types';
import { getMouseEventHandlers } from '../../util/3d-tilt-hover-effect';
import { getRel } from '../../util/link-helper';

/**
 * This component can be used on places such as a start page or a dashboard.
 * It offers features for visualizing aggregated data along with supplementary
 * information.
 *
 * If clicking on the component should navigate the user to
 * a new screen or web page, you need to provide a URL,
 * using the `link` property.
 *
 * @exampleComponent limel-example-info-tile
 * @exampleComponent limel-example-info-tile-badge
 * @exampleComponent limel-example-info-tile-progress
 * @exampleComponent limel-example-info-tile-loading
 * @exampleComponent limel-example-info-tile-primary-slot
 * @exampleComponent limel-example-info-tile-styling
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
     * While we strongly recommend supplying a link whenever the
     * component should act as a link, if this is not possible, and
     * you need to provide interaction through a click handler,
     * you can still get the correct styling by supplying a `Link`
     * object with the `href` property set to `'#'`.
     */
    @Prop()
    public link?: Link;

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

    public componentWillLoad() {
        const { handleMouseEnter, handleMouseLeave } = getMouseEventHandlers(
            this.host
        );
        this.handleMouseEnter = handleMouseEnter;
        this.handleMouseLeave = handleMouseLeave;
        this.updateHasPrimarySlotContent();
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

        const link = this.disabled ? '#' : this.link?.href;
        const rel = getRel(this.link?.target, this.link?.rel);

        return (
            <Host
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
                class={{ 'has-primary-slot-content': this.hasPrimarySlot }}
            >
                <a
                    title={this.link?.title}
                    href={link}
                    target={this.link?.target}
                    rel={rel}
                    tabindex="0"
                    aria-label={extendedAriaLabel}
                    aria-disabled={this.disabled}
                    aria-busy={this.loading ? 'true' : 'false'}
                    aria-live="polite"
                    class={{
                        'is-clickable': !!this.link?.href && !this.disabled,
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
                    <limel-3d-hover-effect-glow />
                </a>
                {this.renderNotification()}
            </Host>
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
        const characterCount = (this.value ?? '').toString().length;

        if (!this.value && this.loading) {
            return <span class="value">···</span>;
        }

        if (this.value) {
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
        }
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
            return <limel-badge label={this.badge} />;
        }
    };

    private renderSpinner = () => {
        if (this.loading) {
            return <limel-linear-progress indeterminate={true} />;
        }
    };
}
