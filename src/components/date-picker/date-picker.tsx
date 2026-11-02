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
import { createLiveMessage } from '../../util/live-message';
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
     * invalid. Typed text that is not a valid date is flagged by the
     * component itself, whatever this is set to.
     */
    @Prop({ reflect: true })
    public invalid = false;

    /**
     * Text to display next to the date picker
     */
    @Prop({ reflect: true })
    public label: string;

    /**
     * A hint about what to type, such as an example or the format of the
     * value. It is shown inside the field when the field is focused and empty,
     * but not on iOS and Android, where the native date picker is used.
     *
     * Do not use it instead of a `label`, and do not put anything in it that
     * the user needs to know. It disappears when the user starts to type, and
     * some screen readers do not read it. Use `helperText` for that.
     */
    @Prop({ reflect: true })
    public placeholder: string;

    /**
     * Optional helper text to display below the input field when it has focus.
     * Screen readers read it as the description of the field, so use it for
     * what the user needs to know, such as the format of the value or a
     * requirement.
     *
     * While the typed text is not a valid date, an error with an example
     * of the expected format is shown instead.
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
     * overrides `format` and `language`. A date can only be typed into the
     * field when `format` is set as well, to the pattern your `formatter`
     * produces. Typed text is parsed with `format` and `language`, and the
     * field shows the value in `format` while it is being edited.
     * :::
     */
    @Prop()
    public formatter?: (date: Date) => string;

    /**
     * Emitted when a typed date is committed (on blur or `Enter`), when a
     * date is picked in the calendar, and with `null` when the field is
     * cleared. Typed text that is not a valid date is not emitted, so
     * `value` keeps the last valid date, and `invalidInput` is emitted
     * instead.
     *
     * A two-digit year is read as a full year, so `1/24/20` is 2020.
     */
    @Event()
    private change: EventEmitter<Date>;

    /**
     * Emitted with the error message when typed text that is not a valid
     * date is committed, and with `null` when the field no longer holds
     * such text.
     */
    @Event()
    private invalidInput: EventEmitter<string | null>;

    @Element()
    private host: HTMLLimelDatePickerElement;

    @State()
    private internalFormat: string;
    @State()
    private showPortal = false;

    @State()
    private parseError = false;

    // Typed text that is not committed yet.
    @State()
    private rawInputValue: string | undefined;

    /**
     * Shown as selected in the calendar instead of `value`: a valid typed
     * date, or a pick the consumer has not echoed back yet.
     */
    @State()
    private previewValue: Date | undefined;

    @State()
    private isEditing = false;

    // The input field emits debounced, so text discarded with Escape can
    // still arrive afterwards.
    private discardedText: string | undefined;

    // So a consumer that doesn't echo the value back gets no repeated `change`.
    private committedText: string | undefined;

    private useNative: boolean;
    private nativeType: InputType;
    private nativeFormat: string;
    private textField: HTMLElement;
    private inputElement: HTMLInputElement;
    private datePickerCalendar: HTMLLimelFlatpickrAdapterElement;
    private portalId = `date-picker-calendar-${createRandomString()}`;
    private dateFormatter: DateFormatter;

    // Screen readers don't announce a changed description of the focused
    // field, so the error is spoken through a live region.
    private readonly errorMessage = createLiveMessage(() =>
        this.parseError ? this.getHelperText() : ''
    );

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
        this.commitTypedText = this.commitTypedText.bind(this);
        this.handleInputBlur = this.handleInputBlur.bind(this);
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
        this.inputElement?.removeEventListener('blur', this.handleInputBlur);
        this.errorMessage.update.cancel();
    }

    // Consumers such as `limel-form` pass a new `Date` on every render.
    @Watch('value')
    protected watchValue(newValue?: Date, oldValue?: Date) {
        if (newValue?.getTime() === oldValue?.getTime()) {
            return;
        }

        this.resetTypedText();
    }

    @Watch('parseError')
    protected watchParseError() {
        this.errorMessage.update();
        this.invalidInput.emit(
            this.parseError ? this.getInvalidInputMessage() : null
        );
    }

    @Watch('format')
    @Watch('type')
    protected watchFormatInputs() {
        this.resetTypedText();
    }

    @Watch('language')
    protected watchLanguage() {
        this.dateFormatter = new DateFormatter(this.language);
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
                placeholder={this.placeholder}
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
            <span
                class="error-message"
                aria-live="polite"
                ref={this.errorMessage.setElement}
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

    private getDisplayValue(formatter: (date: Date) => string): string {
        if (this.rawInputValue !== undefined) {
            return this.rawInputValue;
        }

        if (!this.value) {
            return '';
        }

        return this.isEditing && this.acceptsTypedInput()
            ? this.formatValue(this.value)
            : formatter(this.value);
    }

    private acceptsTypedInput(): boolean {
        return !this.formatter || !!this.format;
    }

    private getHelperText(): string {
        if (this.parseError) {
            return this.getInvalidInputMessage();
        }

        if (this.disabled || this.readonly) {
            return undefined;
        }

        return this.helperText;
    }

    private getInvalidInputMessage(): string {
        const key =
            this.type === 'time'
                ? 'date-picker.invalid-time-format'
                : 'date-picker.invalid-format';

        return translate.get(key, this.language, {
            example: this.formatValue(new Date()),
        });
    }

    private updateInternalFormatAndType() {
        this.nativeType = nativeTypeForConsumerType[this.type || 'default'];
        this.nativeFormat = nativeFormatForType[this.nativeType];

        if (this.useNative) {
            this.internalFormat = this.nativeFormat;
        } else if (this.format) {
            this.internalFormat = this.format;
        } else {
            this.internalFormat = this.dateFormatter.getDateFormat(this.type);
        }
    }

    private nativeChangeHandler(event: CustomEvent<string>) {
        event.stopPropagation();

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
        this.setUpInputElement();
        // Wait for the adapter to render. This creates the calendar.
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

    // Tabbing to the clear icon doesn't blur the input field, only its
    // input. Its `readonly` prop would also stop the calendar from opening.
    private setUpInputElement() {
        this.inputElement = this.textField.shadowRoot.querySelector('input');
        this.inputElement.readOnly = !this.acceptsTypedInput();
        this.inputElement.addEventListener('blur', this.handleInputBlur);
    }

    private handleInputBlur(event: FocusEvent) {
        const nextFocus = event.relatedTarget as HTMLElement | null;
        this.commitTypedText();

        if (!nextFocus) {
            return;
        }

        requestAnimationFrame(() => {
            if (!nextFocus.isConnected) {
                this.inputElement.focus();
            }
        });
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
        // Removes the listeners but keeps the classes set above.
        mdcTextField.destroy();
    }

    private documentClickListener = (event: MouseEvent) => {
        if (event.composedPath().includes(this.textField)) {
            return;
        }

        const element = document.querySelector(`#${this.portalId}`);
        if (element.contains(event.target as Node)) {
            return;
        }

        // The input's own blur, which follows, closes the calendar with the
        // final typed text.
        if (this.textField.shadowRoot.activeElement === this.inputElement) {
            return;
        }

        this.hideCalendar();
    };

    private handleCalendarChange(event: CustomEvent<Date | null>) {
        event.stopPropagation();

        // Reset before hiding, or text typed earlier is committed over the
        // pick. Preview the pick until the consumer echoes it back.
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

    private handleInputElementChange(event: CustomEvent<string>) {
        event.stopPropagation();

        if (this.disabled || this.readonly || !this.acceptsTypedInput()) {
            return;
        }

        const text = event.detail;
        if (text === this.discardedText) {
            return;
        }

        const date = text === '' ? null : this.parseText(text);
        this.rawInputValue = text;
        this.previewValue = date ?? undefined;

        // Half-typed text is only flagged on commit.
        if (date || text === '') {
            this.parseError = false;
        }
    }

    private handleKeyDown = (event: KeyboardEvent) => {
        if (this.disabled || this.readonly) {
            return;
        }

        this.discardedText = undefined;

        const handlers: Record<string, (event: KeyboardEvent) => void> = {
            ArrowDown: this.handleArrowDown,
            Escape: this.handleEscape,
            Enter: this.handleEnter,
            Backspace: this.handleDelete,
            Delete: this.handleDelete,
        };

        handlers[event.key]?.(event);
    };

    private handleArrowDown = async (event: KeyboardEvent) => {
        event.preventDefault();

        if (!this.showPortal) {
            this.showPortal = true;

            return;
        }

        await this.datePickerCalendar?.focusDay();
    };

    // The first Escape discards typed text, the next closes the calendar.
    // Stopping it keeps a surrounding dialog open.
    private handleEscape = (event: KeyboardEvent) => {
        if (this.hasTypedText()) {
            this.discardTypedText();
        } else if (this.showPortal) {
            this.showPortal = false;
        } else {
            return;
        }

        event.preventDefault();
        event.stopPropagation();
    };

    private hasTypedText(): boolean {
        return (
            this.rawInputValue !== undefined ||
            this.inputElement?.value !== this.getCommittedText()
        );
    }

    // The input field only rewrites its text when its `value` changes.
    private discardTypedText() {
        this.discardedText = this.inputElement?.value;
        this.resetTypedText();
        if (this.inputElement) {
            this.inputElement.value = this.getCommittedText();
        }
    }

    private getCommittedText(): string {
        return this.getDisplayValue(this.formatter || this.formatValue);
    }

    // Reads the input, since the input field emits its text debounced.
    private handleEnter = () => {
        if (!this.acceptsTypedInput()) {
            return;
        }

        const currentText = this.inputElement?.value ?? '';
        this.rawInputValue = currentText;

        if (currentText !== '' && !this.parseText(currentText)) {
            this.parseError = true;

            return;
        }

        this.commitTypedText();
    };

    private handleDelete = () => {
        if (this.acceptsTypedInput() || !this.value) {
            return;
        }

        this.clearValue();
    };

    private commitTypedText() {
        const text = this.rawInputValue;
        if (text === undefined || text === this.committedText) {
            return;
        }

        const currentText = this.value ? this.formatValue(this.value) : '';
        if (text === currentText) {
            this.resetTypedText();

            return;
        }

        if (text === '') {
            this.commitEmptyText();

            return;
        }

        this.commitDate(text);
    }

    private commitEmptyText() {
        this.parseError = false;
        if (this.value) {
            this.emitCommitted('', null);
        } else {
            this.rawInputValue = undefined;
        }
    }

    private commitDate(text: string) {
        const date = this.parseText(text);
        if (!date) {
            this.parseError = true;

            return;
        }

        if (date.getTime() === this.value?.getTime()) {
            this.resetTypedText();

            return;
        }

        this.parseError = false;
        this.emitCommitted(text, date);
    }

    // Keeps `rawInputValue` until `watchValue` resets it, or the old value
    // flashes.
    private emitCommitted(text: string, date: Date | null) {
        this.committedText = text;
        this.change.emit(date);
    }

    private parseText(text: string): Date | null {
        const date = this.dateFormatter.parseDate(text, this.internalFormat);

        return date && !Number.isNaN(date.getTime()) ? date : null;
    }

    private resetTypedText() {
        this.parseError = false;
        this.committedText = undefined;
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
