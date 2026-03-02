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
import { ENTER, SPACE } from '../../util/keycodes';
import { LimelHotkeyTriggerDetail } from '../hotkey/hotkey.types';
import {
    normalizeHotkeyString,
    tokenizeHotkeyString,
} from '../../util/hotkeys';
import { isMultiple } from '../../util/multiple';
import { createRandomString } from '../../util/random-string';
import { SelectTemplate, triggerIconColorWarning } from './select.template';

/**
 * @exampleComponent limel-example-select
 * @exampleComponent limel-example-select-with-icons
 * @exampleComponent limel-example-select-with-separators
 * @exampleComponent limel-example-select-with-secondary-text
 * @exampleComponent limel-example-select-multiple
 * @exampleComponent limel-example-select-multiple-icons
 * @exampleComponent limel-example-select-with-empty-option
 * @exampleComponent limel-example-select-preselected
 * @exampleComponent limel-example-select-change-options
 * @exampleComponent limel-example-select-hotkeys
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
    private checkValid: boolean = false;
    private mdcSelectHelperText: MDCSelectHelperText;
    private mdcFloatingLabel: MDCFloatingLabel;
    private isMobileDevice: boolean;
    private portalId: string;
    private surface: HTMLLimelMenuSurfaceElement;
    private normalizedHotkeyCache = new Map<string, string | null>();

    constructor() {
        this.handleMenuChange = this.handleMenuChange.bind(this);
        this.handleNativeChange = this.handleNativeChange.bind(this);
        this.handleMenuTriggerKeyPress =
            this.handleMenuTriggerKeyPress.bind(this);
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
                onTriggerPress={this.handleMenuTriggerKeyPress}
                setMenuSurfaceRef={this.setMenuSurfaceElement}
                multiple={this.multiple}
                isOpen={this.menuOpen}
                open={this.openMenu}
                close={this.closeMenu}
                checkValid={this.checkValid}
                native={this.isMobileDevice}
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

    @Watch('options')
    protected watchOptions() {
        this.normalizedHotkeyCache.clear();
    }

    private readonly setMenuSurfaceElement = (
        element: HTMLLimelMenuSurfaceElement
    ) => {
        if (this.surface) {
            this.surface.removeEventListener(
                'hotkeyTrigger',
                this.handleHotkeyTrigger,
                false
            );
        }

        this.surface = element;

        if (this.surface) {
            this.surface.addEventListener(
                'hotkeyTrigger',
                this.handleHotkeyTrigger,
                false
            );
        }
    };

    private setMenuFocus() {
        if (this.isMobileDevice) {
            return;
        }

        requestAnimationFrame(() => {
            const list: HTMLElement = document.querySelector(
                `#${this.portalId} limel-menu-surface limel-list`
            );
            const firstItem: HTMLElement =
                list?.shadowRoot?.querySelector('[tabindex]');

            if (firstItem) {
                firstItem.focus();
            }
        });
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
        this.setTriggerFocus();
    }

    private handleHotkeyTrigger = (
        event: CustomEvent<LimelHotkeyTriggerDetail>
    ) => {
        if (this.isMobileDevice || !this.menuOpen) {
            return;
        }

        const pressedHotkey = event.detail?.hotkey;
        if (!pressedHotkey || this.isReservedSelectHotkey(pressedHotkey)) {
            return;
        }

        const matchedOption = this.findOptionByHotkey(pressedHotkey);
        if (!matchedOption || matchedOption.disabled) {
            return;
        }

        event.stopPropagation();
        event.detail.keyboardEvent.stopPropagation();
        event.detail.keyboardEvent.preventDefault();

        if (this.multiple) {
            const currentValue = isMultiple(this.value) ? this.value : [];
            const hasSelectedOption = currentValue.some(
                (option) => option.value === matchedOption.value
            );

            const nextValue = hasSelectedOption
                ? currentValue.filter(
                      (option) => option.value !== matchedOption.value
                  )
                : [...currentValue, matchedOption];

            this.change.emit(nextValue);

            return;
        }

        this.change.emit(matchedOption);
        this.menuOpen = false;
        this.setTriggerFocus();
    };

    private isReservedSelectHotkey(hotkey: string): boolean {
        const tokens = tokenizeHotkeyString(hotkey);
        const key = tokens.at(-1);
        if (!key) {
            return false;
        }

        if (
            key === 'arrowup' ||
            key === 'arrowdown' ||
            key === 'arrowleft' ||
            key === 'arrowright'
        ) {
            return true;
        }

        if (key === 'tab') {
            return true;
        }

        const hasModifiers = tokens.length > 1;
        return (
            !hasModifiers &&
            (key === 'enter' || key === 'space' || key === 'escape')
        );
    }

    private findOptionByHotkey(pressedHotkey: string): Option | null {
        for (const option of this.getOptionsExcludingSeparators()) {
            if (option.disabled || !option.hotkey) {
                continue;
            }

            const normalized = this.getNormalizedHotkey(option.hotkey);
            if (normalized && normalized === pressedHotkey) {
                return option;
            }
        }

        return null;
    }

    private getNormalizedHotkey(raw: string): string | null {
        const cacheKey = raw.trim();
        if (this.normalizedHotkeyCache.has(cacheKey)) {
            return this.normalizedHotkeyCache.get(cacheKey) ?? null;
        }

        const normalized = normalizeHotkeyString(cacheKey);
        this.normalizedHotkeyCache.set(cacheKey, normalized);

        return normalized;
    }

    private openMenu() {
        if (this.emitFirstChangeEvent()) {
            this.hasChanged = true;
            this.change.emit(this.getOptionsExcludingSeparators()[0]);
        }

        this.menuOpen = true;
    }

    private emitFirstChangeEvent() {
        return !this.hasChanged && this.isMobileDevice && !this.value;
    }

    private closeMenu() {
        this.menuOpen = false;
        this.setTriggerFocus();
    }

    private handleMenuTriggerKeyPress(event: KeyboardEvent) {
        const isEnter = event.key === ENTER;
        const isSpace = event.key === SPACE;

        if (!this.menuOpen && (isSpace || isEnter)) {
            event.stopPropagation();
            event.preventDefault();
            this.menuOpen = true;
        }
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
}
