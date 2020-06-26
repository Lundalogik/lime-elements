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
import { DateType, Languages } from '@limetech/lime-elements';
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

    private textField: HTMLElement;
    private datePickerCalendar: HTMLLimelFlatpickrAdapterElement;

    private portalId = `date-picker-calendar-${createRandomString()}`;

    @State()
    private showPortal = false;

    private dateFormatter: DateFormatter;

    constructor() {
        this.handleCalendarChange = this.handleCalendarChange.bind(this);
        this.showCalendar = this.showCalendar.bind(this);
        this.dateFormatter = new DateFormatter(this.language);
    }

    public componentWillLoad() {
        this.formattedValue = this.dateFormatter.formatDateByType(
            this.value,
            this.type
        );
    }

    public render() {
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
                    ref={(el) => (this.textField = el)}
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
}
