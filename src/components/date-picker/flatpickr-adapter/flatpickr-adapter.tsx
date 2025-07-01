import { Component, Event, EventEmitter, h, Prop } from '@stencil/core';
import { DateType, Languages } from '../../date-picker/date.types';
import translate from '../../../global/translations';
import { DatePicker as DateOnlyPicker } from '../pickers/date-picker';
import { DatetimePicker } from '../pickers/datetime-picker';
import { MonthPicker } from '../pickers/month-picker';
import { Picker } from '../pickers/picker';
import { QuarterPicker } from '../pickers/quarter-picker';
import { TimePicker } from '../pickers/time-picker';
import { WeekPicker } from '../pickers/week-picker';
import { YearPicker } from '../pickers/year-picker';

/**
 * This component is internal and only supposed to be used by
 * the limel-date-picker. This component is needed in order for us
 * to render the flatpickr calendar in a portal.
 *
 * @private
 */
@Component({
    tag: 'limel-flatpickr-adapter',
    shadow: true,
    styleUrl: 'flatpickr-adapter.scss',
})
export class DatePickerCalendar {
    /**
     * The value of the field.
     */
    @Prop()
    public value: Date;

    /**
     * Type of date picker.
     */
    @Prop()
    public type: DateType = 'datetime';

    /**
     * Format to display the selected date in.
     */
    @Prop()
    public format: string;

    /**
     * Set to `true` if the calendar should be open.
     */
    @Prop()
    public isOpen: boolean;

    /**
     * The native input element to use with flatpickr.
     */
    @Prop()
    public inputElement: HTMLElement;

    /**
     * Defines the localisation for translations and date formatting.
     * Property `format` customizes the localized date format.
     */
    @Prop()
    public language: Languages = 'en';

    @Prop()
    public formatter!: (date: Date) => string;

    /**
     * Emitted when the date picker value is changed.
     */
    @Event()
    public change: EventEmitter<Date>;

    private picker: Picker;
    private flatPickrCreated: boolean = false;

    private container: HTMLElement;

    public componentWillLoad() {
        switch (this.type) {
            case 'date': {
                this.picker = new DateOnlyPicker(
                    this.language,
                    this.change,
                    this.format
                );
                break;
            }

            case 'time': {
                this.picker = new TimePicker(
                    this.language,
                    this.change,
                    this.format
                );
                break;
            }

            case 'week': {
                this.picker = new WeekPicker(
                    this.language,
                    this.change,
                    this.format
                );
                break;
            }

            case 'month': {
                this.picker = new MonthPicker(
                    this.language,
                    this.change,
                    translate,
                    this.format
                );
                break;
            }

            case 'quarter': {
                this.picker = new QuarterPicker(
                    this.language,
                    this.change,
                    translate,
                    this.format
                );
                break;
            }
            case 'year': {
                this.picker = new YearPicker(
                    this.language,
                    this.change,
                    translate,
                    this.format
                );
                break;
            }

            default: {
                this.picker = new DatetimePicker(
                    this.language,
                    this.change,
                    this.format
                );
                break;
            }
        }

        if (this.formatter) {
            this.picker.formatter = this.formatter;
        }
    }

    public componentDidUpdate() {
        if (!this.flatPickrCreated) {
            this.createFlatpickr();
        } else if (!this.isOpen) {
            this.picker.setValue(this.value);
        }
    }

    private createFlatpickr() {
        if (!this.inputElement) {
            // The input element is programatically set on this element
            // after its been rendered.
            return;
        }

        if (!this.isOpen || !this.container.checkVisibility()) {
            return;
        }

        this.picker.init(this.inputElement, this.container, this.value);
        this.flatPickrCreated = true;
    }

    public disconnectedCallback() {
        this.picker.destroy();
        this.flatPickrCreated = false;
    }

    public render() {
        return (
            <div
                class="container"
                ref={(el) => (this.container = el)}
                style={{
                    '--today-label': `"${translate.get('date-picker.today')}"`,
                }}
            />
        );
    }
}
