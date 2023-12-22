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
import { DateType, InputType, Languages } from '../../interface';
import { DateFormatter } from './dateFormatter';
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
     */
    @Prop({ reflect: true })
    public invalid = false;

    /**
     * Text to display next to the date picker
     */
    @Prop({ reflect: true })
    public label: string;

    /**
     * The placeholder text shown inside the input field, when the field is focused and empty
     */
    @Prop({ reflect: true })
    public placeholder: string;

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
     */
    @Prop()
    public formatter?: (date: Date) => string;

    /**
     * Emitted when the date picker value is changed.
     */
    @Event()
    private change: EventEmitter<Date>;

    @Element()
    private host: HTMLLimelDatePickerElement;

    @State()
    private formattedValue: string;

    @State()
    private internalFormat: string;
    @State()
    private showPortal = false;

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

        this.formattedValue = this.formatValue(this.value);
    }

    public componentWillUpdate() {
        this.updateInternalFormatAndType();
    }

    public render() {
        const inputProps: any = {
            onAction: this.clearValue,
        };

        if (this.value && !this.readonly) {
            inputProps.trailingIcon = 'clear_symbol';
        }

        if (this.useNative) {
            return (
                <limel-input-field
                    disabled={this.disabled}
                    readonly={this.readonly}
                    invalid={this.invalid}
                    label={this.label}
                    helperText={this.helperText}
                    required={this.required}
                    value={this.formattedValue}
                    type={this.nativeType}
                    onChange={this.nativeChangeHandler}
                />
            );
        }

        const dropdownZIndex = getComputedStyle(this.host).getPropertyValue(
            '--dropdown-z-index'
        );

        return [
            <limel-input-field
                disabled={this.disabled}
                readonly={this.readonly}
                invalid={this.invalid}
                label={this.label}
                placeholder={this.placeholder}
                helperText={this.helperText}
                required={this.required}
                value={this.formattedValue}
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
                    formatter={this.formatValue}
                    onChange={this.handleCalendarChange}
                />
            </limel-portal>,
        ];
    }

    @Watch('value')
    protected onValueChange(newValue: string, oldValue: string) {
        if (newValue !== oldValue && newValue !== this.formattedValue) {
            this.formattedValue = this.formatValue(this.value);
        }
    }

    private updateInternalFormatAndType() {
        this.nativeType = nativeTypeForConsumerType[this.type || 'default'];
        this.nativeFormat = nativeFormatForType[this.nativeType];

        if (this.useNative) {
            this.internalFormat = this.nativeFormat;
        } else if (this.formatter) {
            this.formatValue = this.formatter;
        } else if (this.format) {
            this.internalFormat = this.format;
        } else {
            this.internalFormat = this.dateFormatter.getDateFormat(this.type);
        }
    }

    private nativeChangeHandler(event: CustomEvent<string>) {
        event.stopPropagation();
        const date = this.dateFormatter.parseDate(
            event.detail,
            this.internalFormat
        );
        this.formattedValue = event.detail;
        this.change.emit(date);
    }

    private showCalendar(event) {
        this.showPortal = true;
        const inputElement = this.textField.shadowRoot.querySelector('input');
        setTimeout(() => {
            this.datePickerCalendar.inputElement = inputElement;
        });
        event.stopPropagation();

        document.addEventListener('mousedown', this.documentClickListener, {
            passive: true,
        });
        document.addEventListener('keydown', this.documentClickListener, {
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
        setTimeout(() => {
            this.showPortal = false;
        });
        document.removeEventListener('mousedown', this.documentClickListener);
        document.removeEventListener('keydown', this.documentClickListener);
        document.removeEventListener(
            'blur',
            this.preventBlurFromCalendarContainer
        );

        if (!this.pickerIsAutoClosing()) {
            this.fixFlatpickrFocusBug();
        }
    }

    private fixFlatpickrFocusBug() {
        // Flatpickr removes the focus from the input field
        // but the 'visual focus' is still there
        const mdcTextField = new MDCTextField(
            this.textField.shadowRoot.querySelector('.mdc-text-field')
        );
        mdcTextField.getDefaultFoundation().deactivateFocus();
    }

    private documentClickListener = (event: MouseEvent | KeyboardEvent) => {
        if (
            event.type === 'keydown' &&
            (event as KeyboardEvent).key !== 'Tab'
        ) {
            return;
        }

        const element = document.querySelector(`#${this.portalId}`);
        if (!element.contains(event.target as Node)) {
            this.hideCalendar();
        }
    };

    private handleCalendarChange(event) {
        const date = event.detail;
        this.formattedValue = this.formatValue(date);
        event.stopPropagation();
        if (this.pickerIsAutoClosing()) {
            this.hideCalendar();
        }

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

    private handleInputElementChange(event) {
        if (event.detail === '') {
            this.clearValue();
        }

        event.stopPropagation();
    }

    private pickerIsAutoClosing() {
        return this.type !== 'datetime' && this.type !== 'time';
    }

    private clearValue() {
        this.formattedValue = '';
        this.change.emit(null);
    }

    private formatValue = (value: Date): string =>
        this.dateFormatter.formatDate(value, this.internalFormat);
}
