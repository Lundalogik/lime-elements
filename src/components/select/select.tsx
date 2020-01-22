import { ListItem, Option } from '@limetech/lime-elements';
import { MDCFloatingLabel } from '@limetech/mdc-floating-label';
import { MDCLineRipple } from '@limetech/mdc-line-ripple';
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
import {
    ENTER,
    ENTER_KEY_CODE,
    SPACE,
    SPACE_KEY_CODE,
} from '../../util/keycodes';
import { isMultiple } from '../../util/multiple';
import { createRandomString } from '../../util/random-string';
import { SelectTemplate } from './select.template';

@Component({
    tag: 'limel-select',
    shadow: true,
    styleUrl: 'select.scss',
})
export class Select {
    /**
     * Disables the input field when `true`. Defaults to `false`.
     */
    @Prop({ reflectToAttr: true })
    public disabled = false;

    /**
     * True if the control requires a value
     */
    @Prop({ reflectToAttr: true })
    public required = false;

    /**
     * Text to display next to the select
     */
    @Prop({ reflectToAttr: true })
    public label: string;

    /**
     * Currently selected value or values (if `multiple` is set)
     */
    @Prop()
    public value: Option | Option[];

    /**
     * List of options
     */
    @Prop()
    public options: Option[] = [];

    /**
     * Set to `true` to allow multiple values to be selected. Defaults to `false`
     */
    @Prop()
    public multiple: boolean = false;

    @State()
    private menuOpen: boolean = false;

    private checkValid: boolean = false;

    /**
     * Emitted when the value is changed
     */
    @Event()
    private change: EventEmitter<Option | Option[]>;

    @Element()
    private host: HTMLElement;

    private mdcFloatingLabel: MDCFloatingLabel;
    private mdcLineRipple: MDCLineRipple;

    private isMobileDevice: boolean;

    private portalId: string;

    constructor() {
        this.handleMenuChange = this.handleMenuChange.bind(this);
        this.handleNativeChange = this.handleNativeChange.bind(this);
        this.handleMenuTriggerKeyPress = this.handleMenuTriggerKeyPress.bind(
            this
        );
        this.openMenu = this.openMenu.bind(this);
        this.closeMenu = this.closeMenu.bind(this);

        this.portalId = createRandomString();
    }

    public componentWillLoad() {
        this.isMobileDevice = isMobileDevice();

        // It should not be possible to render the native select for consumers, but we still want to make it testable.
        // We can set this attribute in tests to force rendering of the native select
        if (this.host.hasAttribute('data-native')) {
            this.isMobileDevice = true;
        }
    }

    public componentDidLoad() {
        let element: HTMLElement;
        element = this.host.shadowRoot.querySelector('.mdc-floating-label');
        this.mdcFloatingLabel = new MDCFloatingLabel(element);

        element = this.host.shadowRoot.querySelector('.mdc-line-ripple');
        this.mdcLineRipple = new MDCLineRipple(element);
    }

    public componentDidUnload() {
        if (this.mdcFloatingLabel) {
            this.mdcFloatingLabel.destroy();
        }

        if (this.mdcLineRipple) {
            this.mdcLineRipple.destroy();
        }
    }

    public componentDidUpdate() {
        if (this.menuOpen) {
            this.setMenuFocus();
        } else {
            this.setTriggerFocus();
        }
    }

    public render() {
        return (
            <SelectTemplate
                id={this.portalId}
                disabled={this.disabled}
                required={this.required}
                label={this.label}
                value={this.value}
                options={this.options}
                onMenuChange={this.handleMenuChange}
                onNativeChange={this.handleNativeChange}
                onTriggerPress={this.handleMenuTriggerKeyPress}
                multiple={this.multiple}
                isOpen={this.menuOpen}
                open={this.openMenu}
                close={this.closeMenu}
                checkValid={this.checkValid}
                native={this.isMobileDevice}
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

        setTimeout(() => {
            const list: HTMLElement = document.querySelector(
                `#${this.portalId} limel-menu-surface limel-list`
            );
            const firstItem: HTMLElement = list.shadowRoot.querySelector(
                '[tabindex]'
            );

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

    private handleMenuChange(
        event: CustomEvent<Array<ListItem<Option>> | ListItem<Option>>
    ) {
        event.stopPropagation();

        if (isMultiple(event.detail)) {
            const listItems: ListItem[] = event.detail;
            const options: Option[] = listItems.map(item => item.value);
            this.change.emit(options);

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
    }

    private openMenu() {
        this.menuOpen = true;
    }

    private closeMenu() {
        this.menuOpen = false;
    }

    private handleMenuTriggerKeyPress(event: KeyboardEvent) {
        const isEnter = event.key === ENTER || event.keyCode === ENTER_KEY_CODE;
        const isSpace = event.key === SPACE || event.keyCode === SPACE_KEY_CODE;

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
        const options = Array.apply(null, element.options)
            .filter((optionElement: HTMLOptionElement) => {
                return !!optionElement.selected;
            })
            .map((optionElement: HTMLOptionElement) => {
                return this.options.find(o => o.value === optionElement.value);
            });

        if (this.multiple) {
            this.change.emit(options);
            return;
        }

        this.change.emit(options[0]);
        this.menuOpen = false;
    }
}
