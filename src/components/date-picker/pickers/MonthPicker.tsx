import { EventEmitter } from '@stencil/core';
import { BaseOptions } from 'flatpickr/dist/types/options';
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
        change: EventEmitter,
        private translations: Translations
    ) {
        super(dateFormat, language, change);
        this.handleChange = this.handleChange.bind(this);
        this.handleReady = this.handleReady.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.nextYear = this.nextYear.bind(this);
        this.prevYear = this.prevYear.bind(this);
    }

    public getConfig(nativePicker: boolean): Partial<BaseOptions> {
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
        super.handleClose(selectedDates);
        this.flatpickr.prevMonthNav.removeEventListener(
            'mousedown',
            this.prevYear
        );
        this.flatpickr.nextMonthNav.removeEventListener(
            'mousedown',
            this.nextYear
        );
    }

    private handleReady(_, __, fp) {
        this.bootstrapMonthPicker(fp);
        this.selectMonth(fp.selectedDates, fp.input.value, fp);
    }

    private handleOpen() {
        this.flatpickr.prevMonthNav.addEventListener(
            'mousedown',
            this.prevYear
        );
        this.flatpickr.nextMonthNav.addEventListener(
            'mousedown',
            this.nextYear
        );
    }

    private bootstrapMonthPicker(fp) {
        fp.innerContainer.remove();
        fp.calendarContainer
            .getElementsByClassName('cur-month')[0]
            .replaceWith(this.renderHeading());
        fp.calendarContainer.appendChild(this.renderMonthsPicker(fp));
    }

    private renderHeading(): any {
        return (
            <span class="datepicker-month-heading">
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
            <div class="datepicker-months-container">
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
                class="datepicker-month"
                onClick={() => {
                    const date = moment([fp.currentYear])
                        .month(month)
                        .toDate();
                    fp.setDate(date, true);
                    fp.close();
                }}
            >
                {moment()
                    .month(month)
                    .format('MMM')}
            </div>
        );
    }

    private selectMonth(selectedDates, dateString, fp) {
        this.months.forEach(month => {
            month.classList.remove('selected');
        });

        if (
            dateString !== '' &&
            selectedDates[0] &&
            selectedDates[0].getFullYear() === fp.currentYear
        ) {
            this.months[selectedDates[0].getMonth()].classList.add('selected');
        }
    }

    private prevYear(event) {
        event.stopImmediatePropagation();
        this.flatpickr.changeMonth(-NBROFMONTHS);
    }

    private nextYear(event) {
        event.stopImmediatePropagation();
        this.flatpickr.changeMonth(NBROFMONTHS);
    }
}
