import {
    Component,
    Element,
    Event,
    EventEmitter,
    h,
    Host,
    Prop,
} from '@stencil/core';
import { Icon, Languages, Link } from '../../interface';
import { getIconName } from '../icon/get-icon-props';
import {
    makeEnterClickable,
    removeEnterClickable,
} from '../../util/make-enter-clickable';
import translate from '../../global/translations';
import {
    BACKSPACE,
    BACKSPACE_KEY_CODE,
    DELETE,
    DELETE_KEY_CODE,
} from '../../util/keycodes';
import { ChipType, Chip as OldChipInterface } from '../chip-set/chip.types';

interface ChipInterface extends Omit<OldChipInterface, 'id' | 'badge'> {
    /**
     * Identifier for the chip. Must be unique.
     */
    identifier?: number | string;

    /**
     * The value of the badge.
     */
    badge?: string | number;
}

/**
 * Chips and buttons are both interactive elements in UI design,
 * but they serve different purposes and are used in different contexts.
 *
 * :::warning
 * Do not use the chip component carelessly, as an alternative for
 * [`limel-button`](#/component/limel-button/) in the UI design!
 *
 * **Buttons:**
 * Buttons are used to trigger actions. They are typically used to
 * submit forms, open dialogs, initiate a process, or perform any action
 * that changes the state of the application.
 * Buttons' labels usually contain action words, in other words, the labels is
 * a _verb in imperative mood_ such as "Submit" or "Delete".
 * Buttons are placed in areas where it's clear they will initiate
 * an action when clicked.
 *
 * **Chips:**
 * Chips however are elements which may look like buttons, but they are
 * representing choices, filters, or tags, in a small block
 * or clearly bundled into a group. Chips are rarely used alone in the
 * user interface.
 * They are often used in a so called "chip-set", or placed together in
 * a section of the UI, where the user can expect more than one chip to be present.
 *
 * For example, a chip may represent a filter in a filter bar, or a tag in a tag list,
 * or an item in a shopping list.
 * Clicking a chip can also trigger an action, for example toggling a filter ON or OFF,
 * or opening a page with all posts tagged with the tag represented by the chip,
 * or navigating to a page with more information about the item in the shopping list.
 * :::
 *
 * @private
 * @exampleComponent limel-example-chip-button
 * @exampleComponent limel-example-chip-link
 * @exampleComponent limel-example-chip-icon-colors
 * @exampleComponent limel-example-chip-badge
 * @exampleComponent limel-example-chip-filter
 * @exampleComponent limel-example-chip-removable
 * @exampleComponent limel-example-chip-aria-role
 */
@Component({
    tag: 'limel-chip',
    shadow: true,
    styleUrl: 'chip.scss',
})
export class Chip implements ChipInterface {
    /**
     * Defines the language for translations.
     * Will translate the translatable strings on the components.
     */
    @Prop({ reflect: true })
    public language: Languages = 'en';

    /**
     * Label displayed on the chip
     */
    @Prop({ reflect: true })
    public text: string;

    /**
     * Icon of the chip.
     */
    @Prop()
    public icon?: string | Icon;

    /**
     * If supplied, the chip will become a clickable link.
     */
    @Prop()
    public link?: Omit<Link, 'text'>;

    /**
     * The value of the badge, displayed on the chip.
     */
    @Prop({ reflect: true })
    public badge?: string | number;

    /**
     * Set to `true` to disable the chip.
     */
    @Prop({ reflect: true })
    public disabled = false;

    /**
     * Set to `true` to render the chip as a static UI element.
     * Useful when the parent component has a `readonly` state.
     */
    @Prop({ reflect: true })
    public readonly = false;

    /**
     * Set to `true` to visualize the chip in a "selected" state.
     * This is typically used when the chip is used in a chip-set
     * along with other chips.
     */
    @Prop({ reflect: true })
    public selected = false;

