import {
    Component,
    h,
    Prop,
    State,
    Element,
    EventEmitter,
    Event,
    Watch,
} from '@stencil/core';
import { createRandomString } from '../../util/random-string';
import { isAndroidDevice, isIOSDevice } from '../../util/device';
import { DateType, Languages } from '../date-picker/date.types';
import { InputType } from '../input-field/input-field.types';
import { DateFormatter } from './date-formatter';
import { MDCTextField } from '@material/textfield';
import translate from '../../global/translations';

// tslint:disable:no-duplicate-string
const nativeTypeForConsumerType: { [key: string]: InputType } = {
    date: 'date',
    time: 'time',
    // Mobile Safari feature detects as capable of input type `week`,
    // but it just displays a non-interactive input
    // TODO(ads): remove this when support is decent on iOS!
    week: isIOSDevice() ? 'date' : 'week',
    month: 'month',
    quarter: 'date',
    year: 'date',
    datetime: 'datetime-local',
    default: 'datetime-local',
};
const nativeFormatForType = {
    date: 'Y-MM-DD',
    time: 'HH:mm',
    week: 'GGGG-[W]WW',
    month: 'Y-MM',
    'datetime-local': 'Y-MM-DD[T]HH:mm',
};
// tslint:enable:no-duplicate-string

/**
 * @exampleComponent limel-example-date-picker-datetime
 * @exampleComponent limel-example-date-picker-date
 * @exampleComponent limel-example-date-picker-time
 * @exampleComponent limel-example-date-picker-week
 * @exampleComponent limel-example-date-picker-month
 * @exampleComponent limel-example-date-picker-quarter
 * @exampleComponent limel-example-date-picker-year
 * @exampleComponent limel-example-date-picker-formatted
 * @exampleComponent limel-example-date-picker-programmatic-change
 * @exampleComponent limel-example-date-picker-composite
 * @exampleComponent limel-example-date-picker-custom-formatter
 * @exampleComponent limel-example-date-picker-typed-input
 */
@Component({
    tag: 'limel-date-picker',
    shadow: true,
    styleUrl: 'date-picker.scss',
})
export class DatePicker {
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
     * Set to `true` to indicate that the current value of the date picker is
     * invalid.
     *
     * Note: this is separate from — and unaffected by — the component's own
     * detection of unparseable typed text. Use this prop for your own
     * business rules (e.g. `required`); the component flags format errors
     * on its own regardless of this value.
     */
    @Prop({ reflect: true })
    public invalid = false;

    /**
     * Text to display next to the date picker
     */
    @Prop({ reflect: true })
    public label: string;

    /**
     * The placeholder text shown inside the input field, when the field is focused and empty.
     *
     * Defaults to the expected date format (e.g. `MM/DD/YYYY`), so a
     * consumer that sets `format` gets a hint for what to type for free.
     */
    @Prop({ reflect: true })
    public placeholder: string;

    /**
     * Optional helper text to display below the input field when it has focus.
     *
     * While the typed text doesn't parse as a valid date, a message naming
     * the expected format is shown instead.
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
    @Prop()
    public value: Date;

    /**
     * Type of date picker.
     */
    @Prop({ reflect: true })
    public type: DateType = 'datetime';

    /**
     * Format to display the selected date in.
     */
    @Prop({ reflect: true })
    public format: string;

    /**
     * Defines the localisation for translations and date formatting.
     * Property `format` customizes the localized date format.
     */
    @Prop({ reflect: true })
    public language: Languages = 'en';

    /**
     * Custom formatting function. Will be used for date formatting.
     *
     * :::note
     * overrides `format` and `language`
     * :::
     *
     * Only while the field is at rest: `formatter` can't be inverted into
     * a pattern to validate typed text against, so while the field has
     * focus it's shown and validated using `format`/`language` instead,
     * then redisplayed via `formatter` once it's blurred.
     */
    @Prop()
    public formatter?: (date: Date) => string;

    /**
     * Emitted once when a typed date is committed (on blur or `Enter`),
     * when a date is picked in the calendar, or when the field is cleared
     * (with `null`). Typed text that does not parse never emits.
     */
    @Event()
    private change: EventEmitter<Date | null>;

    @Element()
    private host: HTMLLimelDatePickerElement;

    @State()
    private internalFormat: string;
    @State()
    private showPortal = false;

