// TODO: What to do if datepicker is cut because rendered outside window??

/*
 *
 *    |XXXX| <- window
 * ---|----|------------
 *    |____| <- this is cut and not possible to see... 
 * 
 * You can easily create an example in the create new dialog in the webclient
 * 
 * 
 * 
 * Different events when you click in the input field and outsied...
 */

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
import { createRandomString } from '../../util/random-string';

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
    styleUrl: 'date-picker-public.scss',
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
        //this.handleChange = this.handleChange.bind(this);
    }

    public componentWillLoad() {
        // switch (this.type) {
        //     case 'date':
        //         this.picker = new DateDatePicker(
        //             this.format,
        //             this.language,
        //             this.change
        //         );
        //         break;

        //     case 'time':
        //         this.picker = new TimePicker(
        //             this.format,
        //             this.language,
        //             this.change
        //         );
        //         break;

        //     case 'week':
        //         this.picker = new WeekPicker(
        //             this.format,
        //             this.language,
        //             this.change
        //         );
        //         break;

        //     case 'month':
        //         this.picker = new MonthPicker(
        //             this.format,
        //             this.language,
        //             this.change,
        //             translate
        //         );
        //         break;

        //     case 'quarter':
        //         this.picker = new QuarterPicker(
        //             this.format,
        //             this.language,
        //             this.change,
        //             translate
        //         );
        //         break;
        //     case 'year':
        //         this.picker = new YearPicker(
        //             this.format,
        //             this.language,
        //             this.change,
        //             translate
        //         );
        //         break;

        //     case 'datetime':
        //     default:
        //         this.picker = new DatetimePicker(
        //             this.format,
        //             this.language,
        //             this.change
        //         );
        //         break;
        // }
    }


    private portalId = `date-picker-${createRandomString()}`

    public componentDidLoad() {
        // this.input = this.host.shadowRoot.querySelector('#flatpickr-input');
        // this.container = this.host.shadowRoot.querySelector('.container');

        // this.picker.init(this.input, this.container, this.value);
        // this.formattedValue = this.picker.formatDate(this.value);

        const elem: HTMLLimelDatePickerFlatpickrElement = document.querySelector(`#${this.portalId} limel-date-picker-flatpickr`)
        console.log('did load!')
        elem.inputElement = this.host.shadowRoot.querySelector('#flatpickr-input')
        //const portal: HTMLLimelPortalElement = document.querySelector(`#${this.portalId}`)
        setTimeout(() => {
            this.showPortal = false;
        }, 100);

    }

    private portalFixed: boolean = false;

    public componentDidUnload() {
        //this.picker.destroy();
    }

    public componentDidUpdate() {
        //this.picker.destroy();
        // console.log('did update!')
        // if (!this.portalFixed) {
        //     this.showPortal = false;
        //     this.portalFixed = true;
        // }
    }

    @State()
    private showPortal: boolean = true;

    public render() {
        console.log("DATE VALUE", this.value)
        return [
            <input type="text" id="flatpickr-input" onClick={() => this.showPortal = !this.showPortal} onChange={(evt) => console.log('FLATPICKR UPDATE!', evt)} />,
            <limel-portal containerId={this.portalId} visible={this.showPortal}>
                {this.value ?
                    <limel-date-picker-flatpickr value={this.value} show={this.showPortal} /> : <limel-date-picker-flatpickr show={this.showPortal} />
                }


            </limel-portal>
        ];
    }

    @Listen('resize', { target: 'window' })
    public resizeEvent() {
        // this.picker.init(this.input, this.container, this.value);
    }

    @Watch('value')
    protected onValueChange(newValue, oldValue) {
        // if (newValue !== oldValue) {
        //     this.formattedValue = this.picker.formatDate(newValue);
        // }
    }

    private handleChange(event) {
        // event.stopPropagation();
        // this.formattedValue = event.detail;
    }
}
