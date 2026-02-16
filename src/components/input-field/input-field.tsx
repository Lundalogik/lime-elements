import { MDCTextField } from '@material/textfield';
import {
    Component,
    Element,
    Event,
    EventEmitter,
    h,
    Method,
    Prop,
    State,
    Watch,
    Host,
} from '@stencil/core';
import { debounce } from 'lodash-es';
import {
    ARROW_DOWN,
    ARROW_UP,
    ENTER,
    ESCAPE,
    SPACE,
    TAB,
} from '../../util/keycodes';
import { InputType } from '../input-field/input-field.types';
import { ListItem } from '../list-item/list-item.types';
import { getHref, getTarget, getRel } from '../../util/link-helper';
import { JSXBase } from '@stencil/core/internal';
import { createRandomString } from '../../util/random-string';
import { LimelListCustomEvent } from '../../components';
import { globalConfig } from '../../global/config';
import { IconName } from '../../global/shared-types/icon.types';

interface LinkProperties {
    href: string;
    target?: string;
    rel?: string;
}

const CHANGE_EVENT_DEBOUNCE_TIMEOUT = 300;
const RESIZE_HANDLER_DEBOUNCE_TIMEOUT = 100;

/**
 * @exampleComponent limel-example-input-field-text
 * @exampleComponent limel-example-input-field-placeholder
 * @exampleComponent limel-example-input-field-text-multiple
 * @exampleComponent limel-example-input-field-number
 * @exampleComponent limel-example-input-field-autocomplete
 * @exampleComponent limel-example-input-field-icon-leading
 * @exampleComponent limel-example-input-field-icon-trailing
 * @exampleComponent limel-example-input-field-icon-both
 * @exampleComponent limel-example-input-field-showlink
 * @exampleComponent limel-example-input-field-error-icon
 * @exampleComponent limel-example-input-field-textarea
 * @exampleComponent limel-example-input-field-suffix
 * @exampleComponent limel-example-input-field-prefix
 * @exampleComponent limel-example-input-field-search
 * @exampleComponent limel-example-input-field-pattern
 * @exampleComponent limel-example-input-field-focus
 * @exampleComponent limel-example-input-field-selection
 */
@Component({
    tag: 'limel-input-field',
    shadow: { delegatesFocus: true },
    styleUrl: 'input-field.scss',
})
export class InputField {
    /**
     * Set to `true` to disable the field.
     * Use `disabled` to indicate that the field can normally be interacted
     * with, but is currently disabled. This tells the user that if certain
     * requirements are met, the field may become enabled again.
     */
    @Prop({ reflect: true })
    public disabled = false;

    /**
     * Set to `true` to make the field read-only.
     * Use `readonly` when the field is only there to present the data it holds,
     * and will not become possible for the current user to edit.
     */
    @Prop({ reflect: true })
    public readonly = false;

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
     * The placeholder text shown inside the input field, when the field is focused and empty.
     */
    @Prop({ reflect: true })
    public placeholder: string;

    /**
     * Optional helper text to display below the input field when it has focus
     */
    @Prop({ reflect: true })
    public helperText: string;

    /**
     * A short piece of text to display before the value inside the input field.
     * Displayed for all types except `textarea`.
     */
    @Prop({ reflect: true })
    public prefix: string;

    /**
     * A short piece of text to display after the value inside the input field.
     * Displayed for all types except `textarea`.
     */
    @Prop({ reflect: true })
    public suffix: string;

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
    public trailingIcon: IconName;

    /**
     * Leading icon to show to the far left in the field.
     */
    @Prop({ reflect: true })
    public leadingIcon: IconName;

    /**
     * Regular expression that the current value of the input field must match.
     * No forward slashes should be specified around the pattern.
     * Only used if type is `text`, `tel`, `email`, `url`, `urlAsText`,
     * `password`, or `search`.
     */
    @Prop({ reflect: true })
    public pattern: string;