    /**
     * `true` while the text currently in the input field cannot be parsed
     * as a valid date in `internalFormat`. This is distinct from the
     * `invalid` prop: it's the component's own assessment of the typed
     * text, not a business rule set by the consumer.
     */
    @State()
    private parseError = false;

    /**
     * The text the user has typed but not yet committed, valid or not. While
     * set it is what the field shows, so a re-render never overwrites it
     * with the formatted `value`. `undefined` once the field shows `value`.
     */
    @State()
    private rawInputValue: string | undefined;

    /**
     * The date the calendar shows as selected ahead of `value`: typed text
     * that parses, or a date just picked in the calendar that the consumer
     * has not echoed back yet. `undefined` when the calendar should follow
     * `value`.
     */
    @State()
    private previewValue: Date | undefined;

    /**
     * `true` while the input field has focus. Drives which formatter
     * `getDisplayValue` shows the value with — see `formatter`'s doc
     * comment for why.
     */
    @State()
    private isEditing = false;

    private useNative: boolean;
    private nativeType: InputType;
    private nativeFormat: string;
    private textField: HTMLElement;
    private inputElement: HTMLInputElement;
    private datePickerCalendar: HTMLLimelFlatpickrAdapterElement;
    private portalId = `date-picker-calendar-${createRandomString()}`;
    private dateFormatter: DateFormatter;

    constructor() {
        this.handleCalendarChange = this.handleCalendarChange.bind(this);
        this.handleInputElementChange =
            this.handleInputElementChange.bind(this);
        this.showCalendar = this.showCalendar.bind(this);
        this.dateFormatter = new DateFormatter(this.language);
        this.clearValue = this.clearValue.bind(this);
        this.hideCalendar = this.hideCalendar.bind(this);
        this.onInputClick = this.onInputClick.bind(this);
        this.nativeChangeHandler = this.nativeChangeHandler.bind(this);
        this.preventBlurFromCalendarContainer =
            this.preventBlurFromCalendarContainer.bind(this);
    }

    public componentWillLoad() {
        this.useNative = !this.readonly && (isIOSDevice() || isAndroidDevice());

        this.updateInternalFormatAndType();
    }

    public componentWillUpdate() {
        this.updateInternalFormatAndType();
    }

    public disconnectedCallback() {
        this.removeDocumentListeners();
    }

    /**
     * A new `value` — the consumer echoing a committed date back, or an
     * external change — replaces whatever text was typed.
     */
    @Watch('value')
    protected watchValue() {
        this.resetTypedText();
    }

    /**
     * Typed text was validated against the previous format, so it is
     * dropped rather than shown as valid or invalid under the new one.
     */
    @Watch('format')
    @Watch('type')
    @Watch('language')
    protected watchFormatInputs() {
        this.resetTypedText();
    }

    public render() {
        const inputProps: any = {
            onAction: this.clearValue,
        };

        if (this.value && !this.readonly && !this.disabled) {
            inputProps.trailingIcon = 'clear_symbol';
        }

        const helperText = this.getHelperText();

        if (this.useNative) {
            return (
                <limel-input-field
                    disabled={this.disabled}
                    readonly={this.readonly}
                    invalid={this.invalid}
                    label={this.label}
                    helperText={helperText}
                    required={this.required}
                    value={this.formatValue(this.value)}
                    type={this.nativeType}
                    onChange={this.nativeChangeHandler}
                />
            );
        }

        const dropdownZIndex = getComputedStyle(this.host).getPropertyValue(
            '--dropdown-z-index'
        );

        const formatter = this.formatter || this.formatValue;

        return [
            <limel-input-field
                disabled={this.disabled}
                readonly={this.readonly}
                invalid={this.invalid || this.parseError}
                label={this.label}
                placeholder={this.getPlaceholder()}
                helperText={helperText}
                required={this.required}
                value={this.getDisplayValue(formatter)}
                onFocus={this.showCalendar}
                onBlur={this.hideCalendar}
                onClick={this.onInputClick}
                onChange={this.handleInputElementChange}
                onKeyDown={this.handleKeyDown}
                ref={(el) => (this.textField = el)}
                {...inputProps}
            />,
            <limel-portal
                containerId={this.portalId}
                visible={this.showPortal}
                containerStyle={{ 'z-index': dropdownZIndex }}
            >
                <limel-flatpickr-adapter
                    format={this.internalFormat}
                    language={this.language}
                    type={this.type}
                    value={this.value}
                    previewValue={this.previewValue}
                    ref={(el) => (this.datePickerCalendar = el)}
                    isOpen={this.showPortal}
                    onChange={this.handleCalendarChange}
                />
            </limel-portal>,
        ];
    }

