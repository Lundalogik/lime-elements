import { EventEmitter } from '@stencil/core';
import { BaseOptions } from 'flatpickr/dist/types/options';
import { range } from 'lodash-es';
import moment from 'moment/moment';
import { Picker } from './Picker';

import { h } from 'jsx-dom';
import { Translations } from '../../../global/translations';

export class YearPicker extends Picker {
    private years = [];

    public constructor(
        dateFormat: string = 'YYYY',
        change: EventEmitter,
        private translations: Translations
    ) {
        super(dateFormat, change);
        this.handleChange = this.handleChange.bind(this);
        this.handleReady = this.handleReady.bind(this);
    }

    public getConfig(nativePicker: boolean): Partial<BaseOptions> {
        const config: any = {
            onChange: this.handleChange,
        };

        if (!nativePicker) {
            config.onReady = this.handleReady;
        }
        return config;
    }

    protected handleChange(selectedDates, dateString) {
        this.selectYear(selectedDates, dateString);
    }

    private handleReady(_, __, fp) {
        this.bootstrapYearPicker(fp);
        const inputValue = fp.input.value;
        this.selectYear(fp.selectedDates, inputValue);
    }

    private bootstrapYearPicker(fp) {
        fp.innerContainer.remove();
        fp.prevMonthNav.remove();
        fp.nextMonthNav.remove();
        fp.currentYearElement.parentNode.remove();
        fp.calendarContainer
            .getElementsByClassName('cur-month')[0]
            .replaceWith(this.renderHeading());
        fp.calendarContainer.appendChild(this.renderYearPicker(fp));
    }

    private renderHeading(): any {
        return (
            <span class="datepicker-year-heading">
                {this.getLocalizedHeading()}
            </span>
        );
    }

    private getLocalizedHeading() {
        const languageCodeDash = navigator.language.indexOf('-');
        const languageCodeLength =
            languageCodeDash > 0 ? languageCodeDash : navigator.language.length;
        return this.translations.get(
            'date-picker.year.heading',
            navigator.language.substring(0, languageCodeLength)
        );
    }

    private renderYearPicker(fp): any {
        const yearsInterval = 5;
        return (
            <div class="datepicker-years-container">
                {range(-yearsInterval, yearsInterval).map(index => {
                    const year = moment().add(index, 'years');
                    const renderedYear = this.renderYear(year, fp);
                    this.years.push(renderedYear);
                    return renderedYear;
                })}
            </div>
        );
    }

    private renderYear(year, fp): any {
        return (
            <div
                class="datepicker-year"
                onClick={() => {
                    const date = moment(year).toDate();
                    fp.setDate(date, true);
                    fp.close();
                }}
            >
                {moment(year).format('YYYY')}
            </div>
        );
    }

    private selectYear(selectedDates, dateString) {
        this.years.forEach(year => {
            if (
                dateString !== '' &&
                selectedDates[0] &&
                Number(year.innerText) === selectedDates[0].getFullYear()
            ) {
                year.classList.add('selected');
            } else {
                year.classList.remove('selected');
            }
        });
    }
}
