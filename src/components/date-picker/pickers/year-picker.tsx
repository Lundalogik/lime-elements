import flatpickr from 'flatpickr';
import { EventEmitter } from '@stencil/core';
import { range } from 'lodash-es';
import moment, { Moment } from 'moment/moment';
import { Picker } from './picker';

import { h } from 'jsx-dom';
import { Translations } from '../../../global/translations';
const YEAR_INTERVAL = 10;
export class YearPicker extends Picker {
    private yearElements: HTMLElement[] = [];
    private years: Moment[] = [];
    private selectedYear: string;

    public constructor(
        language: string,
        change: EventEmitter<Date | null>,
        private translations: Translations,
        dateFormat: string = 'YYYY'
    ) {
        super(language, change, dateFormat);
        this.handleChange = this.handleChange.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleReady = this.handleReady.bind(this);
    }

    public init(
        element: HTMLElement,
        container: HTMLElement,
        value?: Date,
        focusTarget?: HTMLElement
    ) {
        super.init(element, container, value, focusTarget);
        if (!this.nativePicker) {
            this.flatpickr.prevMonthNav.addEventListener(
                'mousedown',
                this.prevYears
            );
            this.flatpickr.nextMonthNav.addEventListener(
                'mousedown',
                this.nextYears
            );
        }
    }

    public destroy() {
        if (!this.nativePicker) {
            this.flatpickr?.prevMonthNav?.removeEventListener(
                'mousedown',
                this.prevYears
            );
            this.flatpickr?.nextMonthNav?.removeEventListener(
                'mousedown',
                this.nextYears
            );
        }

        super.destroy();
    }

    private prevYears = (event: MouseEvent) => {
        event.stopImmediatePropagation();
        this.addYears(-YEAR_INTERVAL);
    };

    private nextYears = (event: MouseEvent) => {
        event.stopImmediatePropagation();
        this.addYears(YEAR_INTERVAL);
    };

    private addYears(nbrYears: number) {
        for (const year of this.years) {
            year.add(nbrYears, 'years');
        }
        for (const [index, el] of this.yearElements.entries()) {
            el.innerHTML = moment(this.years[index])
                .locale(this.getMomentLang())
                .format('YYYY');
        }
        this.setSelectedYear();
    }

    private setSelectedYear() {
        for (const year of this.yearElements) {
            if (year.textContent === this.selectedYear) {
                year.classList.add('selected');
            } else {
                year.classList.remove('selected');
            }
        }
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
            this.redrawSelection();
        });
    }

    protected redrawSelection() {
        const selected = this.flatpickr.selectedDates[0];
        if (selected) {
            this.showYear(selected.getFullYear());
        }

        this.selectYear(
            this.flatpickr.selectedDates,
            this.flatpickr.input.value
        );
    }

    /**
     * The year list is a fixed window that only the arrows move, so a year
     * set from outside it has no cell to highlight. Re-centres the window
     * on `year`, as the initial window is centred on today.
     * @param year - the year that must be visible
     */
    private showYear(year: number) {
        const first = this.years[0]?.year();
        const last = this.years.at(-1)?.year();
        if (first === undefined || last === undefined) {
            return;
        }

        if (year >= first && year <= last) {
            return;
        }

        this.addYears(year - this.years[YEAR_INTERVAL / 2].year());
    }

    private handleReady(_, __, fp) {
        this.bootstrapYearPicker(fp);
        this.selectYear(fp.selectedDates, fp.input.value);
    }

    private bootstrapYearPicker(fp) {
        if (!this.nativePicker) {
            fp.innerContainer.remove();
            fp.currentYearElement.parentNode.remove();
            fp.calendarContainer
                .querySelectorAll('.flatpickr-month')[0]
                .replaceWith(this.renderHeading());
            fp.calendarContainer.append(this.renderYearPicker(fp));
        }
    }

    private renderHeading(): any {
        return (
            <span className="datepicker-year-heading flatpickr-current-month">
                {this.getLocalizedHeading()}
            </span>
        );
    }

    private getLocalizedHeading() {
        return this.translations.get('date-picker.year.heading', this.language);
    }

    private renderYearPicker(fp): any {
        const halfInterval = YEAR_INTERVAL / 2;

        return (
            <div className="datepicker-years-container">
                {range(-halfInterval, halfInterval).map((index) => {
                    const year = moment().add(index, 'years');
                    const renderedYear = this.renderYear(year, fp);
                    this.years.push(year);
                    this.yearElements.push(renderedYear);

                    return renderedYear;
                })}
            </div>
        );
    }

    private renderYear(year, fp): any {
        return (
            <div
                className="datepicker-year"
                onClick={() => {
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
            for (const year of this.yearElements) {
                if (
                    dateString !== '' &&
                    selectedDates[0] &&
                    Number(year.textContent) === selectedDates[0].getFullYear()
                ) {
                    this.selectedYear = year.textContent;
                    year.classList.add('selected');
                } else {
                    year.classList.remove('selected');
                }
            }
        }
    }
}
