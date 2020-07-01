import {
    Component,
    h,
    Prop,
    State,
    EventEmitter,
    Event,
    Watch,
} from '@stencil/core';
import { createRandomString } from '../../util/random-string';
import { isAndroidDevice, isIOSDevice } from '../../util/device';
import { DateType, InputType, Languages } from '@limetech/lime-elements';
import { DateFormatter } from './dateFormatter';

@Component({
    tag: 'limel-date-picker',
    shadow: true,
    styleUrl: 'date-picker.scss',
})
export class DatePicker {
    /**
     * Disables the date picker when `true`.
     * Defaults to `false`.
     */
    @Prop()
    public disabled: boolean;

    /**
     * Set to `true` to indicate that the current value of the date picker is
     * invalid.
     * Defaults to `false`.
     */
    @Prop()
    public invalid: boolean;

    /**
     * Text to display next to the date picker
     */
    @Prop()
    public label: string;

    /**
     * Optional helper text to display below the input field when it has focus
     */
    @Prop()
    public helperText: string;

    /**
     * Set to `true` to indicate that the field is required.
     * Defaults to `false`.
     */
    @Prop()
    public required: boolean;

    /**
     * The value of the field.
     */
    @Prop()
    public value: Date;

    /**
     * Type of date picker. Defaults to `datetime`
     */
    @Prop()
    public type: DateType = 'datetime';

    /**
     * Format to display the selected date in
     */
    @Prop()
    public format: string;

    /**
     * Defines the localisation for translations and date formatting.
     * Property `format` customizes the localized date format.
     */
    @Prop()
    public language: Languages = 'en';

    /**
     * Emitted when the date picker value is changed.
     */
    @Event()
    private change: EventEmitter<Date>;

    @State()
    private formattedValue: string;

    private useNative: boolean;
    private nativeType: InputType;
    private textField: HTMLElement;
    private datePickerCalendar: HTMLLimelFlatpickrAdapterElement;

    private portalId = `date-picker-calendar-${createRandomString()}`;

    @State()
    private showPortal = false;

    private dateFormatter: DateFormatter;

    constructor() {
        this.handleCalendarChange = this.handleCalendarChange.bind(this);
        this.handleInputElementChange = this.handleInputElementChange.bind(
            this
        );
        this.showCalendar = this.showCalendar.bind(this);
        this.dateFormatter = new DateFormatter(this.language);
        this.clearValue = this.clearValue.bind(this);
    }

    public componentWillLoad() {
        this.useNative = isIOSDevice() || isAndroidDevice();
        this.formattedValue = this.dateFormatter.formatDateByType(
            this.value,
            this.type
        );

        switch (this.type) {
            case 'date':
                this.nativeType = 'date';
                break;

            case 'time':
                this.nativeType = 'time';
                break;

            case 'week':
                this.nativeType = 'week';
                break;

            case 'month':
                this.nativeType = 'month';
                break;

            case 'quarter':
                this.nativeType = 'date';
                break;

            case 'year':
                this.nativeType = 'date';
                break;

            case 'datetime':
            default:
                this.nativeType = 'datetime-local';
                break;
        }
    }

    public render() {
        const inputProps = {
            trailingIcon: this.value ? 'clear_symbol' : null,
            onAction: this.clearValue,
        };

        if (this.useNative) {
            return (
                <div class="container">
                    <limel-input-field
                        disabled={this.disabled}
                        invalid={this.invalid}
                        label={this.label}
                        helperText={this.helperText}
                        required={this.required}
                        value={this.formattedValue}
                        type={this.nativeType}
                    />
                </div>
            );
        }

        return (
            <div class="container">
                <limel-input-field
                    disabled={this.disabled}
                    invalid={this.invalid}
                    label={this.label}
                    helperText={this.helperText}
                    required={this.required}
                    value={this.formattedValue}
                    onFocus={this.showCalendar}
                    onChange={this.handleInputElementChange}
                    ref={(el) => (this.textField = el)}
                    {...inputProps}
                />
                <limel-portal
                    containerId={this.portalId}
                    visible={this.showPortal}
                >
                    <limel-flatpickr-adapter
                        type={this.type}
                        value={this.value}
                        ref={(el) => (this.datePickerCalendar = el)}
                        onChange={this.handleCalendarChange}
                    />
                </limel-portal>
            </div>
        );
    }

    @Watch('value')
    protected onValueChange(newValue, oldValue) {
        if (newValue !== oldValue && newValue !== this.formattedValue) {
            this.formattedValue = this.dateFormatter.formatDateByType(
                newValue,
                this.type
            );
        }
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
    }

    private hideCalendar() {
        setTimeout(() => {
            this.showPortal = false;
        });
        document.removeEventListener('mousedown', this.documentClickListener);
        document.removeEventListener('keydown', this.documentClickListener);
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
        this.formattedValue = this.dateFormatter.formatDateByType(
            date,
            this.type
        );
        event.stopPropagation();
        if (this.type !== 'datetime' && this.type !== 'time') {
            this.textField.blur();
            this.hideCalendar();
        }
        this.change.emit(date);
    }

    private handleInputElementChange(event) {
        event.stopPropagation();
    }

    private clearValue() {
        this.formattedValue = '';
        this.change.emit(null);
    }
}
