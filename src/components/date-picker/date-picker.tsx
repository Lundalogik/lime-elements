import { Component, Element, Event, EventEmitter, Prop } from '@stencil/core';

import { Translations } from '../../global/translations';
import { DateType } from './date-type';
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
    @Prop()
    public disabled: boolean;

    @Prop()
    public invalid: boolean;

    @Prop()
    public label: string;

    @Prop()
    public required: boolean;

    @Prop()
    public value: Date;

    @Prop()
    public type: DateType = 'datetime';

    @Prop()
    public format: string;

    @Prop({ context: 'translations' })
    public translate: Translations;

    @Element()
    private host: HTMLElement;

    @Event()
    private change: EventEmitter;

    private picker: Picker;

    public componentWillLoad() {
        switch (this.type) {
            case 'date':
                this.picker = new DateDatePicker(this.format, this.change);
                break;

            case 'time':
                this.picker = new TimePicker(this.format, this.change);
                break;

            case 'week':
                this.picker = new WeekPicker(this.format, this.change);
                break;

            case 'month':
                this.picker = new MonthPicker(
                    this.format,
                    this.change,
                    this.translate
                );
                break;

            case 'quarter':
                this.picker = new QuarterPicker(
                    this.format,
                    this.change,
                    this.translate
                );
                break;
            case 'year':
                this.picker = new YearPicker(
                    this.format,
                    this.change,
                    this.translate
                );
                break;

            case 'datetime':
            default:
                this.picker = new DatetimePicker(this.format, this.change);
                break;
        }
    }

    public componentDidLoad() {
        const textfield: HTMLElement = this.host.shadowRoot.querySelector(
            'limel-input-field'
        );
        const input = textfield.shadowRoot.querySelector('input');
        const container: HTMLElement = this.host.shadowRoot.querySelector(
            '.container'
        );

        this.picker.init(input, container, this.value);
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

    private handleChange(event) {
        event.stopPropagation();
    }
}