    /**
     * Type of input.
     *
     * Note** regarding type `url`: `limel-input` uses the native validation
     * built into the browser for many types of input fields. The native
     * validation for `url` is very strict, and does not allow relative urls,
     * nor any other formats that are not a "fully qualified" url. To allow
     * such urls, use the type `urlAsText` instead. `urlAsText` works exactly
     * like `text` in all regards, except that it enables use of the `showLink`
     * property.
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
     * Defines which numeric values are valid and the increment/decrement interval.
     * For example, `step={0.1}` allows decimals and steps by 0.1.
     * Set to `'any'` to allow any numeric value.
     * Only applies when `type` is `number`.
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
     * `text`, `url`, or `urlAsText`.
     */
    @Prop({ reflect: true })
    public maxlength: number;

    /**
     * Minimum length of the value if type is `password`, `search`, `tel`,
     * `text`, `url`, or `urlAsText`.
     */
    @Prop({ reflect: true })
    public minlength: number;

    /**
     * list of suggestions `value` can autocomplete to.
     */
    @Prop()
    public completions: string[] = [];

    /**
     * For inputs of type `email`, `tel`, `url`, and `urlAsText`, set this to
     * `true` to show a trailing icon with a `mailto:`,`tel:`, or normal link,
     * respectively. The default icon can be overridden using the `trailingIcon`
     * property.
     */
    @Prop({ reflect: true })
    public showLink = false;

    /**
     * The locale to use for formatting numbers.
     */
    @Prop({ reflect: true })
    public locale: string = globalConfig.defaultLocale;

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
    private wasInvalid: boolean = false;

    @State()
    public showCompletions: boolean = false;

    private inputElement?: HTMLInputElement | HTMLTextAreaElement;
    private mdcTextField: MDCTextField;
    private completionsList: ListItem[] = [];
    private portalId: string;
    private helperTextId: string;
    private labelId: string;

    private changeWaiting = false;

    constructor() {
        this.portalId = createRandomString();
        this.helperTextId = createRandomString();
        this.labelId = createRandomString();
    }

    public connectedCallback() {
        this.initialize();
    }

    public componentDidLoad() {
        this.initialize();
    }

    public disconnectedCallback() {
        if (this.mdcTextField) {
            this.mdcTextField.destroy();
        }

        this.restyleCompletionsDropDown.cancel();
        window.removeEventListener('resize', this.layout);
        this.limelInputField.removeEventListener('focus', this.setFocus);
    }

    public componentDidUpdate() {
        if (this.invalid) {
            this.mdcTextField.valid = false;
        }

        this.mdcTextField.disabled = this.disabled || this.readonly;
    }

    /**
     * Returns the start position of the current text selection.
     * Returns `null` if the input element is not available or if
     * the input type does not support selection (e.g., `number`).
     */
    @Method()
    public async getSelectionStart(): Promise<number | null> {
        try {
            return this.inputElement?.selectionStart ?? null;
        } catch {
            // Some input types (e.g., number) throw InvalidStateError
            return null;
        }
    }

    /**
     * Returns the end position of the current text selection.
     * Returns `null` if the input element is not available or if
     * the input type does not support selection (e.g., `number`).
     */
    @Method()
    public async getSelectionEnd(): Promise<number | null> {
        try {
            return this.inputElement?.selectionEnd ?? null;
        } catch {
            // Some input types (e.g., number) throw InvalidStateError
            return null;
        }
    }

    /**
     * Returns the direction of the current text selection.
     * Can be `'forward'`, `'backward'`, or `'none'`.
     * Returns `null` if the input element is not available or if
     * the input type does not support selection (e.g., `number`).
     */
    @Method()
    public async getSelectionDirection(): Promise<
        'forward' | 'backward' | 'none' | null
    > {
        try {
            return this.inputElement?.selectionDirection ?? null;
        } catch {
            // Some input types (e.g., number) throw InvalidStateError
            return null;
        }
    }

