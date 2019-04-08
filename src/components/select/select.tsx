import { MDCFloatingLabel } from '@lime-material-16px/floating-label';
import { MDCLineRipple } from '@lime-material-16px/line-ripple';
import { MDCMenuSurface } from '@lime-material-16px/menu-surface';
import { MDCSelect } from '@lime-material-16px/select';
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
import { Option } from '../../interface';
import { isMobileDevice } from '../../util/device';
import {
    ENTER,
    ENTER_KEY_CODE,
    ESCAPE,
    ESCAPE_KEY_CODE,
    SPACE,
    SPACE_KEY_CODE,
} from '../../util/keycodes';
import { isMultiple } from '../../util/multiple';
import { ListItem } from '../list/list-item.types';
import { MenuSelectTemplate, NativeSelectTemplate } from './select.template';

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

    private mdcSelect: MDCSelect;
    private mdcFloatingLabel: MDCFloatingLabel;
    private mdcLineRipple: MDCLineRipple;
    private mdcMenuSurface: MDCMenuSurface;

    private isMobileDevice: boolean;

    constructor() {
        this.handleMenuChange = this.handleMenuChange.bind(this);
        this.handleNativeChange = this.handleNativeChange.bind(this);
        this.handleMenuKeyDown = this.handleMenuKeyDown.bind(this);
        this.handleMenuKeyUp = this.handleMenuKeyUp.bind(this);
        this.openMenu = this.openMenu.bind(this);
        this.closeMenu = this.closeMenu.bind(this);
    }

    public componentWillLoad() {
        this.isMobileDevice = isMobileDevice();

        // It should not be possible to render the native select for consumers, but we still want to make it testable.
        // We can set this attribute in tests to force rendering of the native select
        if (this.host.hasAttribute('native')) {
            this.isMobileDevice = true;
        }
    }

    public componentDidLoad() {
        let element: HTMLElement;
        if (!this.isMobileDevice) {
            element = this.host.shadowRoot.querySelector('.mdc-floating-label');
            this.mdcFloatingLabel = new MDCFloatingLabel(element);

            element = this.host.shadowRoot.querySelector('.mdc-line-ripple');
            this.mdcLineRipple = new MDCLineRipple(element);

            this.host.addEventListener('keydown', this.handleMenuKeyDown);
            this.host.addEventListener('keyup', this.handleMenuKeyUp);

            return;
        }

        element = this.host.shadowRoot.querySelector('.mdc-select');
        this.mdcSelect = new MDCSelect(element);

        if (!this.value) {
            element
                .querySelector('.mdc-floating-label')
                .classList.remove('mdc-floating-label--float-above');
        }
    }

    public componentDidUnload() {
        if (this.mdcSelect) {
            this.mdcSelect.destroy();
        }

        if (this.mdcFloatingLabel) {
            this.mdcFloatingLabel.destroy();
        }

        if (this.mdcLineRipple) {
            this.mdcLineRipple.destroy();
        }

        if (this.mdcMenuSurface) {
            this.mdcMenuSurface.destroy();
        }

        this.host.removeEventListener('keydown', this.handleMenuKeyDown);
        this.host.removeEventListener('keyup', this.handleMenuKeyUp);
    }

    public render() {
        if (!this.isMobileDevice) {
            return (
                <MenuSelectTemplate
                    disabled={this.disabled}
                    required={this.required}
                    label={this.label}
                    value={this.value}
                    options={this.options}
                    onChange={this.handleMenuChange}
                    multiple={this.multiple}
                    isOpen={this.menuOpen}
                    open={this.openMenu}
                    close={this.closeMenu}
                    checkValid={this.checkValid}
                />
            );
        }

        return (
            <NativeSelectTemplate
                disabled={this.disabled}
                required={this.required}
                label={this.label}
                value={this.value}
                options={this.options}
                onChange={this.handleNativeChange}
                multiple={this.multiple}
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

        const listItem: ListItem = event.detail;
        const option: Option = listItem.value;
        this.change.emit(option);
        this.menuOpen = false;
    }

    private openMenu() {
        this.menuOpen = true;
    }

    private closeMenu() {
        this.menuOpen = false;
    }

    private handleMenuKeyDown(event: KeyboardEvent) {
        const isEnter = event.key === ENTER || event.keyCode === ENTER_KEY_CODE;
        const isSpace = event.key === SPACE || event.keyCode === SPACE_KEY_CODE;

        if (isSpace || isEnter) {
            event.stopPropagation();
            event.preventDefault();
        }
    }

    private handleMenuKeyUp(event: KeyboardEvent) {
        const isEnter = event.key === ENTER || event.keyCode === ENTER_KEY_CODE;
        const isSpace = event.key === SPACE || event.keyCode === SPACE_KEY_CODE;
        const isEscape =
            event.key === ESCAPE || event.keyCode === ESCAPE_KEY_CODE;

        if (isSpace || isEnter) {
            event.stopPropagation();
            this.menuOpen = !this.menuOpen;
        }

        if (isEscape) {
            event.stopPropagation();
            this.menuOpen = false;
        }
    }

    private handleNativeChange(event: Event) {
        event.stopPropagation();

        const element: HTMLSelectElement = this.host.shadowRoot.querySelector(
            '.mdc-select select'
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
    }
}
