import flatpickr from '@limetech/flatpickr';
import { EventEmitter } from '@stencil/core';
import { range } from 'lodash-es';
import moment from 'moment/moment';
import { Picker } from './Picker';

import { h } from 'jsx-dom';
import { Translations } from '../../../global/translations';

const NBROFMONTHS = 12;

export class MonthPicker extends Picker {
    private months = [];

    public constructor(
        dateFormat: string = 'MM/YYYY',
        language: string,
        change: EventEmitter<Date>,
        private translations: Translations
    ) {
        super(dateFormat, language, change);
        this.handleChange = this.handleChange.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleReady = this.handleReady.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.nextYear = this.nextYear.bind(this);
        this.prevYear = this.prevYear.bind(this);
    }

    public getConfig(nativePicker: boolean): flatpickr.Options.Options {
        const config: any = {
            onChange: this.handleChange,
        };

        if (!nativePicker) {
            config.onReady = this.handleReady;
            config.onOpen = this.handleOpen;
            config.onYearChange = this.handleChange;
        }
        return config;
    }

    protected handleChange(selectedDates, dateString, fp) {
        this.selectMonth(selectedDates, dateString, fp);
    }

    protected handleClose(selectedDates) {
        return super.handleClose(selectedDates).then(() => {
            this.selectMonth(
                this.flatpickr.selectedDates,
                this.flatpickr.input.value,
                this.flatpickr
            );
            if (!this.nativePicker) {
                this.flatpickr.prevMonthNav.removeEventListener(
                    'mousedown',
                    this.prevYear
                );
                this.flatpickr.nextMonthNav.removeEventListener(
                    'mousedown',
                    this.nextYear
                );
            }
        });
    }

    private handleReady(_, __, fp) {
        this.bootstrapMonthPicker(fp);
        this.selectMonth(fp.selectedDates, fp.input.value, fp);
    }

    private handleOpen() {
        if (!this.nativePicker) {
            this.flatpickr.prevMonthNav.addEventListener(
                'mousedown',
                this.prevYear
            );
            this.flatpickr.nextMonthNav.addEventListener(
                'mousedown',
                this.nextYear
            );
        }
    }

    private bootstrapMonthPicker(fp) {
        if (!this.nativePicker) {
            fp.innerContainer.remove();
            fp.calendarContainer
                .getElementsByClassName('cur-month')[0]
                .replaceWith(this.renderHeading());
            fp.calendarContainer.appendChild(this.renderMonthsPicker(fp));
        }
    }

    private renderHeading(): any {
        return (
            <span className="datepicker-month-heading">
                {this.getLocalizedHeading()}
            </span>
        );
    }

    private getLocalizedHeading() {
        return this.translations.get(
            'date-picker.month.heading',
            this.language
        );
    }

    private renderMonthsPicker(fp): any {
        return (
            <div className="datepicker-months-container">
                {range(NBROFMONTHS).map(index => {
                    const renderedMonth = this.renderMonth(index, fp);
                    this.months.push(renderedMonth);
                    return renderedMonth;
                })}
            </div>
        );
    }

    private renderMonth(month, fp): any {
        return (
            <div
                className="datepicker-month"
                onClick={() => { // tslint:disable-line:jsx-no-lambda prettier
                    const date = moment([fp.currentYear]).month(month).toDate();
                    fp.setDate(date, true);
                    fp.close();
                }}
            >
                {moment()
                    .month(month)
                    .locale(this.getMomentLang())
                    .format('MMM')}
            </div>
        );
    }

    private selectMonth(selectedDates, dateString, fp) {
        if (!this.nativePicker) {
            this.months.forEach(month => {
                month.classList.remove('selected');
            });

            if (
                dateString !== '' &&
                selectedDates[0] &&
                selectedDates[0].getFullYear() === fp.currentYear
            ) {
                this.months[selectedDates[0].getMonth()].classList.add(
                    'selected'
                );
            }
        }
    }

    private prevYear(event) {
        if (!this.nativePicker) {
            event.stopImmediatePropagation();
            this.flatpickr.changeMonth(-NBROFMONTHS);
        }
    }

    private nextYear(event) {
        if (!this.nativePicker) {
            event.stopImmediatePropagation();
            this.flatpickr.changeMonth(NBROFMONTHS);
        }
    }
}