    public render() {
        const properties = this.getAdditionalProps();
        properties['aria-labelledby'] = this.labelId;
        properties.class = 'mdc-text-field__input';
        properties.ref = this.setInputElement;
        properties.onInput = this.handleInput;
        properties.onChange = this.handleChange;
        properties.onFocus = this.onFocus;
        properties.onBlur = this.onBlur;
        properties.required = this.required;
        properties.readonly = this.readonly;
        properties.disabled = this.disabled || this.readonly;

        let ariaControls = '';

        if (this.hasHelperText()) {
            ariaControls += this.helperTextId;
            properties['aria-describedby'] = this.helperTextId;
        }

        if (this.renderAutocompleteList()) {
            if (ariaControls) {
                ariaControls += ' ';
            }

            ariaControls += this.portalId;
        }

        if (ariaControls) {
            properties['aria-controls'] = ariaControls;
        }

        return (
            <Host>
                <limel-notched-outline
                    labelId={this.labelId}
                    label={this.label}
                    required={this.required}
                    invalid={this.invalid || this.isInvalid()}
                    disabled={this.disabled}
                    readonly={this.readonly}
                    hasValue={!!this.value}
                    hasLeadingIcon={!!this.leadingIcon}
                >
                    <label slot="content" class={this.getContainerClassList()}>
                        {this.renderLeadingIcon()}
                        {this.renderPrefix()}
                        {this.renderFormattedNumber()}
                        {this.renderInput(properties)}
                        {this.renderSuffix()}
                        {this.renderTextarea(properties)}
                        {this.renderTrailingLinkOrButton()}
                    </label>
                </limel-notched-outline>
                {this.renderHelperLine()}
                {this.renderAutocompleteList()}
            </Host>
        );
    }

    @Watch('value')
    protected valueWatcher(newValue: string) {
        if (!this.mdcTextField) {
            return;
        }

        if (this.changeWaiting) {
            return;
        }

        if (
            this.type === 'number' &&
            this.isFocused &&
            Number(newValue) === Number(this.mdcTextField.value)
        ) {
            return;
        }

        if (newValue !== this.mdcTextField.value) {
            this.mdcTextField.value = newValue || '';
        }

        if (this.wasInvalid) {
            this.validate();
        }
    }

    @Watch('completions')
    protected completionsWatcher() {
        this.mapCompletions();
    }

    private initialize = () => {
        const element =
            this.limelInputField.shadowRoot.querySelector('.mdc-text-field');
        if (!element) {
            return;
        }

        this.mdcTextField = new MDCTextField(element);
        if (this.value) {
            this.mdcTextField.value = this.value;
        }

        if (this.invalid) {
            this.mdcTextField.valid = false;
        }

        this.mapCompletions();

        window.addEventListener('resize', this.layout, { passive: true });
        this.limelInputField.addEventListener('focus', this.setFocus);
    };

    private mapCompletions = () => {
        this.completionsList = [...this.completions].map((item) => {
            return { text: item };
        });
    };

    private setFocus = () => {
        this.mdcTextField.focus();
    };

    private getContainerClassList = () => {
        const classList = {
            'mdc-text-field': true,
            'mdc-text-field--outlined': true,
            'mdc-text-field--invalid': this.isInvalid(),
            'mdc-text-field--disabled': this.disabled || this.readonly,
            'lime-text-field--readonly': this.readonly,
            'mdc-text-field--required': this.required,
            'lime-text-field--empty': this.isEmpty(),
            'lime-has-prefix': this.hasPrefix(),
            'lime-has-suffix': this.hasSuffix(),
        };

        if (this.type === 'textarea') {
            classList['mdc-text-field--textarea'] = true;
        } else {
            classList['mdc-text-field--with-leading-icon'] = !!this.leadingIcon;
            classList['mdc-text-field--with-trailing-icon'] =
                !!this.getTrailingIcon();
        }

        return classList;
    };

    private isEmpty = () => {
        if (this.type === 'number' && this.inputElement?.validity.badInput) {
            return false;
        }

        return !this.getCurrentValue();
    };

    private getCurrentValue = () => {
        if (this.changeWaiting && this.inputElement) {
            return this.inputElement.value;
        }

        return this.value;
    };