    /**
     * What the text field should show: the typed text if there is any,
     * otherwise the formatted `value`.
     * @param formatter - formats `value` for display while the field is
     * at rest; while focused `internalFormat` is used so the text matches
     * the placeholder and what typed input is parsed against
     */
    private getDisplayValue(formatter: (date: Date) => string): string {
        if (this.rawInputValue !== undefined) {
            return this.rawInputValue;
        }

        if (!this.value) {
            return '';
        }

        return this.isEditing
            ? this.formatValue(this.value)
            : formatter(this.value);
    }

    private getPlaceholder(): string {
        return (
            this.placeholder ??
            this.dateFormatter.expandFormat(this.internalFormat)
        );
    }

    private getHelperText(): string {
        if (this.parseError) {
            // `language` is often set to get a locale's date format rather
            // than to pick the UI language (e.g. `sv` for ISO dates in an
            // English app), so this message follows the app's own language.
            const appLanguage = document.documentElement.lang || this.language;

            return translate.get('date-picker.invalid-format', appLanguage, {
                format: this.dateFormatter.expandFormat(this.internalFormat),
            });
        }

        return this.disabled || this.readonly ? undefined : this.helperText;
    }

    private updateInternalFormatAndType() {
        this.nativeType = nativeTypeForConsumerType[this.type || 'default'];
        this.nativeFormat = nativeFormatForType[this.nativeType];

        if (this.useNative) {
            this.internalFormat = this.nativeFormat;
        } else if (this.format) {
            this.internalFormat = this.format;
        } else {
            // Deliberately ignores `formatter`: it's an arbitrary function
            // for *displaying* an already-committed value (e.g. via
            // `Intl.DateTimeFormat`), with no format string to invert, so
            // it can't tell us what pattern typed text should be validated
            // against. Falling back to the locale default here — rather
            // than leaving `internalFormat` undefined — is what typed
            // input is parsed against, and what the placeholder and
            // invalid-format message show.
            this.internalFormat = this.dateFormatter.getDateFormat(this.type);
        }
    }

    private nativeChangeHandler(event: CustomEvent<string>) {
        event.stopPropagation();

        // An emptied native input must clear the value, like the clear
        // icon does; `parseText` would just return `null` for it.
        if (event.detail === '') {
            this.clearValue();

            return;
        }

        const date = this.parseText(event.detail);
        if (date) {
            this.change.emit(date);
        }
    }

    private showCalendar(event) {
        if (this.disabled || this.readonly) {
            event.stopPropagation();

            return;
        }
        this.isEditing = true;
        this.showPortal = true;
        this.inputElement = this.textField.shadowRoot.querySelector('input');
        // Deferred off the current call stack so the adapter has rendered;
        // setting this is what creates the calendar on the first focus.
        queueMicrotask(() => {
            this.datePickerCalendar.inputElement = this.inputElement;
        });
        event.stopPropagation();

        document.addEventListener('mousedown', this.documentClickListener, {
            passive: true,
        });

        document.addEventListener(
            'blur',
            this.preventBlurFromCalendarContainer,
            {
                capture: true,
            }
        );
    }

    private preventBlurFromCalendarContainer(event) {
        // We don't want the input element to lose focus when we pick
        // a date in the calendar container.
        // This is also required in order to not close the non
        // automatically closing pickers (type datetime and time)
        // when you pick a value.
        if (event.relatedTarget === this.datePickerCalendar) {
            event.stopPropagation();
        }
    }

    private hideCalendar() {
        this.isEditing = false;
        this.commitTypedText();

        setTimeout(() => {
            this.showPortal = false;
        }, 0);

        this.removeDocumentListeners();

        if (!this.pickerIsAutoClosing()) {
            this.fixFlatpickrFocusBug();
        }
    }

    private removeDocumentListeners() {
        document.removeEventListener('mousedown', this.documentClickListener);
        document.removeEventListener(
            'blur',
            this.preventBlurFromCalendarContainer,
            { capture: true }
        );
    }

