import { MDCTextField } from '@material/textfield';
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
import { debounce } from 'lodash-es';
import {
    ARROW_DOWN,
    ARROW_DOWN_KEY_CODE,
    ARROW_UP,
    ARROW_UP_KEY_CODE,
    ENTER,
    ENTER_KEY_CODE,
    ESCAPE,
    ESCAPE_KEY_CODE,
    SPACE,
    SPACE_KEY_CODE,
    TAB,
    TAB_KEY_CODE,
} from '../../util/keycodes';
import { InputType, ListItem } from '../../interface';
import { getHref, getTarget } from '../../util/link-helper';
import { JSXBase } from '@stencil/core/internal';
import { createRandomString } from '../../util/random-string';
import { LimelListCustomEvent } from 'src/components';
import config from '../../global/config';

interface LinkProperties {
    href: string;
    target?: string;
}

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
 */
@Component({
    tag: 'limel-input-field',
    shadow: true,
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
    public trailingIcon: string;

    /**
     * Leading icon to show to the far left in the field.
     */
    @Prop({ reflect: true })
    public leadingIcon: string;

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
    public locale: string = config.defaultLocale;

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
    private portalId: string;
    private helperTextId: string;
    private labelId: string;

    constructor() {
        const debounceTimeout = 300;
        this.changeEmitter = debounce(this.changeEmitter, debounceTimeout);

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

        window.removeEventListener('resize', this.layout);
        this.limelInputField.removeEventListener('focus', this.setFocus);
    }

    public componentDidUpdate() {
        if (this.invalid) {
            this.mdcTextField.valid = false;
        }
    }

    public render() {
        const properties = this.getAdditionalProps();
        properties['aria-labelledby'] = this.labelId;
        properties.class = 'mdc-text-field__input';
        properties.onInput = this.handleChange;
        properties.onFocus = this.onFocus;
        properties.onBlur = this.onBlur;
        properties.required = this.required;
        properties.readonly = this.readonly;
        properties.disabled = this.disabled || this.readonly;

        if (this.hasHelperText()) {
            properties['aria-controls'] = this.helperTextId;
            properties['aria-describedby'] = this.helperTextId;
        }

        return [
            <label class={this.getContainerClassList()}>
                <span class="mdc-notched-outline" tabindex="-1">
                    <span class="mdc-notched-outline__leading"></span>
                    {this.renderLabel()}
                    <span class="mdc-notched-outline__trailing"></span>
                </span>
                {this.renderLeadingIcon()}
                {this.renderEmptyValueForReadonly()}
                {this.renderPrefix()}
                {this.renderFormattedNumber()}
                {this.renderInput(properties)}
                {this.renderSuffix()}
                {this.renderTextarea(properties)}
                {this.renderTrailingLinkOrButton()}
            </label>,
            this.renderHelperLine(),
            this.renderAutocompleteList(),
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
            'mdc-text-field--no-label': !this.label,
            'mdc-text-field--outlined': true,
            'mdc-text-field--invalid': this.isInvalid(),
            'mdc-text-field--disabled': this.disabled || this.readonly,
            'lime-text-field--readonly': this.readonly,
            'mdc-text-field--required': this.required,
            'lime-text-field--empty': !this.value,
            'lime-has-prefix': this.hasPrefix(),
            'lime-has-suffix': this.hasSuffix(),
        };

        if (this.type === 'textarea') {
            classList['mdc-text-field--textarea'] = true;
            classList['has-helper-line'] =
                !!this.helperText || !!this.maxlength;
        } else {
            classList['mdc-text-field--with-leading-icon'] = !!this.leadingIcon;
            classList['mdc-text-field--with-trailing-icon'] =
                !!this.getTrailingIcon();
        }

        return classList;
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
                value={this.value}
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
                <textarea {...properties} placeholder={this.placeholder}>
                    {this.value}
                </textarea>
            </span>
        );
    };

    private layout = () => {
        this.mdcTextField?.layout();
    };

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
        this.isModified = true;
    };

    private renderHelperLine = () => {
        const text: string = this.value || '';
        const length = text.length;

        if (!this.maxlength && !this.hasHelperText()) {
            return;
        }

        return (
            <limel-helper-line
                helperTextId={this.helperTextId}
                helperText={this.helperText}
                length={length}
                maxLength={this.maxlength}
                invalid={this.isInvalid()}
            />
        );
    };

    private renderEmptyValueForReadonly = () => {
        if (this.readonly && !this.value) {
            return (
                <span class="lime-empty-value-for-readonly lime-looks-like-input-value">
                    –
                </span>
            );
        }
    };

    private hasHelperText = () => {
        return this.helperText !== null && this.helperText !== undefined;
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

        if (!this.isModified) {
            return false;
        }

        const element = this.getInputElement();

        return !(element && element.checkValidity());
    };

    private getInputElement = (): HTMLInputElement | HTMLTextAreaElement => {
        let elementName = 'input';
        if (this.type === 'textarea') {
            elementName = 'textarea';
        }

        return this.limelInputField.shadowRoot.querySelector(elementName);
    };

    private renderLabel = () => {
        const labelClassList = {
            'mdc-floating-label': true,
            'mdc-floating-label--float-above':
                !!this.value || this.isFocused || this.readonly,
        };

        if (!this.label) {
            return;
        }

        return (
            <span class="mdc-notched-outline__notch">
                <span class={labelClassList} id={this.labelId}>
                    {this.label}
                </span>
            </span>
        );
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

        const html = [];

        const trailingIcon = this.getTrailingIcon();

        if (!this.isInvalid() && this.hasLink()) {
            html.push(this.renderLinkIcon(this.getLink(), trailingIcon));
        } else if (trailingIcon) {
            html.push(this.renderTrailingIcon(trailingIcon));
        }

        return html;
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
            case 'email':
                props.href = `mailto:${this.value}`;
                break;
            case 'tel':
                props.href = `tel:${this.value}`;
                break;
            default:
                props.href = getHref(this.value);
                props.target = getTarget(this.value);
        }

        return props;
    };

    private renderLinkIcon = (linkProps: LinkProperties, icon: string) => {
        // If the trailing icon uses the class `mdc-text-field__icon--trailing`,
        // MDC attaches a click handler to it, which apparently runs
        // `preventDefault()` on the event. For links, we don't want that,
        // so instead of `mdc-text-field__icon--trailing`, we use our own class
        // `lime-trailing-icon-for-link`, which uses all the same styling. /Ads
        return (
            <a
                {...linkProps}
                class="material-icons mdc-text-field__icon lime-trailing-icon-for-link"
                tabindex={this.disabled || !this.value ? '-1' : '0'}
                role="button"
            >
                <limel-icon name={icon} />
            </a>
        );
    };

    private renderTrailingIcon = (icon: string) => {
        const props: any = {
            tabIndex: this.isInvalid() ? '-1' : '0',
        };
        if (!this.isInvalid()) {
            props.onKeyPress = this.handleIconKeyPress;
            props.onClick = this.handleIconClick;
            props.role = 'button';
        }

        return (
            <i
                class="material-icons mdc-text-field__icon mdc-text-field__icon--trailing"
                {...props}
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
     * @param {KeyboardEvent} event event
     * @returns {void}
     */

    private onKeyDown = (event: KeyboardEvent): void => {
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
    };

    private renderAutocompleteList = () => {
        if (this.type === 'textarea' || !this.completions.length) {
            return;
        }

        return this.renderDropdown();
    };

    private renderPortal = (content = null) => {
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
                        '--mdc-menu-min-width': '100%',
                        'max-height': 'inherit',
                        display: 'flex',
                    }}
                    onDismiss={this.handleCloseMenu}
                >
                    {content}
                </limel-menu-surface>
            </limel-portal>
        );
    };

    private renderDropdown = () => {
        const content = this.renderListResult();

        return this.renderPortal(content);
    };

    private renderListResult = () => {
        const filteredCompletions: ListItem[] = this.filterCompletions(
            this.value
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
        const keyCodeFound = [
            TAB_KEY_CODE,
            ESCAPE_KEY_CODE,
            ENTER_KEY_CODE,
        ].includes(event.keyCode);
        if (keyFound || keyCodeFound) {
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

        return this.completionsList.filter(
            (completion) =>
                completion.text.toLowerCase().indexOf(filter.toLowerCase()) > -1
        );
    };

    private handleChange = (event) => {
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

        this.changeEmitter(value);
    };

    private changeEmitter = (value: string) => {
        this.change.emit(value);
    };

    private handleIconClick = () => {
        if (!this.isInvalid()) {
            this.action.emit();
        }
    };

    private handleIconKeyPress = (event: KeyboardEvent) => {
        const isEnter = event.key === ENTER || event.keyCode === ENTER_KEY_CODE;
        const isSpace = event.key === SPACE || event.keyCode === SPACE_KEY_CODE;

        if ((isSpace || isEnter) && !this.isInvalid()) {
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
