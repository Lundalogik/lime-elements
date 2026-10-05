import {
    Component,
    Event,
    EventEmitter,
    h,
    Host,
    Method,
    Prop,
    Watch,
} from '@stencil/core';
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
import { DeferredDestroy } from './deferred-destroy';

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
     * Shown as selected instead of `value` while set.
     */
    @Prop()
    public previewValue?: Date;

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
     * The input the user types into. Setting it creates the calendar.
     */
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
    private deferredDestroy = new DeferredDestroy();

    private container: HTMLElement;
    private proxyInput: HTMLInputElement;

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
    }

    // `componentDidUpdate` ignores `value` while the calendar is open.
    @Watch('previewValue')
    protected watchPreviewValue() {
        if (!this.isOpen) {
            return;
        }

        this.picker.setValue(this.previewValue ?? this.value);
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

        if (
            !this.isOpen ||
            (this.container as any).checkVisibility?.() === false
        ) {
            return;
        }

        // Flatpickr focuses the input it is bound to on Escape, Shift+Tab
        // and closing, but the proxy is hidden and can't take focus.
        this.proxyInput.focus = () => this.inputElement.focus();

        this.picker.init(
            this.proxyInput,
            this.container,
            this.previewValue ?? this.value
        );
        this.flatPickrCreated = true;
    }

    /**
     * Moves focus to the selected day, else today, else the first day of
     * the month.
     * @returns `false` when the calendar has no day grid
     */
    @Method()
    public async focusDay(): Promise<boolean> {
        return this.picker?.focusDay() ?? false;
    }

    public connectedCallback() {
        this.deferredDestroy.cancel();
    }

    public disconnectedCallback() {
        this.deferredDestroy.schedule(() => {
            this.picker.destroy();
            this.flatPickrCreated = false;
        });
    }

    public render() {
        return (
            <Host>
                {/* Flatpickr rewrites the text of the input it is bound to,
                    so it gets this hidden one instead of the real field. */}
                <input
                    type="text"
                    tabindex={-1}
                    aria-hidden="true"
                    hidden={true}
                    ref={(el) => (this.proxyInput = el)}
                />
                <div
                    class="container"
                    ref={(el) => (this.container = el)}
                    style={{
                        '--today-label': `"${translate.get(
                            'date-picker.today',
                            this.language
                        )}"`,
                    }}
                />
            </Host>
        );
    }
}
