import { MDCTextField } from '@limetech/mdc-textfield';
import {
    Component,
    Element,
    Event,
    EventEmitter,
    h,
    Prop,
    State,
} from '@stencil/core';
import {
    ENTER,
    ENTER_KEY_CODE,
    SPACE,
    SPACE_KEY_CODE,
} from '../../util/keycodes';

@Component({
    tag: 'limel-input-field',
    shadow: true,
    styleUrl: 'input-field.scss',
})
export class InputField {
    /**
     * Disables the input field when `true`.
     * Defaults to `false`.
     */
    @Prop({ reflectToAttr: true })
    public disabled = false;

    /**
     * Set to `true` to indicate that the current value of the input field is
     * invalid.
     * Defaults to `false`.
     */
    @Prop({ reflectToAttr: true })
    public invalid = false;

    /**
     * The input label.
     */
    @Prop({ reflectToAttr: true })
    public label: string;

    /**
     * Set to `true` to indicate that the field is required.
     * Defaults to `false`.
     */
    @Prop({ reflectToAttr: true })
    public required = false;

    /**
     * The value of the field.
     */
    @Prop({ reflectToAttr: true })
    public value: string;

    /**
     * Trailing icon to show to the far right in the field
     */
    @Prop({ reflectToAttr: true })
    public trailingIcon: string;

    /**
     * This property determines the html-type of the field and with
     * that which keyboard to show on a mobile device.
     * Defaults to 'text'
     */
    @Prop({ reflectToAttr: true })
    public type = 'text';

    /**
     * Set to `true` to format the current value of the input field only
     * if the field is of type number.
     * The number format is determined by the current language of the browser.
     * Defaults to `true`.
     */
    @Prop({ reflectToAttr: true })
    public formatNumber = true;

    /**
     * list of suggestions `value` can autocomplete to.
     */
    @Prop()
    public completions: string[] = [];

    @State()
    private mdcTextField;

    @State()
    private isFocused: boolean = false;

    @Element()
    private limelInputField: HTMLElement;

    /**
     * Emitted when the input value is changed.
     */
    @Event()
    private change: EventEmitter<string>;

    /**
     * Emitted when the `trailingIcon` is set and the icon is interacted with
     */
    @Event()
    private action: EventEmitter<void>;

    constructor() {
        this.handleChange = this.handleChange.bind(this);
        this.handleIconKeyPress = this.handleIconKeyPress.bind(this);
        this.handleIconClick = this.handleIconClick.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
    }

    public componentDidLoad() {
        this.mdcTextField = new MDCTextField(
            this.limelInputField.shadowRoot.querySelector('.mdc-text-field')
        );
    }

    public componentDidUnload() {
        if (this.mdcTextField) {
            this.mdcTextField.destroy();
        }
    }

    public render() {
        return [
            <label
                class={`
                    mdc-text-field
                    ${this.invalid ? 'mdc-text-field--invalid' : ''}
                    ${this.disabled ? 'mdc-text-field--disabled' : ''}
                    ${this.required ? 'mdc-text-field--required' : ''}
                    ${
                        this.trailingIcon
                            ? 'mdc-text-field--with-trailing-icon'
                            : ''
                    }
                `}
            >
                {this.renderFormattedNumber()}
                <input
                    class="mdc-text-field__input"
                    onInput={this.handleChange}
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}
                    value={this.value}
                    required={this.required}
                    disabled={this.disabled}
                    type={this.type}
                    step="any"
                />
                <span
                    class={`
                        mdc-floating-label
                        ${
                            this.value || this.isFocused
                                ? 'mdc-floating-label--float-above'
                                : ''
                        }
                    `}
                >
                    {this.label}
                </span>
                {this.renderTrailingIcon()}
                <div class="mdc-line-ripple" />
            </label>,
            <div class="autocomplete-list-container">
                {this.renderDropdown()}
            </div>,
        ];
    }

    private onFocus() {
        this.isFocused = true;
    }

    private onBlur() {
        this.isFocused = false;
    }

    private renderTrailingIcon() {
        if (!this.trailingIcon) {
            return;
        }

        return (
            <i
                onKeyPress={this.handleIconKeyPress}
                onClick={this.handleIconClick}
                class="mdc-text-field__icon"
                tabindex="0"
                role="button"
            >
                <limel-icon name={this.trailingIcon} />
            </i>
        );
    }

    private renderFormattedNumber() {
        if (this.type !== 'number' || !this.value) {
            return;
        }

        const renderValue = this.formatNumber
            ? new Intl.NumberFormat(navigator.language).format(
                  Number(this.value)
              )
            : this.value;
        return (
            <span class="mdc-text-field__formatted_input">{renderValue}</span>
        );
    }

    private renderDropdown() {
        const filteredCompletions = this.filterCompletions(this.value);

        if (!filteredCompletions || filteredCompletions.length === 0) {
            return null;
        }
        return (
            this.isFocused && (
                <div class="autocomplete-list mdc-elevation-transition mdc-elevation--z4 mdc-menu-surface mdc-menu-surface--open">
                    <ul class="mdc-list">
                        {filteredCompletions.map(completion => {
                            return (
                                <li
                                    class="mdc-list-item"
                                    onMouseDown={() => { // tslint:disable-line:jsx-no-lambda prettier
                                        this.completionClickHandler(completion);
                                    }}
                                >
                                    {completion}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )
        );
    }

    private completionClickHandler(autocompletion: string) {
        this.mdcTextField.value = autocompletion;
        this.change.emit(autocompletion);
    }

    private filterCompletions = (filter: string) => {
        if (!filter) {
            return this.completions;
        }
        return this.completions.filter(
            completion =>
                completion.toLowerCase().indexOf(filter.toLowerCase()) > -1
        );
    };

    private handleChange(event) {
        let value = event.target.value;

        if (this.type === 'number') {
            if (!value && event.data) {
                event.stopPropagation();
                return;
            }

            if (value) {
                value = Number(value);
            }
        }

        this.change.emit(value);
    }

    private handleIconClick() {
        this.action.emit();
    }

    private handleIconKeyPress(event) {
        const isEnter = event.key === ENTER || event.keyCode === ENTER_KEY_CODE;
        const isSpace = event.key === SPACE || event.keyCode === SPACE_KEY_CODE;

        if (isSpace || isEnter) {
            this.action.emit();
        }
    }
}