    private fixFlatpickrFocusBug() {
        // Flatpickr removes the focus from the input field
        // but the 'visual focus' is still there
        const root =
            this.textField?.shadowRoot?.querySelector('.mdc-text-field');
        if (!root) {
            return;
        }
        const mdcTextField = new MDCTextField(root);
        mdcTextField.getDefaultFoundation().deactivateFocus();
        mdcTextField.valid = !(this.invalid || this.parseError);
    }

    private documentClickListener = (event: MouseEvent) => {
        if (event.composedPath().includes(this.textField)) {
            return;
        }

        const element = document.querySelector(`#${this.portalId}`);
        if (element.contains(event.target as Node)) {
            return;
        }

        // `mousedown` fires before the input's `change` and `blur`, so a
        // still-focused input is left to its imminent blur, which runs
        // `hideCalendar` with the final typed text. This listener only has
        // to close the calendar when focus is inside it (datetime/time).
        if (this.textField.shadowRoot.activeElement === this.inputElement) {
            return;
        }

        this.hideCalendar();
    };

    private handleCalendarChange(event: CustomEvent<Date | null>) {
        event.stopPropagation();

        // Reset before hiding, so the pick is not overridden by a commit
        // of text typed earlier. The pick itself stays previewed, or the
        // calendar would revert to the old `value` until the consumer
        // echoes the new one back.
        this.resetTypedText();
        this.previewValue = event.detail ?? undefined;

        if (this.pickerIsAutoClosing()) {
            this.hideCalendar();
        }

        this.change.emit(event.detail);
    }

    private onInputClick(event) {
        if (this.disabled || this.readonly || this.showPortal) {
            return;
        }

        this.showCalendar(event);
    }

    /**
     * Tracks the typed text and whether it parses, for live feedback only:
     * the invalid state on the field and the previewed date in the calendar.
     * The input field emits this on a debounce while typing, so nothing is
     * committed here; that happens in `commitTypedText` when editing ends.
     * @param event - the input field's `change` event; `event.detail` is
     * the current text
     */
    private handleInputElementChange(event: CustomEvent<string>) {
        event.stopPropagation();

        if (this.disabled || this.readonly) {
            return;
        }

        const text = event.detail;
        const date = text === '' ? null : this.parseText(text);
        this.rawInputValue = text;
        this.parseError = text !== '' && !date;
        this.previewValue = date ?? undefined;
    }

    private handleKeyDown = (event: KeyboardEvent) => {
        if (event.key !== 'Enter' || this.disabled || this.readonly) {
            return;
        }

        const currentText = this.inputElement?.value ?? '';

        if (currentText !== '' && !this.parseText(currentText)) {
            this.rawInputValue = currentText;
            this.parseError = true;
            return;
        }

        // Blurring runs the same flush → `hideCalendar` → commit chain as
        // tabbing away, so there is a single commit path.
        this.inputElement?.blur();
    };

    /**
     * Emits the typed text as a value change, once, when editing ends.
     * Unchanged text is a no-op, empty text clears the value, and text
     * that does not parse stays visible flagged as invalid.
     */
    private commitTypedText() {
        const text = this.rawInputValue;
        if (text === undefined) {
            return;
        }

        const currentText = this.value ? this.formatValue(this.value) : '';
        if (text === currentText) {
            this.resetTypedText();

            return;
        }

        if (text === '') {
            this.parseError = false;
            if (this.value) {
                this.change.emit(null);
            } else {
                this.rawInputValue = undefined;
            }

            return;
        }

        const date = this.parseText(text);
        if (!date) {
            this.parseError = true;

            return;
        }

        // `rawInputValue` is kept until the consumer echoes the new value
        // back through `watchValue`; clearing it here would show the old
        // value for a frame first.
        this.parseError = false;
        this.change.emit(date);
    }

    private parseText(text: string): Date | null {
        const date = this.dateFormatter.parseDate(text, this.internalFormat);

        return date && !Number.isNaN(date.getTime()) ? date : null;
    }

    private resetTypedText() {
        this.parseError = false;
        this.rawInputValue = undefined;
        this.previewValue = undefined;
    }

    private pickerIsAutoClosing() {
        return this.type !== 'datetime' && this.type !== 'time';
    }

    private clearValue() {
        this.resetTypedText();
        this.change.emit(null);
    }

    private formatValue = (value: Date): string =>
        this.dateFormatter.formatDate(value, this.internalFormat);
}
