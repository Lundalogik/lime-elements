import { ListItem, ListSeparator } from '../list-item/list-item.types';
import { Option } from '../select/option.types';
import { MDCFloatingLabel } from '@material/floating-label';
import { MDCSelectHelperText } from '@material/select/helper-text';
import {
    Component,
    Element,
    Event,
    EventEmitter,
    h,
    Prop,
    State,
    Watch,
} from '@stencil/core';
import { isMobileDevice } from '../../util/device';
import { ENTER, SPACEBAR } from '../../util/keycodes';
import { isMultiple } from '../../util/multiple';
import { createRandomString } from '../../util/random-string';
import {
    findTypeaheadMatch,
    isTypeaheadKey,
    NO_TYPEAHEAD_MATCH,
    TypeaheadBuffer,
    TypeaheadCandidate,
} from '../../util/typeahead';
import {
    createMenuItems,
    SelectTemplate,
    triggerIconColorWarning,
} from './select.template';

/**
 * ## Keyboard
 *
 * Typing characters jumps to the option whose text starts with them, the way
 * a native `<select>` does. Characters accumulate for a short while, so typing
 * `n`, `e` finds "Netherlands" rather than the next option starting with `n`.
 * Pressing the same character repeatedly cycles through all options starting
 * with it. This works both while the dropdown is open, and while the closed
 * component has focus — in which case the dropdown opens with the match
 * highlighted. Typing only moves the highlight; the value is not changed until
 * the option is picked with `Enter` or a click.
 *
 * @exampleComponent limel-example-select-basic
 * @exampleComponent limel-example-select-with-icons
 * @exampleComponent limel-example-select-with-separators
 * @exampleComponent limel-example-select-with-secondary-text
 * @exampleComponent limel-example-select-multiple
 * @exampleComponent limel-example-select-multiple-icons
 * @exampleComponent limel-example-select-with-primary-component
 * @exampleComponent limel-example-select-with-empty-option
 * @exampleComponent limel-example-select-preselected
 * @exampleComponent limel-example-select-change-options
 * @exampleComponent limel-example-select-dialog
 */
@Component({
    tag: 'limel-select',
    shadow: true,
    styleUrl: 'select.scss',
})
export class Select {
    /**
     * Set to `true` to make the field disabled.
     * and visually shows that the `select` component is editable but disabled.
     * This tells the users that if certain requirements are met,
     * the component may become interactable.
     */
    @Prop({ reflect: true })
    public disabled = false;

    /**
     * Set to `true` to make the field read-only.
     * This visualizes the component slightly differently.
     * But shows no visual sign indicating that the component is disabled
     * or can ever become interactable.
     */
    @Prop({ reflect: true })
    public readonly = false;

    /**
     * Set to `true` to indicate that the current value of the select is
     * invalid.
     */
    @Prop({ reflect: true })
    public invalid: boolean;

    /**
     * True if the control requires a value.
     */
    @Prop({ reflect: true })
    public required = false;

    /**
     * Text to display next to the select.
     */
    @Prop({ reflect: true })
    public label: string;

    /**
     * Optional helper text to display below the input field when it has focus.
     */
    @Prop({ reflect: true })
    public helperText: string;

    /**
     * Currently selected value or values.
     * If `multiple` is `true`, this must be an array. Otherwise it must be a
     * single value.
     */
    @Prop()
    public value: Option | Option[];

    /**
     * List of options.
     */
    @Prop()
    public options: Array<Option | ListSeparator> = [];

    /**
     * Set to `true` to allow multiple values to be selected.
     */
    @Prop()
    public multiple: boolean = false;

    /**
     * Emitted when the value is changed.
     */
    @Event()
    private change: EventEmitter<Option | Option[]>;

    @Element()
    private host: HTMLLimelSelectElement;

    @State()
    private menuOpen: boolean = false;

    private hasChanged: boolean = false;

    private hasPrimaryComponentMemo: boolean = false;

    @Watch('value')
    @Watch('options')
    protected resetHasChanged() {
        this.hasChanged = false;
    }

    @Watch('options')
    protected updateHasPrimaryComponent() {
        this.hasPrimaryComponentMemo = this.computeHasPrimaryComponent();
    }

    /**
     * `options` and `required` are the inputs that decide which rows the
     * dropdown renders, and therefore which row an index refers to. When
     * either changes, a buffered typeahead match no longer points at what the
     * user was aiming for.
     */
    @Watch('options')
    @Watch('required')
    protected resetTypeaheadOnItemsChange() {
        this.resetTypeahead();
    }

