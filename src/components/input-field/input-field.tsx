import { MDCTextField } from '@limetech/mdc-textfield';
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
import {
    ARROW_DOWN,
    ARROW_DOWN_KEY_CODE,
    ARROW_UP,
    ARROW_UP_KEY_CODE,
    ENTER,
    ENTER_KEY_CODE,
    SPACE,
    SPACE_KEY_CODE,
    TAB,
    TAB_KEY_CODE,
} from '../../util/keycodes';
import { InputType } from './input-field.types';
import { ListItem } from '@limetech/lime-elements';

/**
 * @exampleComponent limel-example-input-field-text
 * @exampleComponent limel-example-input-field-text-inline
 * @exampleComponent limel-example-input-field-number
 * @exampleComponent limel-example-input-field-autocomplete
 * @exampleComponent limel-example-input-field-icon-leading
 * @exampleComponent limel-example-input-field-icon-trailing
 * @exampleComponent limel-example-input-field-icon-both
 * @exampleComponent limel-example-input-field-error-icon
 * @exampleComponent limel-example-input-field-textarea
 * @exampleComponent limel-example-input-field-search
 * @exampleComponent limel-example-input-field-pattern
 */
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
    @Prop({ reflect: true })
    public disabled = false;

    /**
     * Set to `true` to indicate that the current value of the input field is
     * invalid.
     * Defaults to `false`.
     */
    @Prop({ reflect: true })
    public invalid = false;

    /**
     * The input label.
     */
    @Prop({ reflect: true })
    public label: string;

    /**
     * Optional helper text to display below the input field when it has focus
     */
    @Prop({ reflect: true })
    public helperText: string;

    /**
     * Set to `true` to indicate that the field is required.
     * Defaults to `false`.
     */
    @Prop({ reflect: true })
    public required = false;

    /**
     * The value of the field.
     */
    @Prop({ reflect: true })
    public value: string;

    /**
     * Trailing icon to show to the far right in the field
     */
    @Prop({ reflect: true })
    public trailingIcon: string;

    /**
     * Leading icon to show to the far left in the field
     */
    @Prop({ reflect: true })
    public leadingIcon: string;

    /**
     * Regular expression that the current value of the input field must match.
     * No forward slashes should be specified around the pattern.
     * Only used if type is `text`, `tel`, `email`, `url`, `password`
     * or `search`.
     */
    @Prop({ reflect: true })
    public pattern: string;

    /**
     * Type of textfield
     * Defaults to 'text'
     */
    @Prop({ reflect: true })
    public type: InputType = 'text';

    /**
     * Set to `true` to format the current value of the input field only
     * if the field is of type number.
     * The number format is determined by the current language of the browser.
     * Defaults to `true`.
     */
    @Prop({ reflect: true })
    public formatNumber = true;

    /**
     * Incremental values that are valid if the field type is `number`
     */
    @Prop({ reflect: true })
    public step: number | 'any' = 'any';

    /**
     * Maximum allowed value if input type is `number`
     */
    @Prop({ reflect: true })
    public max: number;

    /**
     * Minimum allowed value if input type is `number`
     */
    @Prop({ reflect: true })
    public min: number;

    /**
     * Maximum length of the value if type is `password`, `search`, `tel`, `text` or `url`
     */
    @Prop({ reflect: true })
    public maxlength: number;

    /**
     * Minimum length of the value if type is `password`, `search`, `tel`, `text` or `url`
     */
    @Prop({ reflect: true })
    public minlength: number;

    /**
     * list of suggestions `value` can autocomplete to.
     */
    @Prop()
    public completions: string[] = [];

    /**
     * Emitted when the input value is changed.
     */
    @Event()
    private change: EventEmitter<string>;

    /**
     * Emitted when `trailingIcon` or `leadingIcon` is set and the icon is interacted with
     */
    @Event()
    private action: EventEmitter<void>;

    @Element()
    private limelInputField: HTMLLimelInputFieldElement;

    @State()
    private isFocused: boolean = false;

    @State()
    private isModified: boolean = false;

    @State()
    public showCompletions: boolean = false;

    private mdcTextField: MDCTextField;
    private completionsList: ListItem[] = [];

    constructor() {
        this.handleChange = this.handleChange.bind(this);
        this.handleIconKeyPress = this.handleIconKeyPress.bind(this);
        this.handleIconClick = this.handleIconClick.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.handleCompletionChange = this.handleCompletionChange.bind(this);
        this.onKeyDownForList = this.onKeyDownForList.bind(this);
    }

    public connectedCallback() {
        this.initialize();
    }

    public componentDidLoad() {
        this.initialize();
    }

    private initialize() {
        const element = this.limelInputField.shadowRoot.querySelector(
            '.mdc-text-field'
        );
        if (!element) {
            return;
        }

        this.mdcTextField = new MDCTextField(element);

        this.completionsList = [...this.completions].map((item) => {
            return { text: item };
        });
    }

    public disconnectedCallback() {
        if (this.mdcTextField) {
            this.mdcTextField.destroy();
        }
    }

    public componentDidUpdate() {
        if (this.invalid) {
            this.mdcTextField.valid = false;
        }
    }

    public render() {
        if (this.type === 'textarea') {
            return this.renderTextArea();
        }

        const additionalProps = this.getAdditionalProps();
        const classList = {
            'mdc-text-field': true,
            'mdc-text-field--invalid': this.isInvalid(),
            'mdc-text-field--disabled': this.disabled,
            'mdc-text-field--required': this.required,
            'mdc-text-field--with-trailing-icon': !!this.getTrailingIcon(),
            'mdc-text-field--with-leading-icon': !!this.leadingIcon,
        };

        return [
            <label class={classList}>
                {this.renderFormattedNumber()}
                <input
                    class="mdc-text-field__input"
                    onInput={this.handleChange}
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}
                    required={this.required}
                    disabled={this.disabled}
                    type={this.type}
                    pattern={this.pattern}
                    onWheel={this.handleWheel}
                    onKeyDown={this.onKeyDown}
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
                {this.renderIcons()}
                <div class="mdc-line-ripple" />
            </label>,
            this.renderHelperLine(),
            <div class="autocomplete-list-container">
                {this.renderDropdown()}
            </div>,
        ];
    }

    @Watch('value')
    protected valueWatcher(newValue: string) {
        if (!this.mdcTextField) {
            return;
        }

        if (newValue !== this.mdcTextField.value) {
            this.mdcTextField.value = newValue || '';
        }
    }

    private renderTextArea() {
        const additionalProps = this.getAdditionalProps();
        const classList = {
            'mdc-text-field': true,
            'mdc-text-field--textarea': true,
            'mdc-text-field--disabled': this.disabled,
            'mdc-text-field--with-trailing-icon': !!this.getTrailingIcon(),
            'mdc-text-field--invalid': this.isInvalid(),
            'mdc-text-field--required': this.required,
        };

        const labelClassList = {
            'mdc-floating-label': true,
            'textarea-label': true,
            'mdc-floating-label--float-above': !!this.value || this.isFocused,
        };

        return [
            <div class={classList}>
                {this.renderCharacterCounter()}
                <textarea
                    id="textarea"
                    class="mdc-text-field__input"
                    onInput={this.handleChange}
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}
                    required={this.required}
                    disabled={this.disabled}
                    {...additionalProps}
                >
                    {this.value}
                </textarea>
                <div class="mdc-notched-outline">
                    <div class="mdc-notched-outline__leading" />
                    <div class="mdc-notched-outline__notch">
                        <label htmlFor="textarea" class={labelClassList}>
                            {this.label}
                        </label>
                    </div>
                    <div class="mdc-notched-outline__trailing" />
                </div>
            </div>,
            this.renderHelperLine(),
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
        this.showCompletions = true;
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
                {this.type !== 'textarea'
                    ? this.renderCharacterCounter()
                    : null}
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

    private isInvalid() {
        if (this.invalid) {
            return true;
        }

        if (!this.isModified) {
            return false;
        }

        const element = this.getInputElement();

        return !(element && element.checkValidity());
    }

    private getInputElement(): HTMLInputElement | HTMLTextAreaElement {
        let elementName = 'input';
        if (this.type === 'textarea') {
            elementName = 'textarea';
        }

        return this.limelInputField.shadowRoot.querySelector(elementName);
    }

    private renderIcons() {
        const trailingIcon = this.getTrailingIcon();

        const html = [];

        if (this.leadingIcon) {
            html.push(
                <i
                    onKeyPress={this.handleIconKeyPress}
                    onClick={this.handleIconClick}
                    class="mdc-text-field__icon"
                    tabindex="0"
                    role="button"
                >
                    <limel-icon name={this.leadingIcon} />
                </i>
            );
        }

        if (trailingIcon) {
            html.push(
                <i
                    onKeyPress={this.handleIconKeyPress}
                    onClick={this.handleIconClick}
                    class="mdc-text-field__icon"
                    tabindex="0"
                    role="button"
                >
                    <limel-icon name={trailingIcon} />
                </i>
            );
        }

        return html;
    }

    private getTrailingIcon() {
        if (this.isInvalid()) {
            return 'high_importance';
        }

        return this.trailingIcon;
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

    /**
     * Key handler for the input field
     * Will change focus to the first/last item in the dropdown list to enable selection with the keyboard
     *
     * @param {KeyboardEvent} event event
     *
     * @returns {void}
     */

    private onKeyDown(event: KeyboardEvent): void {
        this.showCompletions = true;
        const isForwardTab =
            (event.key === TAB || event.keyCode === TAB_KEY_CODE) &&
            !event.altKey &&
            !event.metaKey &&
            !event.shiftKey;
        const isUp =
            event.key === ARROW_UP || event.keyCode === ARROW_UP_KEY_CODE;
        const isDown =
            event.key === ARROW_DOWN || event.keyCode === ARROW_DOWN_KEY_CODE;

        if (event.keyCode === TAB_KEY_CODE && event.shiftKey) {
            this.showCompletions = false;
        }

        if (!isForwardTab && !isUp && !isDown) {
            return;
        }

        const list = this.limelInputField.shadowRoot.querySelector(
            'limel-list'
        );
        if (!list) {
            return;
        }

        event.preventDefault();
        if (isForwardTab || isDown) {
            const listElement: HTMLElement = list.shadowRoot.querySelector(
                '.mdc-list-item:first-child'
            );
            listElement.focus();

            return;
        }

        if (isUp) {
            const listElement: HTMLElement = list.shadowRoot.querySelector(
                '.mdc-list-item:last-child'
            );
            listElement.focus();
        }
    }

    private handleCompletionChange(event: CustomEvent<ListItem>) {
        event.stopPropagation();
        if (!event.detail) {
            return;
        }

        this.showCompletions = false;
        this.change.emit(event.detail.text);
    }

    private onKeyDownForList(event: KeyboardEvent) {
        const isForwardTab =
            event.key === TAB || event.keyCode === TAB_KEY_CODE;
        if (isForwardTab) {
            this.showCompletions = false;
        }
    }

    private renderDropdown() {
        const filteredCompletions: ListItem[] = this.filterCompletions(
            this.value
        );
        if (!filteredCompletions || filteredCompletions.length === 0) {
            return null;
        }

        return (
            this.showCompletions && (
                <div
                    onKeyDown={this.onKeyDownForList}
                    class="autocomplete-list mdc-elevation-transition mdc-elevation--z4 mdc-menu-surface mdc-menu-surface--open"
                >
                    <limel-list
                        onChange={this.handleCompletionChange}
                        type="selectable"
                        items={filteredCompletions}
                    />
                </div>
            )
        );
    }

    private filterCompletions = (filter: string) => {
        if (!filter) {
            return this.completionsList;
        }

        return this.completionsList.filter(
            (completion) =>
                completion.text.toLowerCase().indexOf(filter.toLowerCase()) > -1
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

    private handleIconKeyPress(event: KeyboardEvent) {
        const isEnter = event.key === ENTER || event.keyCode === ENTER_KEY_CODE;
        const isSpace = event.key === SPACE || event.keyCode === SPACE_KEY_CODE;

        if (isSpace || isEnter) {
            this.action.emit();
        }
    }

    private handleWheel() {
        // This empty event handler is here to circumvent a bug.
        // In some browsers (Chrome for example), hovering the input with
        // the input focused, and scrolling, will both change the value
        // AND scroll the page. We would prefer to never change the value
        // on scroll, instead always scrolling the page, but since we
        // haven't found a way to do that, this is the next best thing, as
        // it prevents the page from being scrolled, but only in the
        // circumstances when the value is changed by the scrolling.
        // Please test THOROUGHLY if you remove this event handler 😄
    }
}