    private renderInput = (
        properties: JSXBase.InputHTMLAttributes<HTMLInputElement>
    ) => {
        if (this.type === 'textarea') {
            return;
        }

        const type = this.type === 'urlAsText' ? 'text' : this.type;

        return (
            <input
                {...properties}
                type={type}
                pattern={this.pattern}
                onWheel={this.handleWheel}
                onKeyDown={this.onKeyDown}
                placeholder={this.placeholder}
            />
        );
    };

    private renderTextarea = (
        properties: JSXBase.TextareaHTMLAttributes<HTMLTextAreaElement>
    ) => {
        if (this.type !== 'textarea') {
            return;
        }

        return (
            <span class="mdc-text-field__resizer">
                <textarea
                    {...properties}
                    placeholder={this.placeholder}
                ></textarea>
            </span>
        );
    };

    private layout = () => {
        this.mdcTextField?.layout();
        this.restyleCompletionsDropDown();
    };

    private restyleCompletionsDropDown = debounce(() => {
        const stateOfShowCompletions = this.showCompletions;
        this.showCompletions = false;
        requestAnimationFrame(() => {
            this.showCompletions = stateOfShowCompletions;
        });
    }, RESIZE_HANDLER_DEBOUNCE_TIMEOUT);

    private getAdditionalProps = () => {
        const props: any = {};

        if (this.type === 'number') {
            props.step = this.step;
        }

        if (this.type === 'number' && Number.isInteger(this.min)) {
            props.min = this.min;
        }

        if (this.type === 'number' && Number.isInteger(this.max)) {
            props.max = this.max;
        }

        if (this.minlength) {
            props.minlength = this.minlength;
        }

        if (this.maxlength) {
            props.maxlength = this.maxlength;
        }

        return props;
    };

    private onFocus = () => {
        this.isFocused = true;
        this.showCompletions = true;
    };

    private onBlur = () => {
        this.isFocused = false;
        this.validate();
        this.changeEmitter.flush();
    };

    private get validationMessage(): string {
        if (this.isInvalid() && !this.invalid) {
            return this.inputElement?.validationMessage || '';
        }

        return '';
    }

    private hasHelperText = () => {
        return !!(this.helperText ?? this.validationMessage);
    };

    private hasHelperLine = () => {
        return this.maxlength > 0 || this.hasHelperText();
    };

    private renderHelperLine = () => {
        const text: string = this.getCurrentValue() || '';
        const length = text.length;

        if (!this.hasHelperLine()) {
            return;
        }

        return (
            <limel-helper-line
                helperTextId={this.helperTextId}
                helperText={this.helperText ?? this.validationMessage}
                length={length}
                maxLength={this.maxlength}
                invalid={this.isInvalid()}
            />
        );
    };

    private renderSuffix = () => {
        if (!this.hasSuffix() || this.type === 'textarea') {
            return;
        }

        const classList = {
            'mdc-text-field__affix': true,
            'mdc-text-field__affix--suffix': true,
        };

        return <span class={classList}>{this.suffix}</span>;
    };

    private hasSuffix = () => {
        return this.suffix !== null && this.suffix !== undefined;
    };

    private renderPrefix = () => {
        if (!this.hasPrefix() || this.type === 'textarea') {
            return;
        }

        const classList = {
            'mdc-text-field__affix': true,
            'mdc-text-field__affix--prefix': true,
        };

        return <span class={classList}>{this.prefix}</span>;
    };

    private hasPrefix = () => {
        return this.prefix !== null && this.prefix !== undefined;
    };

    private isInvalid = () => {
        if (this.readonly) {
            // A readonly field can never be invalid.
            return false;
        }

        if (this.invalid) {
            // `this.invalid` is set by the consumer. If the consumer explicitly
            // told us to consider the field invalid, we consider it invalid
            // regardless of what our internal validation thinks, and regardless
            // of whether the field has been modified.
            return true;
        }

        return this.wasInvalid;
    };

    private validate = () => {
        if (this.readonly || this.invalid) {
            this.wasInvalid = false;

            return;
        }

        if (this.inputElement) {
            this.wasInvalid = !this.inputElement.checkValidity();
        }
    };

