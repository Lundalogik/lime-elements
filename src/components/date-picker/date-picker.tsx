import {
    Component,
    Element,
    Event,
    EventEmitter,
    h,
    Listen,
    Prop,
    State,
    Watch,
} from '@stencil/core';

import { DateType, Languages } from '@limetech/lime-elements';
import translate from '../../global/translations';
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

    @Element()
    private host: HTMLElement;

    /**
     * Emitted when the date picker value is changed.
     */
    @Event()
    private change: EventEmitter<Date>;

    @State()
    private formattedValue: string;

    private picker: Picker;

    private container: HTMLElement;
    private input: HTMLElement;

    constructor() {
        this.handleChange = this.handleChange.bind(this);
        this.clearValue = this.clearValue.bind(this);
    }

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

    public componentDidLoad() {
        const textfield: HTMLElement = this.host.shadowRoot.querySelector(
            'limel-input-field'
        );
        this.input = textfield.shadowRoot.querySelector('input');
        this.container = this.host.shadowRoot.querySelector('.container');

        this.picker.init(this.input, this.container, this.value);
        this.formattedValue = this.picker.formatDate(this.value);
    }

    public componentDidUnload() {
        this.picker.destroy();
    }

    public render() {
        const inputProps = {
            trailingIcon: this.value ? 'clear_symbol' : null,
            onAction: this.clearValue,
        };
        return (
            <div class="container">
                <limel-input-field
                    disabled={this.disabled}
                    invalid={this.invalid}
                    label={this.label}
                    helperText={this.helperText}
                    required={this.required}
                    value={this.formattedValue}
                    onChange={this.handleChange}
                    {...inputProps}
                />
            </div>
        );
    }

    @Listen('resize', { target: 'window' })
    public resizeEvent() {
        this.picker.init(this.input, this.container, this.value);
    }

    @Watch('value')
    protected onValueChange(newValue, oldValue) {
        if (newValue !== oldValue) {
            this.formattedValue = this.picker.formatDate(newValue);
        }
    }

    private handleChange(event) {
        event.stopPropagation();
        this.formattedValue = event.detail;
    }

    private clearValue() {
        this.formattedValue = '';
        this.change.emit(null);
    }
}