    private checkValid: boolean = false;
    private mdcSelectHelperText: MDCSelectHelperText;
    private mdcFloatingLabel: MDCFloatingLabel;
    private isMobileDevice: boolean;
    private portalId: string;
    private focusObserver: IntersectionObserver;
    private focusTimeoutId: ReturnType<typeof setTimeout>;

    private readonly typeaheadBuffer = new TypeaheadBuffer();

    /**
     * The row a typeahead match wants to focus, when it could not be focused
     * right away — because the dropdown had not opened or rendered yet. It is
     * consumed by `setMenuFocus`, once focus is about to land in the menu.
     */
    private pendingTypeaheadIndex: number | undefined;

    private list: HTMLLimelListElement;

    constructor() {
        this.handleMenuChange = this.handleMenuChange.bind(this);
        this.handleNativeChange = this.handleNativeChange.bind(this);
        this.openMenu = this.openMenu.bind(this);
        this.closeMenu = this.closeMenu.bind(this);

        this.portalId = createRandomString();
    }

    public connectedCallback() {
        this.initialize();
    }

    public componentWillLoad() {
        this.isMobileDevice = isMobileDevice();

        // It should not be possible to render the native select for consumers, but we still want to make it testable.
        // We can set this attribute in tests to force rendering of the native select
        if (Object.hasOwn(this.host.dataset, 'native')) {
            this.isMobileDevice = true;
        }

        this.hasPrimaryComponentMemo = this.computeHasPrimaryComponent();
    }

    public componentDidLoad() {
        this.initialize();
        triggerIconColorWarning(this.getOptionsExcludingSeparators());
        this.updatePortalAnchor();
    }

    private initialize() {
        let element: HTMLElement;
        element = this.host.shadowRoot.querySelector('.mdc-floating-label');
        if (!element) {
            return;
        }

        this.mdcFloatingLabel = new MDCFloatingLabel(element);

        element = this.host.shadowRoot.querySelector('.mdc-select-helper-text');
        if (element) {
            this.mdcSelectHelperText = new MDCSelectHelperText(element);
        }
    }

    public disconnectedCallback() {
        this.cancelPendingFocus();
        this.resetTypeahead();

        if (this.mdcFloatingLabel) {
            this.mdcFloatingLabel.destroy();
        }

        if (this.mdcSelectHelperText) {
            this.mdcSelectHelperText.destroy();
        }
    }

    public componentDidUpdate() {
        if (this.menuOpen) {
            this.setMenuFocus();
        }
    }

    public render() {
        const dropdownZIndex = getComputedStyle(this.host).getPropertyValue(
            '--dropdown-z-index'
        );

        return (
            <SelectTemplate
                id={this.portalId}
                disabled={this.disabled || this.readonly}
                readonly={this.readonly}
                required={this.required}
                invalid={this.invalid}
                label={this.label}
                helperText={this.helperText}
                value={this.value}
                options={this.options}
                onMenuChange={this.handleMenuChange}
                onNativeChange={this.handleNativeChange}
                onTriggerKeyDown={this.handleMenuTriggerKeyDown}
                listRef={this.setListElement}
                multiple={this.multiple}
                isOpen={this.menuOpen}
                open={this.openMenu}
                close={this.closeMenu}
                checkValid={this.checkValid}
                native={this.shouldRenderNative()}
                dropdownZIndex={dropdownZIndex}
                anchor={this.getAnchorElement()}
            />
        );
    }

    @Watch('menuOpen')
    protected watchOpen(newValue: boolean, oldValue: boolean) {
        if (this.checkValid) {
            return;
        }

        // Menu was closed for the first time
        if (!newValue && oldValue) {
            this.checkValid = true;
        }
    }

