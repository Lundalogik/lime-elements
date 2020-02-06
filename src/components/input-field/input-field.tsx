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
import { InputType } from './input-field.types';

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
     * Optional helper text to display below the input field when it has focus
     */
    @Prop({ reflectToAttr: true })
    public helperText: string;

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
    public type: InputType = 'text';

    /**
     * Set to `true` to format the current value of the input field only
     * if the field is of type number.
     * The number format is determined by the current language of the browser.
     * Defaults to `true`.
     */
    @Prop({ reflectToAttr: true })
    public formatNumber = true;

    /**
     * Incremental values that are valid if the field type is `number`
     */
    @Prop({ reflectToAttr: true })
    public step: number | 'any' = 'any';

    /**
     * Maximum allowed value if input type is `number`
     */
    @Prop({ reflectToAttr: true })
    public max: number;

    /**
     * Minimum allowed value if input type is `number`
     */
    @Prop({ reflectToAttr: true })
    public min: number;

    /**
     * Maximum length of the value if type is `password`, `search`, `tel`, `text` or `url`
     */
    @Prop({ reflectToAttr: true })
    public maxlength: number;

    /**
     * Minimum length of the value if type is `password`, `search`, `tel`, `text` or `url`
     */
    @Prop({ reflectToAttr: true })
    public minlength: number;

    /**
     * list of suggestions `value` can autocomplete to.
     */
    @Prop()
    public completions: string[] = [];

    @State()
    private mdcTextField;

    @State()
    private isFocused: boolean = false;

    @State()
    private isModified: boolean = false;

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
        const additionalProps = this.getAdditionalProps();
        return [
            <label
                class={`
                    mdc-text-field
                    ${this.invalid ? 'mdc-text-field--invalid' : ''}
                    ${this.disabled ? 'mdc-text-field--disabled' : ''}
                    ${this.required ? 'mdc-text-field--required' : ''}
                    ${
                        this.getIcon()
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
                    required={this.required}
                    disabled={this.disabled}
                    type={this.type}
                    {...additionalProps}
                    value={this.value}
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
            this.renderHelperLine(),
            <div class="autocomplete-list-container">
                {this.renderDropdown()}
            </div>,
        ];
    }

    private getAdditionalProps() {
        const props: any = {};

        if (this.type === 'number') {
            props.step = this.step;
        }

        if (this.type === 'number' && this.min) {
            props.min = this.min;
        }

        if (this.type === 'number' && this.max) {
            props.max = this.max;
        }

        if (this.minlength) {
            props.minlength = this.minlength;
        }

        if (this.maxlength) {
            props.maxlength = this.maxlength;
        }

        return props;
    }

    private onFocus() {
        this.isFocused = true;
    }

    private onBlur() {
        this.isFocused = false;
        this.isModified = true;
    }

    private renderHelperLine() {
        if (
            !this.maxlength &&
            (this.helperText === null || this.helperText === undefined)
        ) {
            return;
        }

        return (
            <div class="mdc-text-field-helper-line">
                {this.renderHelperText()}
                {this.renderCharacterCounter()}
            </div>
        );
    }

    private renderHelperText() {
        if (this.helperText === null || this.helperText === undefined) {
            return;
        }
        return (
            <p
                class={`
            mdc-text-field-helper-text
            ${
                this.isInvalid()
                    ? 'mdc-text-field-helper-text--validation-msg'
                    : ''
            }
        `}
            >
                {this.helperText}
            </p>
        );
    }

    private renderCharacterCounter() {
        if (!this.maxlength || this.type === 'number') {
            return;
        }

        const text: string = this.value || '';
        const label = `${text.length} / ${this.maxlength}`;

        return <div class="mdc-text-field-character-counter">{label}</div>;
    }

    private getIcon() {
        if (this.isInvalid()) {
            return 'high_importance';
        }

        return this.trailingIcon;
    }

    private isInvalid() {
        if (this.invalid) {
            return true;
        }

        if (!this.isModified) {
            return false;
        }

        const element = this.limelInputField.shadowRoot.querySelector('input');

        return !(element && element.checkValidity());
    }

    private renderTrailingIcon() {
        const icon = this.getIcon();
        if (!icon) {
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
                <limel-icon name={icon} />
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
