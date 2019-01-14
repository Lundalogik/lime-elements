import {
    Component,
    Element,
    Event,
    EventEmitter,
    Listen,
    Prop,
} from '@stencil/core';

import { Translations } from '../../global/translations';
import { DateType, Languages } from './date-type';
import { DatePicker as DateDatePicker } from './pickers/DatePicker';
import { DatetimePicker } from './pickers/DatetimePicker';
import { MonthPicker } from './pickers/MonthPicker';
import { Picker } from './pickers/Picker';
import { QuarterPicker } from './pickers/QuarterPicker';
import { TimePicker } from './pickers/TimePicker';
import { WeekPicker } from './pickers/WeekPicker';
import { YearPicker } from './pickers/YearPicker';

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

    @Prop({ context: 'translations' })
    public translate: Translations;

    @Element()
    private host: HTMLElement;

    /**
     * Emitted when the date picker value is changed.
     */
    @Event()
    private change: EventEmitter;

    private picker: Picker;

    private container: HTMLElement;
    private input: HTMLElement;

    public componentWillLoad() {
        switch (this.type) {
            case 'date':
                this.picker = new DateDatePicker(
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
                    this.translate
                );
                break;

            case 'quarter':
                this.picker = new QuarterPicker(
                    this.format,
                    this.language,
                    this.change,
                    this.translate
                );
                break;
            case 'year':
                this.picker = new YearPicker(
                    this.format,
                    this.language,
                    this.change,
                    this.translate
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

    public componentDidLoad() {
        const textfield: HTMLElement = this.host.shadowRoot.querySelector(
            'limel-input-field'
        );
        this.input = textfield.shadowRoot.querySelector('input');
        this.container = this.host.shadowRoot.querySelector('.container');

        this.picker.init(this.input, this.container, this.value);
    }

    public componentDidUnload() {
        this.picker.destroy();
    }

    public render() {
        const formattedValue = this.picker.formatDate(this.value);

        return (
            <div class="container">
                <limel-input-field
                    disabled={this.disabled}
                    invalid={this.invalid}
                    label={this.label}
                    required={this.required}
                    value={formattedValue}
                    onChange={this.handleChange}
                />
            </div>
        );
    }

    @Listen('window:resize')
    public resizeEvent() {
        this.picker.init(this.input, this.container, this.value);
    }

    private handleChange(event) {
        event.stopPropagation();
    }
}
