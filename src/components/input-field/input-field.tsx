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
import { getHref } from './link-helper';

interface LinkProperties {
    href: string;
    target?: string;
}

/**
 * @exampleComponent limel-example-input-field-text
 * @exampleComponent limel-example-input-field-text-multiple
 * @exampleComponent limel-example-input-field-number
 * @exampleComponent limel-example-input-field-autocomplete
 * @exampleComponent limel-example-input-field-icon-leading
 * @exampleComponent limel-example-input-field-icon-trailing
 * @exampleComponent limel-example-input-field-icon-both
 * @exampleComponent limel-example-input-field-showlink
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
     */
    @Prop({ reflect: true })
    public disabled = false;

    /**
     * Set to `true` to indicate that the current value of the input field is
     * invalid.
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
     */
    @Prop({ reflect: true })
    public required = false;

    /**
     * The value of the field.
     */
    @Prop({ reflect: true })
    public value: string;

    /**
     * Trailing icon to show to the far right in the field.
     */
    @Prop({ reflect: true })
    public trailingIcon: string;

    /**
     * Leading icon to show to the far left in the field.
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
     * Type of textfield.
     */
    @Prop({ reflect: true })
    public type: InputType = 'text';

    /**
     * Set to `true` to format the current value of the input field only
     * if the field is of type number.
     * The number format is determined by the current language of the browser.
     */
    @Prop({ reflect: true })
    public formatNumber = true;

    /**
     * Incremental values that are valid if the field type is `number`.
     */
    @Prop({ reflect: true })
    public step: number | 'any' = 'any';

    /**
     * Maximum allowed value if input type is `number`.
     */
    @Prop({ reflect: true })
    public max: number;

    /**
     * Minimum allowed value if input type is `number`.
     */
    @Prop({ reflect: true })
    public min: number;

    /**
     * Maximum length of the value if type is `password`, `search`, `tel`,
     * `text` or `url`.
     */
    @Prop({ reflect: true })
    public maxlength: number;

    /**
     * Minimum length of the value if type is `password`, `search`, `tel`,
     * `text` or `url`.
     */
    @Prop({ reflect: true })
    public minlength: number;

    /**
     * list of suggestions `value` can autocomplete to.
     */
    @Prop()
    public completions: string[] = [];

    /**
     * For inputs of type `email`, `tel`, and `url`, set this to `true` to show
     * a trailing icon with a `mailto:`,`tel:`, or normal link, respectively.
     * The default icon can be overridden using the `trailingIcon` property.
     */
    @Prop({ reflect: true })
    public showLink = false;

    /**
     * Emitted when the input value is changed.
     */
    @Event()
    private change: EventEmitter<string>;

    /**
     * Emitted when `trailingIcon` or `leadingIcon` is set
     * and the icon is interacted with.
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
        this.layout = this.layout.bind(this);
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

        window.addEventListener('resize', this.layout, { passive: true });
    }

    public disconnectedCallback() {
        if (this.mdcTextField) {
            this.mdcTextField.destroy();
        }

        window.removeEventListener('resize', this.layout);
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
            'mdc-text-field--outlined': true,
            'mdc-text-field--invalid': this.isInvalid(),
            'mdc-text-field--disabled': this.disabled,
            'mdc-text-field--required': this.required,
            'mdc-text-field--with-trailing-icon': !!this.getTrailingIcon(),
            'mdc-text-field--with-leading-icon': !!this.leadingIcon,
        };

        return [
            <div class={classList}>
                {this.renderFormattedNumber()}
                <input
                    class="mdc-text-field__input"
                    id="tf-input-element"
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
                <div class="mdc-notched-outline">
                    <div class="mdc-notched-outline__leading"></div>
                    <div class="mdc-notched-outline__notch">
                        <label
                            class={`
                            mdc-floating-label
                            ${
                                this.value || this.isFocused
                                    ? 'mdc-floating-label--float-above'
                                    : ''
                            }
                        `}
                            htmlFor="input-element"
                        >
                            {this.label}
                        </label>
                    </div>
                    <div class="mdc-notched-outline__trailing"></div>
                </div>
                {this.renderIcons()}
            </div>,
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

    private layout() {
        this.mdcTextField?.layout();
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
            'has-helper-line': !!this.helperText || !!this.maxlength,
        };

        const labelClassList = {
            'mdc-floating-label': true,
            'textarea-label': true,
            'mdc-floating-label--float-above': !!this.value || this.isFocused,
        };

        return [
            <div class={classList}>
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
        const html = [];

        if (this.leadingIcon) {
            html.push(
                <i class="mdc-text-field__icon">
                    <limel-icon name={this.leadingIcon} />
                </i>
            );
        }

        const trailingIcon = this.getTrailingIcon();

        if (!this.isInvalid() && this.hasLink()) {
            html.push(this.renderLinkIcon(this.getLink(), trailingIcon));
        } else if (trailingIcon) {
            html.push(this.renderTrailingIcon(trailingIcon));
        }

        return html;
    }

    private hasLink() {
        return this.showLink && ['email', 'tel', 'url'].includes(this.type);
    }

    private getLink() {
        const props: LinkProperties = { href: '' };
        switch (this.type) {
            case 'email':
                props.href = `mailto:${this.value}`;
                break;
            case 'tel':
                props.href = `tel:${this.value}`;
                break;
            default:
                props.href = getHref(this.value);
                props.target = '_blank';
        }

        return props;
    }

    private renderLinkIcon(linkProps: LinkProperties, icon: string) {
        return (
            <a
                {...linkProps}
                class="mdc-text-field__icon trailing-icon"
                tabindex={this.disabled ? '-1' : '0'}
                role="button"
            >
                <limel-icon name={icon} />
            </a>
        );
    }

    private renderTrailingIcon(icon: string) {
        return (
            <i
                onKeyPress={this.handleIconKeyPress}
                onClick={this.handleIconClick}
                class="mdc-text-field__icon trailing-icon"
                tabindex={this.isInvalid() ? '-1' : '0'}
                role="button"
            >
                <limel-icon name={icon} />
            </i>
        );
    }

    private getTrailingIcon() {
        if (this.isInvalid()) {
            return 'high_importance';
        }

        if (this.trailingIcon) {
            return this.trailingIcon;
        }

        if (this.showLink && this.type === 'email') {
            return 'filled_message';
        }

        if (this.showLink && this.type === 'tel') {
            return 'phone';
        }

        if (this.showLink && this.type === 'url') {
            return 'external_link';
        }
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

        return <span class="formatted-input">{renderValue}</span>;
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
        event.stopPropagation();
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
        if (!this.isInvalid()) {
            this.action.emit();
        }
    }

    private handleIconKeyPress(event: KeyboardEvent) {
        const isEnter = event.key === ENTER || event.keyCode === ENTER_KEY_CODE;
        const isSpace = event.key === SPACE || event.keyCode === SPACE_KEY_CODE;

        if ((isSpace || isEnter) && !this.isInvalid()) {
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