    private setMenuFocus() {
        if (this.isMobileDevice) {
            return;
        }

        this.cancelPendingFocus();

        this.focusTimeoutId = setTimeout(() => {
            this.focusTimeoutId = undefined;

            if (!this.menuOpen) {
                return;
            }

            const list: HTMLElement = document.querySelector(
                `#${this.portalId} limel-menu-surface limel-list`
            );

            if (!list) {
                return;
            }

            this.focusObserver = new IntersectionObserver((entries) => {
                const entry = entries[0];
                if (!entry?.isIntersecting) {
                    return;
                }

                this.focusObserver.disconnect();
                this.focusObserver = undefined;

                if (!this.menuOpen) {
                    return;
                }

                // Consumed on read, so that a later, unrelated re-render
                // cannot resurrect a stale index and yank focus.
                const typeaheadIndex = this.pendingTypeaheadIndex;
                this.pendingTypeaheadIndex = undefined;

                if (
                    typeaheadIndex !== undefined &&
                    this.focusMenuItemAtIndex(list, typeaheadIndex)
                ) {
                    return;
                }

                // Picking an option while `multiple` re-renders the dropdown
                // without closing it, which brings us back here with a row
                // already focused. Moving to the first option then would lose
                // the user's place in the list after every pick.
                if (this.getFocusedMenuItemIndex() !== NO_TYPEAHEAD_MATCH) {
                    return;
                }

                this.focusFirstMenuItem(list);
            });
            this.focusObserver.observe(list);
        }, 0);
    }

    private cancelPendingFocus() {
        if (this.focusTimeoutId !== undefined) {
            clearTimeout(this.focusTimeoutId);
            this.focusTimeoutId = undefined;
        }

        if (this.focusObserver) {
            this.focusObserver.disconnect();
            this.focusObserver = undefined;
        }
    }

    private focusFirstMenuItem(list: HTMLElement) {
        const firstItem: HTMLElement =
            list?.shadowRoot?.querySelector('[tabindex]');

        if (firstItem) {
            firstItem.focus({ preventScroll: true });
        }
    }

    /**
     * Focus the row at a given index in the dropdown.
     *
     * The rows only become focusable once `limel-list` has set up `MDCList`,
     * which is what gives them a `tabindex`. Callers use the return value to
     * fall back to `pendingTypeaheadIndex` when that has not happened yet.
     *
     * @param list - the `limel-list` of the dropdown
     * @param index - the index of the row, as rendered in its `data-index`
     * @returns whether the row could be focused
     */
    private focusMenuItemAtIndex(list: HTMLElement, index: number): boolean {
        const item: HTMLElement = list?.shadowRoot?.querySelector(
            `[data-index="${index}"]`
        );

        if (!item) {
            return false;
        }

        // Scrolled explicitly, and only within the dropdown: letting `focus()`
        // scroll would scroll the page, since the dropdown is rendered into a
        // portal that is absolutely positioned on the `body`.
        item.focus({ preventScroll: true });
        item.scrollIntoView({ block: 'nearest' });

        return list.shadowRoot.activeElement === item;
    }

    private setTriggerFocus() {
        const trigger: HTMLElement = this.host.shadowRoot.querySelector(
            '.limel-select-trigger'
        );
        trigger.focus();
    }

    // During the first render(), the shadow DOM isn't populated yet, so
    // querySelector('.limel-select-trigger') returns null and we fall back
    // to this.host. componentDidLoad() calls updatePortalAnchor() to
    // imperatively refresh the anchor once the shadow DOM is available.
    private getAnchorElement(): HTMLElement {
        return (
            this.host.shadowRoot.querySelector<HTMLElement>(
                '.limel-select-trigger'
            ) ?? this.host
        );
    }

    private updatePortalAnchor() {
        const portal = this.host.shadowRoot.querySelector('limel-portal');
        if (portal) {
            portal.anchor = this.getAnchorElement();
        }
    }

    private handleMenuChange(
        event: CustomEvent<Array<ListItem<Option>> | ListItem<Option>>
    ) {
        event.stopPropagation();

        if (isMultiple(event.detail)) {
            const selector = `#${this.portalId} limel-menu-surface`;
            const menuSurface = document
                .querySelector(selector)
                ?.shadowRoot?.querySelector('.mdc-menu-surface');
            const scrollPosition = menuSurface?.scrollTop || 0;

            const listItems: ListItem[] = event.detail;
            const options: Option[] = listItems.map((item) => item.value);
            this.change.emit(options);

            // Using a single requestAnimationFrame or setTimeout doesn't
            // work. Using two nested `requestAnimationFrame` worked most of
            // the time, but not always. Using `setTimeout` inside the
            // `requestAnimationFrame` seems to work consistently. /Ads
            requestAnimationFrame(() => {
                setTimeout(() => {
                    menuSurface.scrollTop = scrollPosition;
                });
            });

            return;
        }

        if (!event.detail.selected) {
            return;
        }

        const listItem: ListItem = event.detail;
        const option: Option = listItem.value;
        if (option.disabled) {
            return;
        }

        this.change.emit(option);
        this.menuOpen = false;
        this.cancelPendingFocus();
        this.resetTypeahead();
        this.setTriggerFocus();
    }

