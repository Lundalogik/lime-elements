import {
    Component,
    Element,
    Event,
    EventEmitter,
    h,
    Host,
    Prop,
} from '@stencil/core';
import { Icon } from '../../global/shared-types/icon.types';
import { Languages } from '../date-picker/date.types';
import { Link } from '../../global/shared-types/link.types';
import { getRel } from '../../util/link-helper';
import { getIconName } from '../icon/get-icon-props';
import {
    makeEnterClickable,
    removeEnterClickable,
} from '../../util/make-enter-clickable';
import translate from '../../global/translations';
import { BACKSPACE, DELETE } from '../../util/keycodes';
import { ChipType, Chip as OldChipInterface } from '../chip-set/chip.types';
import { Image } from '../../global/shared-types/image.types';
import { isEmpty } from 'lodash-es';

import { ListSeparator } from '../list/list-item.types';
import { LimelMenuCustomEvent, MenuItem } from '../../components';

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
 * @exampleComponent limel-example-chip-button
 * @exampleComponent limel-example-chip-link
 * @exampleComponent limel-example-chip-icon-colors
 * @exampleComponent limel-example-chip-image
 * @exampleComponent limel-example-chip-badge
 * @exampleComponent limel-example-chip-filter
 * @exampleComponent limel-example-chip-removable
 * @exampleComponent limel-example-chip-menu
 * @exampleComponent limel-example-chip-loading
 * @exampleComponent limel-example-chip-progress
 * @exampleComponent limel-example-chip-readonly-border
 * @exampleComponent limel-example-chip-aria-role
 */
@Component({
    tag: 'limel-chip',
    shadow: { delegatesFocus: true },
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
     * A picture to be displayed instead of the icon on the chip.
     */
    @Prop()
    public image?: Image;

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
     * Set to `true` to visualize the chip in an "invalid" or "error" state.
     */
    @Prop({ reflect: true })
    public invalid = false;

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
     * Set to `true` to put the component in the `loading` state,
     * and render an indeterminate progress indicator inside the chip.
     * This does _not_ disable the interactivity of the chip!
     */
    @Prop({ reflect: true })
    public loading? = false;

    /**
     * Reflects the current value of a progress bar on the chip,
     * visualizing the percentage of an ongoing process.
     * Must be a number between `0` and `100`.
     */
    @Prop({ reflect: true })
    public progress?: number;

    /**
     * Identifier for the chip. Must be unique.
     */
    @Prop({ reflect: true })
    public identifier?: number | string = crypto.randomUUID();

    /**
     * When provided, the chip will render an ellipsis menu with the supplied items.
     * Also, this will hide the "remove button" when `removable={true}`, as
     * the remove button will automatically become the last item in the menu.
     */
    @Prop()
    public menuItems?: Array<MenuItem | ListSeparator> = [];

    /**
     * Fired when clicking on the remove button of a `removable` chip.
     * The value of `identifier` is emitted as the event detail.
     */
    @Event()
    public remove: EventEmitter<number | string>;

    /**
     * Emitted when a menu item is selected from the actions menu.
     */
    @Event()
    public menuItemSelected: EventEmitter<MenuItem>;

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
                aria-busy={this.loading ? 'true' : 'false'}
                aria-live="polite"
                onKeyDown={this.handleDeleteKeyDown}
            >
                {this.renderSpinner()}
                {this.renderPicture()}
                {this.renderLabel()}
                {this.renderBadge()}
                {this.renderProgressBar()}
            </button>,
            this.renderRemoveButton(),
            this.renderActionsMenu(),
        ];
    };

    private renderAsLink = () => {
        const rel = getRel(this.link?.target, this.link?.rel);

        return [
            <a
                id={'chip-' + this.identifier}
                class="chip"
                href={this.link.href}
                title={this.link.title}
                target={this.link.target}
                rel={rel}
                aria-disabled={this.disabled || this.readonly}
                tabindex={this.disabled || this.readonly ? -1 : 0}
                onKeyDown={this.handleDeleteKeyDown}
            >
                {this.renderSpinner()}
                {this.renderPicture()}
                {this.renderLabel()}
                {this.renderBadge()}
                {this.renderProgressBar()}
            </a>,
            this.renderRemoveButton(),
            this.renderActionsMenu(),
        ];
    };

    private renderLabel = () => {
        return <span class="text">{this.text}</span>;
    };

    private renderPicture() {
        const icon = getIconName(this.icon);

        if (!icon && !this.image) {
            return;
        }

        if (!isEmpty(this.image)) {
            return (
                <img src={this.image.src} alt={this.image.alt} loading="lazy" />
            );
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
        if (
            !this.removable ||
            this.readonly ||
            this.disabled ||
            !!this.menuItems?.length
        ) {
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

    private renderActionsMenu() {
        if (!this.menuItems?.length) {
            return;
        }

        const svgData =
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" xml:space="preserve"><circle fill="currentColor" cx="16" cy="16" r="2"/><circle fill="currentColor" cx="16" cy="24" r="2"/><circle fill="currentColor" cx="16" cy="8" r="2"/></svg>';

        const menuItems = this.getMenuItems();

        return (
            <limel-menu
                items={menuItems}
                onSelect={this.handleActionMenuSelect}
                openDirection="bottom-end"
                onCancel={this.handleActionMenuCancel}
            >
                <button
                    slot="trigger"
                    disabled={this.disabled}
                    class="trailing-button"
                    aria-label={this.actionMenuLabel}
                    innerHTML={svgData}
                />
            </limel-menu>
        );
    }

    private getMenuItems() {
        let menuItems = [...this.menuItems];

        if (this.removable) {
            menuItems = [
                ...menuItems,
                { separator: true },
                {
                    text: this.removeChipLabel(),
                    icon: {
                        name: 'delete_sign',
                        color: 'rgb(var(--color-red-default))',
                    },
                    value: '_remove',
                },
            ];
        }

        return menuItems;
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

        if (keys.includes(event.key)) {
            this.handleRemoveClick(event);
        }
    };

    private removeChipLabel = (): string => {
        return translate.get('remove', this.language) + ' ' + this.text;
    };

    private actionMenuLabel = (): string => {
        return translate.get('file-viewer.more-actions', this.language);
    };

    private renderSpinner() {
        if (!this.loading) {
            return;
        }

        return <limel-linear-progress indeterminate={true} />;
    }

    private renderProgressBar() {
        if (!this.progress) {
            return;
        }

        const currentPercentage = this.progress + '%';

        return (
            <div
                role="progressbar"
                aria-label="%"
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow={this.progress}
                style={{
                    '--limel-chip-progress-percentage': currentPercentage,
                }}
            />
        );
    }

    private handleActionMenuSelect = (
        event: LimelMenuCustomEvent<MenuItem>,
    ) => {
        const menuItem = event.detail;

        if (!menuItem) {
            return;
        }

        if (menuItem.value === '_remove') {
            this.remove.emit(this.identifier);

            return;
        }

        this.menuItemSelected.emit(menuItem);
    };

    private handleActionMenuCancel = (event: LimelMenuCustomEvent<void>) => {
        event.stopPropagation();
    };
}