    private setInputElement = (
        element?: HTMLInputElement | HTMLTextAreaElement
    ) => {
        if (element) {
            this.inputElement = element;
        }
    };

    private renderLeadingIcon = () => {
        if (this.type === 'textarea') {
            return;
        }

        if (this.leadingIcon) {
            return (
                <i class="material-icons mdc-text-field__icon mdc-text-field__icon--leading">
                    <limel-icon name={this.leadingIcon} />
                </i>
            );
        }
    };

    private renderTrailingLinkOrButton = () => {
        if (this.type === 'textarea') {
            return;
        }

        const trailingIcon = this.getTrailingIcon();

        if (!this.isInvalid() && this.hasLink()) {
            return this.renderLinkIcon(this.getLink(), trailingIcon);
        } else if (trailingIcon) {
            return this.renderTrailingIcon(trailingIcon);
        }
    };

    private hasLink = () => {
        return (
            this.showLink &&
            ['email', 'tel', 'url', 'urlAsText'].includes(this.type)
        );
    };

    private getLink = () => {
        const props: LinkProperties = { href: '' };
        switch (this.type) {
            case 'email': {
                props.href = `mailto:${this.value}`;
                break;
            }
            case 'tel': {
                props.href = `tel:${this.value}`;
                break;
            }
            default: {
                props.href = getHref(this.value);
                props.target = getTarget(this.value);
                props.rel = getRel(props.target);
            }
        }

        return props;
    };

    private renderLinkIcon = (linkProps: LinkProperties, icon: IconName) => {
        // If the trailing icon uses the class `mdc-text-field__icon--trailing`,
        // MDC attaches a click handler to it, which apparently runs
        // `preventDefault()` on the event. For links, we don't want that,
        // so instead of `mdc-text-field__icon--trailing`, we use our own class
        // `lime-trailing-icon-for-link`, which uses all the same styling. /Ads
        return (
            <a
                {...linkProps}
                class="material-icons mdc-text-field__icon lime-trailing-icon-for-link"
                tabindex={this.disabled || this.isEmpty() ? '-1' : '0'}
                role="button"
            >
                <limel-icon name={icon} />
            </a>
        );
    };

    private renderTrailingIcon = (icon: IconName) => {
        if (this.isInvalid()) {
            return (
                <i
                    key="invalid"
                    class="material-icons mdc-text-field__icon invalid-icon"
                >
                    <limel-icon name={icon} />
                </i>
            );
        }

        return (
            <i
                key="action"
                class="material-icons mdc-text-field__icon mdc-text-field__icon--trailing"
                tabIndex={0}
                role="button"
                onKeyDown={this.handleIconKeyPress}
                onClick={this.handleIconClick}
            >
                <limel-icon name={icon} />
            </i>
        );
    };

    private getTrailingIcon = () => {
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

        if (
            this.showLink &&
            (this.type === 'url' || this.type === 'urlAsText')
        ) {
            return 'external_link';
        }
    };

    private renderFormattedNumber = () => {
        if (this.type !== 'number') {
            return;
        }

        let renderValue = this.value;
        if (this.formatNumber && this.value) {
            renderValue = new Intl.NumberFormat(this.locale).format(
                Number(this.value)
            );
            if (renderValue === 'NaN') {
                return;
            }
        }

        return (
            <span class="lime-formatted-input lime-looks-like-input-value">
                {renderValue}
            </span>
        );
    };

    /**
     * Key handler for the input field
     * Will change focus to the first/last item in the dropdown list to enable selection with the keyboard
     *
     * @param event - event
     */

    private onKeyDown = (event: KeyboardEvent): void => {
        this.showCompletions = true;
        const isForwardTab =
            event.key === TAB &&
            !event.altKey &&
            !event.metaKey &&
            !event.shiftKey;
        const isUp = event.key === ARROW_UP;
        const isDown = event.key === ARROW_DOWN;

        if (event.key === TAB && event.shiftKey) {
            this.showCompletions = false;
        }

        if (!isForwardTab && !isUp && !isDown) {
            return;
        }

        const list = document.querySelector(` #${this.portalId} limel-list`);

        if (!list) {
            return;
        }

        event.preventDefault();
        if (isForwardTab || isDown) {
            const listElement: HTMLElement = list.shadowRoot.querySelector(
                '.mdc-deprecated-list-item:first-child'
            );
            listElement.focus();

            return;
        }

        if (isUp) {
            const listElement: HTMLElement = list.shadowRoot.querySelector(
                '.mdc-deprecated-list-item:last-child'
            );
            listElement.focus();
        }
    };