    /**
     * Set to `true` to render a remove button on the chip.
     */
    @Prop({ reflect: true })
    public removable = false;

    /**
     * Set to `filter` to render the chip with a distinct style
     * suitable for visualizing filters.
     *
     * @beta
     */
    @Prop({ reflect: true })
    public type?: ChipType = 'default';

    /**
     * Identifier for the chip. Must be unique.
     */
    @Prop({ reflect: true })
    public identifier?: number | string = crypto.randomUUID();

    /**
     * Fired when clicking on the remove button of a `removable` chip.
     * The value of `identifier` is emitted as the event detail.
     */
    @Event()
    public remove: EventEmitter<number | string>;

    @Element()
    private host: HTMLLimelChipElement;

    public componentWillLoad() {
        makeEnterClickable(this.host);
    }

    public disconnectedCallback() {
        removeEnterClickable(this.host);
    }

    public render() {
        return (
            <Host onClick={this.filterClickWhenDisabled}>
                {this.link ? this.renderAsLink() : this.renderAsButton()}
            </Host>
        );
    }

    private renderAsButton = () => {
        return [
            <button
                id={'chip-' + this.identifier}
                class="chip"
                role="button"
                disabled={this.disabled || this.readonly}
                onKeyDown={this.handleDeleteKeyDown}
            >
                {this.renderIcon()}
                {this.renderLabel()}
                {this.renderBadge()}
            </button>,
            this.renderRemoveButton(),
        ];
    };

    private renderAsLink = () => {
        return [
            <a
                id={'chip-' + this.identifier}
                class="chip"
                href={this.link.href}
                title={this.link.title}
                target={this.link.target}
                aria-disabled={this.disabled || this.readonly}
                tabindex={this.disabled || this.readonly ? -1 : 0}
                onKeyDown={this.handleDeleteKeyDown}
            >
                {this.renderIcon()}
                {this.renderLabel()}
                {this.renderBadge()}
            </a>,
            this.renderRemoveButton(),
        ];
    };

    private renderLabel = () => {
        return <span class="text">{this.text}</span>;
    };

    private renderIcon() {
        const icon = getIconName(this.icon);

        if (!icon) {
            return;
        }

        return (
            <limel-icon
                badge={true}
                name={icon}
                style={{
                    color: `${(this.icon as Icon)?.color}`,
                    'background-color': `${
                        (this.icon as Icon)?.backgroundColor
                    }`,
                }}
            />
        );
    }

    private renderBadge() {
        if (!this.badge) {
            return;
        }

        return <limel-badge label={this.badge} />;
    }

    private renderRemoveButton() {
        if (!this.removable || this.readonly || this.disabled) {
            return;
        }

        const svgData =
            '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="currentColor" stroke-width="2" d="m8 8 16 16M24 8 8 24"/></svg>';

        return (
            <button
                class="trailing-button remove-button"
                tabIndex={-1}
                aria-label={this.removeChipLabel}
                aria-controls={'chip-' + this.identifier}
                innerHTML={svgData}
                onClick={this.handleRemoveClick}
            />
        );
    }

    private filterClickWhenDisabled = (e) => {
        if (this.disabled || this.readonly) {
            e.preventDefault();
        }
    };

    private handleRemoveClick = (event: MouseEvent | KeyboardEvent) => {
        event.stopPropagation();
        this.remove.emit(this.identifier);
    };

    private handleDeleteKeyDown = (event: KeyboardEvent) => {
        if (!this.removable) {
            return;
        }

        const keys = [DELETE, BACKSPACE];
        const keycodes = [DELETE_KEY_CODE, BACKSPACE_KEY_CODE];

        if (keys.includes(event.key) || keycodes.includes(event.keyCode)) {
            this.handleRemoveClick(event);
        }
    };

    private removeChipLabel = (): string => {
        return translate.get('chip-set.remove-chip', this.language);
    };
}
