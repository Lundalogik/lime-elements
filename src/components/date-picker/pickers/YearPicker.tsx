import flatpickr from '@limetech/flatpickr';
import { EventEmitter } from '@stencil/core';
import { range } from 'lodash-es';
import moment from 'moment/moment';
import { Picker } from './Picker';

import { h } from 'jsx-dom';
import { Translations } from '../../../global/translations';

export class YearPicker extends Picker {
    private years = [];

    public constructor(
        dateFormat: string = 'YYYY',
        language: string,
        change: EventEmitter<Date>,
        private translations: Translations
    ) {
        super(dateFormat, language, change);
        this.handleChange = this.handleChange.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleReady = this.handleReady.bind(this);
    }

    public getConfig(nativePicker: boolean): flatpickr.Options.Options {
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

    protected handleClose(selectedDates) {
        return super.handleClose(selectedDates).then(() => {
            this.selectYear(
                this.flatpickr.selectedDates,
                this.flatpickr.input.value
            );
        });
    }

    private handleReady(_, __, fp) {
        this.bootstrapYearPicker(fp);
        this.selectYear(fp.selectedDates, fp.input.value);
    }

    private bootstrapYearPicker(fp) {
        if (!this.nativePicker) {
            fp.innerContainer.remove();
            fp.prevMonthNav.remove();
            fp.nextMonthNav.remove();
            fp.currentYearElement.parentNode.remove();
            fp.calendarContainer
                .getElementsByClassName('cur-month')[0]
                .replaceWith(this.renderHeading());
            fp.calendarContainer.appendChild(this.renderYearPicker(fp));
        }
    }

    private renderHeading(): any {
        return (
            <span className="datepicker-year-heading">
                {this.getLocalizedHeading()}
            </span>
        );
    }

    private getLocalizedHeading() {
        return this.translations.get('date-picker.year.heading', this.language);
    }

    private renderYearPicker(fp): any {
        const yearsInterval = 5;
        return (
            <div className="datepicker-years-container">
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
                className="datepicker-year"
                onClick={() => { // tslint:disable-line:jsx-no-lambda prettier
                    const date = moment(year).toDate();
                    fp.setDate(date, true);
                    fp.close();
                }}
            >
                {moment(year).locale(this.getMomentLang()).format('YYYY')}
            </div>
        );
    }

    private selectYear(selectedDates, dateString) {
        if (!this.nativePicker) {
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
}