    private openMenu() {
        const autoSelectOption = this.getFirstNativeAutoSelectOption();
        if (autoSelectOption) {
            this.hasChanged = true;
            this.change.emit(autoSelectOption);
        }

        this.menuOpen = true;
    }

    private getFirstNativeAutoSelectOption(): Option | undefined {
        if (this.hasChanged || !this.isMobileDevice || this.multiple) {
            return undefined;
        }

        const options = this.getOptionsExcludingSeparators();

        // Also treat it as "no value" when the current value doesn't match
        // any available option (e.g. an empty option that was filtered out
        // by a required field).
        const currentValue = this.value;
        const hasMatchingValue =
            currentValue &&
            !Array.isArray(currentValue) &&
            options.some((o) => o.value === currentValue.value);

        if (hasMatchingValue) {
            return undefined;
        }

        if (options.length > 0 && !options[0].value) {
            return undefined;
        }

        return options.find((o) => !o.disabled && o.value);
    }

    private closeMenu() {
        this.menuOpen = false;
        this.cancelPendingFocus();
        this.resetTypeahead();
        this.setTriggerFocus();
    }

    private readonly handleMenuTriggerKeyDown = (
        event: KeyboardEvent
    ): void => {
        // Typeahead runs first, so that a space extends an ongoing typeahead
        // instead of just opening the dropdown. A *bare* space is declined by
        // `handleTypeaheadKey`, and keeps its usual meaning below.
        if (this.handleTypeaheadKey(event, NO_TYPEAHEAD_MATCH)) {
            return;
        }

        const isEnter = event.key === ENTER;
        const isSpace = event.key === SPACEBAR;

        if (!this.menuOpen && (isSpace || isEnter)) {
            event.stopPropagation();
            event.preventDefault();

            // `preventDefault` cancels the activation click that the trigger
            // `button` would otherwise synthesize, so the menu has to be
            // opened here rather than through the click handler.
            this.openMenu();
        }
    };

    private readonly setListElement = (
        element: HTMLLimelListElement | null
    ): void => {
        if (this.list === element) {
            return;
        }

        this.list?.removeEventListener(
            'keydown',
            this.handleListKeyDownCapture,
            true
        );

        this.list = element;

        this.list?.addEventListener(
            'keydown',
            this.handleListKeyDownCapture,
            true
        );
    };

    /**
     * Key handler for the dropdown, in the capture phase.
     *
     * `MDCList` listens for `keydown` on the `ul` inside `limel-list`'s shadow
     * root, so capturing on the `limel-list` element itself is the only place
     * a typed character can be stopped before MDC sees it. It has to be
     * stopped: MDC would add it to its own typeahead buffer, which suppresses
     * selection with `Enter` for as long as that buffer lives, and it treats
     * the space bar as a selection.
     *
     * @param event - the key that was pressed
     */
    private readonly handleListKeyDownCapture = (
        event: KeyboardEvent
    ): void => {
        this.handleTypeaheadKey(event, this.getFocusedMenuItemIndex());
    };

    /**
     * Move the highlight to the option matching the characters typed so far,
     * the way a native `<select>` does. Never changes the value — the option
     * still has to be picked with `Enter` or a click.
     *
     * @param event - the key that was pressed
     * @param focusedIndex - the row that currently has focus, if any
     * @returns whether the key was handled as typeahead
     */
    private handleTypeaheadKey(
        event: KeyboardEvent,
        focusedIndex: number
    ): boolean {
        // The native dropdown on mobile devices does its own typeahead. Note
        // that `setMenuFocus` bails out on mobile too, so a pending index
        // would never be consumed there.
        if (this.isMobileDevice || !isTypeaheadKey(event)) {
            return false;
        }

        // A space only continues an ongoing typeahead. On its own it keeps its
        // usual meaning of opening the dropdown, or selecting the focused
        // option.
        if (event.key === SPACEBAR && this.typeaheadBuffer.isEmpty) {
            return false;
        }

        event.preventDefault();
        event.stopPropagation();

        // Derived per key press rather than cached, so that the indices always
        // refer to the rows the dropdown renders right now.
        const items = createMenuItems(this.options, this.value, this.required);
        const candidates: Array<TypeaheadCandidate | null> = items.map(
            (item) => ('separator' in item ? null : item)
        );

        const buffer = this.typeaheadBuffer.append(event.key);
        const currentIndex = this.resolveTypeaheadIndex(items, focusedIndex);
        const index = findTypeaheadMatch(candidates, buffer, currentIndex);

        if (index !== NO_TYPEAHEAD_MATCH) {
            this.focusTypeaheadMatch(index);
        }

        return true;
    }

