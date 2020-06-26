/*
 * This component is internal and only supposed to be used by
 * the limel-date-picker. This component is needed in order for us
 * to render the flatpickr calendar in a portal.
 *
 */

import { Component, Event, EventEmitter, h, Prop } from '@stencil/core';

import { DateType, Languages } from '@limetech/lime-elements';
import translate from '../../../global/translations';
import { DatePicker as DateOnlyPicker } from '../pickers/DatePicker';
import { DatetimePicker } from '../pickers/DatetimePicker';
import { MonthPicker } from '../pickers/MonthPicker';
import { Picker } from '../pickers/Picker';
import { QuarterPicker } from '../pickers/QuarterPicker';
import { TimePicker } from '../pickers/TimePicker';
import { WeekPicker } from '../pickers/WeekPicker';
import { YearPicker } from '../pickers/YearPicker';

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
     * Type of date picker. Defaults to `datetime`
     */
    @Prop()
    public type: DateType = 'datetime';

    /**
     * Format to display the selected date in
     */
    @Prop()
    public format: string;

    @Prop()
    public inputElement: HTMLElement;

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
    public change: EventEmitter<Date>;

    private picker: Picker;
    private flatPickrCreated: boolean = false;

    private container: HTMLElement;

    public componentWillLoad() {
        switch (this.type) {
            case 'date':
                this.picker = new DateOnlyPicker(
                    this.format,
                    this.language,
                    this.change
                );
                break;

            case 'time':
                this.picker = new TimePicker(
                    this.format,
                    this.language,
                    this.change
                );
                break;

            case 'week':
                this.picker = new WeekPicker(
                    this.format,
                    this.language,
                    this.change
                );
                break;

            case 'month':
                this.picker = new MonthPicker(
                    this.format,
                    this.language,
                    this.change,
                    translate
                );
                break;

            case 'quarter':
                this.picker = new QuarterPicker(
                    this.format,
                    this.language,
                    this.change,
                    translate
                );
                break;
            case 'year':
                this.picker = new YearPicker(
                    this.format,
                    this.language,
                    this.change,
                    translate
                );
                break;

            case 'datetime':
            default:
                this.picker = new DatetimePicker(
                    this.format,
                    this.language,
                    this.change
                );
                break;
        }
    }

    public componentDidUpdate() {
        if (this.flatPickrCreated) {
            this.redrawFlatpickr();
        } else {
            this.createFlatpickr();
        }
    }

    private createFlatpickr() {
        if (!this.inputElement) {
            // The input element is programatically set on this element
            // after its been rendered.
            return;
        }
        this.picker.init(this.inputElement, this.container, this.value);
        this.flatPickrCreated = true;
    }

    private redrawFlatpickr() {
        this.picker.redraw();
    }

    public componentDidUnload() {
        this.picker.destroy();
    }

    public render() {
        return <div class="container" ref={(el) => (this.container = el)} />;
    }
}
