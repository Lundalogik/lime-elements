import flatpickr from 'flatpickr';
import { EventEmitter } from '@stencil/core';
import { range } from 'lodash-es';
import moment from 'moment/moment';
import { Picker } from './picker';

import { h } from 'jsx-dom';
import { Translations } from '../../../global/translations';

const NBROFMONTHS = 12;

export class MonthPicker extends Picker {
    private months = [];

    public constructor(
        language: string,
        change: EventEmitter<Date | null>,
        private translations: Translations,
        dateFormat: string = 'MM/YYYY'
    ) {
        super(language, change, dateFormat);
        this.handleChange = this.handleChange.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleReady = this.handleReady.bind(this);
        this.nextYear = this.nextYear.bind(this);
        this.prevYear = this.prevYear.bind(this);
    }

    public init(
        element: HTMLElement,
        container: HTMLElement,
        value?: Date,
        focusTarget?: HTMLElement
    ) {
        super.init(element, container, value, focusTarget);
        if (this.nativePicker) {
            return;
        }

        this.flatpickr.prevMonthNav.addEventListener(
            'mousedown',
            this.prevYear
        );
        this.flatpickr.nextMonthNav.addEventListener(
            'mousedown',
            this.nextYear
        );
    }

    public destroy() {
        if (!this.nativePicker) {
            this.flatpickr?.prevMonthNav?.removeEventListener(
                'mousedown',
                this.prevYear
            );
            this.flatpickr?.nextMonthNav?.removeEventListener(
                'mousedown',
                this.nextYear
            );
        }

        super.destroy();
    }

    public getConfig(nativePicker: boolean): flatpickr.Options.Options {
        const config: any = {
            onChange: this.handleChange,
        };

        if (!nativePicker) {
            config.onReady = this.handleReady;
            config.onYearChange = this.handleChange;
        }

        return config;
    }

    protected handleChange(selectedDates, dateString, fp) {
        this.selectMonth(selectedDates, dateString, fp);
    }

    protected async handleClose(selectedDates) {
        await super.handleClose(selectedDates);
        this.redrawSelection();
    }

    protected redrawSelection() {
        this.selectMonth(
            this.flatpickr.selectedDates,
            this.flatpickr.input.value,
            this.flatpickr
        );
    }

    private handleReady(_, __, fp) {
        this.bootstrapMonthPicker(fp);
        this.selectMonth(fp.selectedDates, fp.input.value, fp);
    }

    private bootstrapMonthPicker(fp) {
        if (this.nativePicker) {
            return;
        }

        fp.innerContainer.remove();
        fp.calendarContainer
            .querySelector('.flatpickr-monthDropdown-months')
            .replaceWith(this.renderHeading());
        fp.calendarContainer.append(this.renderMonthsPicker(fp));
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
                {range(NBROFMONTHS).map((index) => {
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
                onClick={() => {
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
        if (this.nativePicker) {
            return;
        }

        for (const month of this.months) {
            month.classList.remove('selected');
        }

        if (
            dateString !== '' &&
            selectedDates[0] &&
            selectedDates[0].getFullYear() === fp.currentYear
        ) {
            this.months[selectedDates[0].getMonth()].classList.add('selected');
        }
    }

    private prevYear() {
        if (this.nativePicker) {
            return;
        }

        // Preventing default or stopping the event from propagating doesn't
        // stop flatpickr from moving one month on its own, so we let it do
        // that, and then move the other 11 months to make it a full year.
        // /Ads
        const monthsToMove = 11;
        this.flatpickr.changeMonth(-monthsToMove);
    }

    private nextYear() {
        if (this.nativePicker) {
            return;
        }

        // Preventing default or stopping the event from propagating doesn't
        // stop flatpickr from moving one month on its own, so we let it do
        // that, and then move the other 11 months to make it a full year.
        // /Ads
        const monthsToMove = 11;
        this.flatpickr.changeMonth(monthsToMove);
    }
}
