import flatpickr from 'flatpickr';
import { EventEmitter } from '@stencil/core';
import { range } from 'lodash-es';
import moment from 'moment/moment';
import { Picker } from './Picker';

import { h } from 'jsx-dom';
import { Translations } from '../../../global/translations';

const MONTHSPERQUARTER = 3;
const NBROFMONTHS = 12;

export class QuarterPicker extends Picker {
    private quarters = [];

    public constructor(
        language: string,
        protected change: EventEmitter<Date>,
        private translations: Translations,
        dateFormat: string = '[Q]Q YYYY',
    ) {
        super(language, change, dateFormat);
        this.handleChange = this.handleChange.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleReady = this.handleReady.bind(this);
        this.nextYear = this.nextYear.bind(this);
        this.prevYear = this.prevYear.bind(this);
    }

    public init(element: HTMLElement, container: HTMLElement, value?: Date) {
        super.init(element, container, value);
        if (!this.nativePicker) {
            this.flatpickr.prevMonthNav.addEventListener(
                'mousedown',
                this.prevYear,
            );
            this.flatpickr.nextMonthNav.addEventListener(
                'mousedown',
                this.nextYear,
            );
        }
    }

    public destroy() {
        super.destroy();
        if (!this.nativePicker) {
            this.flatpickr?.prevMonthNav?.removeEventListener(
                'mousedown',
                this.prevYear,
            );
            this.flatpickr?.nextMonthNav?.removeEventListener(
                'mousedown',
                this.nextYear,
            );
        }
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
        this.selectQuarter(selectedDates, dateString, fp);
    }

    protected handleClose(selectedDates) {
        return super.handleClose(selectedDates).then(() => {
            this.selectQuarter(
                this.flatpickr.selectedDates,
                this.flatpickr.input.value,
                this.flatpickr,
            );
        });
    }

    private handleReady(_, __, fp) {
        this.bootstrapQuarterPicker(fp);
        this.selectQuarter(fp.selectedDates, fp.input.value, fp);
    }

    private bootstrapQuarterPicker(fp) {
        if (!this.nativePicker) {
            fp.innerContainer.remove();
            fp.calendarContainer
                .getElementsByClassName('flatpickr-monthDropdown-months')[0]
                .replaceWith(this.renderHeading());
            fp.calendarContainer.appendChild(this.renderQuarterPicker(fp));
        }
    }

    private renderHeading(): any {
        return (
            <span className="datepicker-quarter-heading">
                {this.getLocalizedHeading()}
            </span>
        );
    }

    private getLocalizedHeading() {
        return this.translations.get(
            'date-picker.quarter.heading',
            this.language,
        );
    }

    private renderQuarterPicker(fp): any {
        const startQuarter = 1;
        const endQuarter = 5;

        return (
            <div className="datepicker-quarters-container">
                {range(startQuarter, endQuarter).map((quarter) => {
                    const renderedQuarter = this.renderQuarter(quarter, fp);
                    this.quarters.push(renderedQuarter);

                    return renderedQuarter;
                })}
            </div>
        );
    }

    private renderQuarter(quarter, fp): any {
        return (
            <div
                className="datepicker-quarter"
                id={`datepicker-quarter-${quarter}`}
                onClick={() => {
                    const date = moment([fp.currentYear])
                        .quarter(quarter)
                        .toDate();
                    fp.setDate(date, true);
                    fp.close();
                }}
            >
                {`Q${quarter}`}
                {this.renderQuarterMonths(quarter)}
            </div>
        );
    }

    private renderQuarterMonths(quarter): any {
        const months = Array.from(Array(MONTHSPERQUARTER), (_, index) => {
            return moment()
                .month(index + (quarter - 1) * MONTHSPERQUARTER)
                .locale(this.getMomentLang())
                .format('MMM');
        });

        return months.map((month) => {
            return <span className="datepicker-month-in-quarter">{month}</span>;
        });
    }

    private selectQuarter(selectedDates, dateString, fp) {
        if (!this.nativePicker) {
            this.quarters.forEach((quarter) => {
                quarter.classList.remove('selected');
            });

            if (
                dateString !== '' &&
                selectedDates[0] &&
                selectedDates[0].getFullYear() === fp.currentYear
            ) {
                const i = Math.floor(
                    selectedDates[0].getMonth() / MONTHSPERQUARTER,
                );
                const selectedQuarter = this.quarters[i];
                selectedQuarter.classList.add('selected');
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