    /**
     * @param items - the items of the dropdown
     * @param focusedIndex - the row that currently has focus, if any
     * @returns the index a typeahead search should start from
     */
    private resolveTypeaheadIndex(
        items: Array<ListItem<Option> | ListSeparator>,
        focusedIndex: number
    ): number {
        if (focusedIndex !== NO_TYPEAHEAD_MATCH) {
            return focusedIndex;
        }

        // Typed again before focus had time to land in the dropdown.
        if (this.pendingTypeaheadIndex !== undefined) {
            return this.pendingTypeaheadIndex;
        }

        // Falls back to the selected option, so that typing continues from
        // wherever the highlight already is. `findIndex` returning `-1` for a
        // select without a value is exactly the "no current row" that
        // `findTypeaheadMatch` expects.
        return items.findIndex(
            (item) => !('separator' in item) && item.selected
        );
    }

    private focusTypeaheadMatch(index: number): void {
        // Overwrites any index still pending from an earlier character, even
        // when this one can be focused right away. Opening the dropdown queues
        // a `setMenuFocus` that waits for it to become visible, and someone
        // typing quickly gets the next character in before that resolves;
        // leaving the earlier index in place would let the queued focus apply
        // it on top of this newer match.
        this.pendingTypeaheadIndex = index;

        if (this.menuOpen && this.focusMenuItemAtIndex(this.list, index)) {
            // Focus landed synchronously, so this index has already done its
            // job. Clearing it — rather than leaving it for `setMenuFocus` to
            // consume later — stops it from being replayed by some unrelated
            // future re-render, such as picking an option in a `multiple`
            // select, after the user has since moved focus elsewhere with the
            // arrow keys. A `setMenuFocus` still queued from opening the
            // dropdown a moment ago is unaffected: it finds this row already
            // focused and leaves it alone, below.
            this.pendingTypeaheadIndex = undefined;

            return;
        }

        if (this.menuOpen) {
            // Already open, so no re-render is coming that would trigger
            // `componentDidUpdate`. Schedule the focus explicitly.
            this.setMenuFocus();
        } else {
            this.openMenu();
        }
    }

    /**
     * @returns the index of the focused row of the dropdown, or
     * `NO_TYPEAHEAD_MATCH` when no row has focus
     */
    private getFocusedMenuItemIndex(): number {
        // Deliberately not `event.target`: a listener on the `limel-list`
        // element sees events from inside its shadow root retargeted to the
        // element itself, never to the row that was actually focused.
        const focused = this.list?.shadowRoot?.activeElement;
        const row = focused?.closest<HTMLElement>('[data-index]');
        const index = Number.parseInt(row?.dataset.index ?? '', 10);

        return Number.isNaN(index) ? NO_TYPEAHEAD_MATCH : index;
    }

    private resetTypeahead(): void {
        this.typeaheadBuffer.clear();
        this.pendingTypeaheadIndex = undefined;
    }

    private handleNativeChange(event: Event) {
        event.stopPropagation();

        const element: HTMLSelectElement = this.host.shadowRoot.querySelector(
            'select.limel-select__native-control'
        );
        const options = Array.apply(null, element.options) // eslint-disable-line prefer-spread
            .filter((optionElement: HTMLOptionElement) => {
                return !!optionElement.selected;
            })
            .map((optionElement: HTMLOptionElement) => {
                return this.getOptionsExcludingSeparators().find(
                    (o) => o.value === optionElement.value
                );
            });

        if (this.multiple) {
            this.change.emit(options);

            return;
        }

        this.change.emit(options[0]);
        this.menuOpen = false;
    }

    private getOptionsExcludingSeparators(): Option[] {
        return this.options.filter(
            (option): option is Option => !('separator' in option)
        );
    }

    private shouldRenderNative(): boolean {
        return (
            this.isMobileDevice &&
            !this.multiple &&
            !this.hasPrimaryComponentMemo
        );
    }

    private computeHasPrimaryComponent(): boolean {
        return this.getOptionsExcludingSeparators().some(
            (option) => !!option.primaryComponent?.name
        );
    }
}
