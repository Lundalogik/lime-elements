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
     * Overridden by `invalidFormatMessage` while the typed text doesn't
     * parse as a valid date.
     */
    @Prop({ reflect: true })
    public helperText: string;

    /**
     * Message shown instead of `helperText` when the text currently typed
     * into the field cannot be parsed as a date. If omitted, a generic
     * message naming the expected format is shown.
     */
    @Prop({ reflect: true })
    public invalidFormatMessage: string;

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
     * Emitted when the date picker value is changed, whether by typing a
     * valid date and committing it, picking a day in the calendar, choosing
     * "Today", or clearing the field. This is the single source of truth
     * for value changes — it always fires, regardless of which interaction
     * caused it.
     */
    @Event()
    private change: EventEmitter<Date>;

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
     * Holds the user's raw, uncommitted, unparseable text so it stays
     * visible (instead of being overwritten by the last valid `value` on
     * re-render) until it's corrected, cleared, or overridden by picking a
     * date from the calendar.
     */
    @State()
    private rawInputValue: string | undefined;

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
     * If the value changes from outside (e.g. the consumer resets a form,
     * or another control updates this field programmatically), drop any
     * stale parse-error state so the field reflects the new value instead
     * of leftover invalid text.
     */
    @Watch('value')
    protected watchValue() {
        this.parseError = false;
        this.rawInputValue = undefined;
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
                    ref={(el) => (this.datePickerCalendar = el)}
                    isOpen={this.showPortal}
                    onChange={this.handleCalendarChange}
                />
            </limel-portal>,
        ];
    }

    /**
     * What the text field should currently show: the raw text the user is
     * mid-typing (whether or not it currently parses) if there is any,
     * otherwise the formatted committed value.
     * @param formatter - formats `value` for display when there's no
     * typed text to show instead
     */
    private getDisplayValue(formatter: (date: Date) => string): string {
        if (this.parseError && this.rawInputValue !== undefined) {
            return this.rawInputValue;
        }

        if (this.isEditing) {
            if (this.rawInputValue !== undefined) {
                return this.rawInputValue;
            }

            // Focused, but nothing typed yet: show the internalFormat-based
            // text (matches the placeholder and what typed input gets
            // parsed against), not `formatter`'s pretty text, which might
            // use a totally different pattern — see `formatter`'s doc
            // comment.
            return this.value ? this.formatValue(this.value) : '';
        }

        return this.value ? formatter(this.value) : '';
    }

    private getPlaceholder(): string {
        return (
            this.placeholder ??
            this.dateFormatter.expandFormat(this.internalFormat)
        );
    }

    private getHelperText(): string {
        if (this.parseError) {
            return (
                this.invalidFormatMessage ??
                `Enter a valid date (${this.dateFormatter.expandFormat(this.internalFormat)})`
            );
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
        const date = this.dateFormatter.parseDate(
            event.detail,
            this.internalFormat
        );

        if (date && !Number.isNaN(date.getTime())) {
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
        const inputElement = this.textField.shadowRoot.querySelector('input');
        // A microtask, not a `setTimeout`: on the very first focus, this is
        // what creates the Flatpickr instance (see
        // `DatePickerCalendar.componentDidUpdate`), and Flatpickr's own
        // constructor synchronously writes its computed value into the
        // input's DOM value as part of setup. A macrotask delay left a
        // window where that write could land after the user had already
        // started typing, silently overwriting their first keystrokes.
        // Microtasks always drain before the next keystroke is processed,
        // so this closes that window while still deferring off the current
        // call stack.
        queueMicrotask(() => {
            this.datePickerCalendar.inputElement = inputElement;
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

        if (!this.parseError) {
            // Done editing a valid value: drop the preserved raw typed
            // text so the next focus starts from the current committed
            // value instead of a stale partial edit. Left alone while
            // `parseError` is true, so the invalid text stays visible to
            // fix even after losing focus.
            this.rawInputValue = undefined;
        }

        setTimeout(() => {
            this.showPortal = false;
        });

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
        if (!element.contains(event.target as Node)) {
            this.hideCalendar();
        }
    };

    private handleCalendarChange(event) {
        const date = event.detail;
        event.stopPropagation();

        if (date === null && this.parseError) {
            // Flatpickr independently tries to parse whatever is in the
            // input on blur too, and clears it when that fails — racing
            // the typed-input handling above, which (for the same blur)
            // already correctly flagged this text as invalid and is
            // preserving it for the user to fix. Let that stand rather
            // than have Flatpickr's own clear silently wipe it out.
            return;
        }

        if (this.pickerIsAutoClosing()) {
            this.hideCalendar();
        }

        this.parseError = false;
        this.rawInputValue = undefined;
        this.change.emit(date);
    }

    private onInputClick(event) {
        if (this.disabled || this.readonly) {
            return;
        }

        if (this.showPortal) {
            return;
        }

        this.showCalendar(event);
    }

    /**
     * Handles every text-field commit: typing a date and blurring/pressing
     * enter, or emptying the field. This is the path that previously only
     * reacted to an emptied field — it now also parses whatever text was
     * typed and, if it's a valid date, emits it exactly the same way a
     * calendar pick does.
     * @param event - the input field's `change` event; `event.detail` is
     * the current raw text
     */
    private handleInputElementChange(event: CustomEvent<string>) {
        if (this.disabled || this.readonly) {
            event.stopPropagation();
            return;
        }

        event.stopPropagation();

        const text = event.detail;

        if (text === '') {
            this.parseError = false;
            this.rawInputValue = undefined;
            this.clearValue();
            return;
        }

        const date = this.dateFormatter.parseDate(text, this.internalFormat);

        if (date && !Number.isNaN(date.getTime())) {
            this.parseError = false;
            // Keep showing exactly what was typed rather than the freshly
            // committed value's canonical (e.g. zero-padded) formatting:
            // this fires on a debounce, not just on blur, so a 2-digit
            // year someone is still typing toward 4 digits (e.g. "20" on
            // its way to "2026") already parses as valid shorthand and
            // would otherwise get rewritten to "2020" out from under
            // their next keystrokes. `hideCalendar` clears this once
            // they're actually done editing.
            this.rawInputValue = text;
            this.change.emit(date);
        } else {
            // Don't emit a change and don't let the next render overwrite
            // what the user typed with the old committed value — keep it
            // visible, flagged as invalid, until it's fixed or replaced.
            this.parseError = true;
            this.rawInputValue = text;
        }
    }

    private pickerIsAutoClosing() {
        return this.type !== 'datetime' && this.type !== 'time';
    }

    private clearValue() {
        // Mirrors the `text === ''` branch of `handleInputElementChange`:
        // without resetting these first, any `rawInputValue` left over
        // from earlier typing (valid or not) would keep winning in
        // `getDisplayValue` forever afterward — `value` turning falsy
        // doesn't matter once that check is reached — making the field
        // look permanently stuck on stale text no matter what's typed
        // next.
        this.parseError = false;
        this.rawInputValue = undefined;
        this.change.emit(null);
    }

    private formatValue = (value: Date): string =>
        this.dateFormatter.formatDate(value, this.internalFormat);
}