    private handleCompletionChange = (
        event: LimelListCustomEvent<ListItem>
    ) => {
        event.stopPropagation();
        if (!event.detail) {
            return;
        }

        this.showCompletions = false;

        /*
         This change event doesn't need to be debounced in itself, but we want
         to make absolutely sure that an earlier change event that *has* been
         debounced doesn't emit after this one. Therefore, we run this through
         the same debounced emitter function. /Ads
         */
        this.changeEmitter(event.detail.text);
        this.changeEmitter.flush();
    };

    private renderAutocompleteList = () => {
        if (this.type === 'textarea' || this.completions.length === 0) {
            return;
        }

        const dropdownZIndex = getComputedStyle(
            this.limelInputField
        ).getPropertyValue('--dropdown-z-index');

        return (
            <limel-portal
                visible={this.showCompletions}
                containerId={this.portalId}
                inheritParentWidth={true}
                containerStyle={{ 'z-index': dropdownZIndex }}
            >
                <limel-menu-surface
                    open={this.showCompletions}
                    allowClicksElement={this.limelInputField}
                    style={{
                        '--menu-surface-width': '100%',
                        'max-height': 'inherit',
                        display: 'flex',
                    }}
                    onDismiss={this.handleCloseMenu}
                >
                    {this.renderListResult()}
                </limel-menu-surface>
            </limel-portal>
        );
    };

    private renderListResult = () => {
        const filteredCompletions: ListItem[] = this.filterCompletions(
            this.getCurrentValue()
        );
        if (!filteredCompletions || filteredCompletions.length === 0) {
            return null;
        }

        return (
            <limel-list
                onChange={this.handleCompletionChange}
                onKeyDown={this.handleKeyDownInDropdown}
                type="selectable"
                items={filteredCompletions}
            />
        );
    };

    private handleKeyDownInDropdown = (event: KeyboardEvent) => {
        const keyFound = [TAB, ESCAPE, ENTER].includes(event.key);
        if (keyFound) {
            this.setFocus();
        }
    };

    private handleCloseMenu = () => {
        this.showCompletions = false;
    };

    private filterCompletions = (filter: string) => {
        if (!filter) {
            return this.completionsList;
        }

        return this.completionsList.filter((completion) =>
            completion.text.toLowerCase().includes(filter.toLowerCase())
        );
    };

    private handleInput = (event) => {
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

        this.changeWaiting = true;
        this.changeEmitter(value);
    };

    private changeEmitter = debounce((value: string) => {
        this.change.emit(value);
        this.changeWaiting = false;
    }, CHANGE_EVENT_DEBOUNCE_TIMEOUT);

    private handleChange = (event: Event) => {
        event.stopPropagation();
        this.changeEmitter.flush();
    };

    private handleIconClick = () => {
        this.action.emit();
    };

    private handleIconKeyPress = (event: KeyboardEvent) => {
        const isEnter = event.key === ENTER;
        const isSpace = event.key === SPACE;

        if (isSpace || isEnter) {
            this.action.emit();
        }
    };

    private handleWheel = () => {
        // This empty event handler is here to circumvent a bug.
        // In some browsers (Chrome for example), hovering the input with
        // the input focused, and scrolling, will both change the value
        // AND scroll the page. We would prefer to never change the value
        // on scroll, instead always scrolling the page, but since we
        // haven't found a way to do that, this is the next best thing, as
        // it prevents the page from being scrolled, but only in the
        // circumstances when the value is changed by the scrolling.
        // Please test THOROUGHLY if you remove this event handler 😄
    };
}
