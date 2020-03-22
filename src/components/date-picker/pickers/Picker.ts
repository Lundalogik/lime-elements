import flatpickr from '@limetech/flatpickr';
import FlatpickrLanguages from '@limetech/flatpickr/dist/l10n';
import { EventEmitter } from '@stencil/core';
import 'moment/locale/da';
import 'moment/locale/fi';
import 'moment/locale/nb';
import 'moment/locale/sv';
import moment from 'moment/moment';
import { isAndroidDevice, isIOSDevice } from '../../../util/device';

export abstract class Picker {
    protected dateFormat: string;
    protected language: string = 'en';

    protected flatpickr: flatpickr.Instance;
    protected nativePicker;

    public constructor(
        dateFormat: string,
        language: string,
        protected change: EventEmitter<Date>
    ) {
        this.language = language;
        const isMobile = isIOSDevice() || isAndroidDevice();
        this.nativePicker = isMobile;
        if (dateFormat) {
            this.dateFormat = dateFormat;
        }

        this.getWeek = this.getWeek.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.parseDate = this.parseDate.bind(this);
        this.formatDate = this.formatDate.bind(this);
    }

    public init(element: HTMLElement, container: HTMLElement, value?: Date) {
        let config: flatpickr.Options.Options = {
            allowInput: true,
            disableMobile: !this.nativePicker,
            formatDate: this.nativePicker ? undefined : this.formatDate,
            onClose: this.handleClose,
            parseDate: this.nativePicker ? undefined : this.parseDate,
            appendTo: container,
            defaultDate: value,
            locale: FlatpickrLanguages[this.language] || FlatpickrLanguages.en,
            getWeek: this.getWeek,
        };
        config = { ...config, ...this.getConfig(this.nativePicker) };

        // Week numbers designate weeks as starting with Monday and
        // ending with Sunday. To make the week numbers make sense,
        // the calendar has to show weeks in the same way.
        (config.locale as flatpickr.CustomLocale).firstDayOfWeek = 1;

        this.flatpickr = flatpickr(element, config) as flatpickr.Instance; // tslint:disable-line:no-useless-cast
    }

    public destroy() {
        if (!this.flatpickr) {
            return;
        }

        this.flatpickr.destroy();
    }

    public abstract getConfig(
        useNativePicker: boolean
    ): flatpickr.Options.Options;

    public formatDate(date: Date) {
        if (this.nativePicker) {
            return date ? JSON.stringify(date) : '';
        }
        if (date) {
            return moment(date)
                .locale(this.getMomentLang())
                .format(this.dateFormat);
        }
        return '';
    }

    protected handleClose(selectedDates): Promise<any> {
        if (this.nativePicker) {
            return this.handleCloseForNativePicker(selectedDates);
        } else {
            return this.handleCloseForFlatpickr(selectedDates);
        }
    }

    protected getMomentLang() {
        return this.language === 'no' ? 'nb' : this.language;
    }

    private handleCloseForNativePicker(selectedDates) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const pickerDate = this.getPickerDate(selectedDates);
                this.change.emit(pickerDate);
                resolve(pickerDate);
            }, 0);
        });
    }

    private handleCloseForFlatpickr(selectedDates) {
        return new Promise((resolve) => {
            // Since we allow manual editing of the input value, and
            // flatpickr only picks up these changes when the user presses
            // enter in the input, we need to check if the input string
            // and the underlying value match.
            //
            // If this timeout is set to 0, we get a race-condition where
            // the value is sometimes updated from the input-string, and
            // sometimes not.
            const timeout = 100;
            setTimeout(() => {
                const momentInputDate = moment(
                    this.flatpickr.input.value,
                    this.dateFormat,
                    this.getMomentLang()
                );
                let pickerDate = this.getPickerDate(selectedDates);
                const isSameInput = momentInputDate.isSame(pickerDate);
                if (!isSameInput) {
                    if (momentInputDate.isValid()) {
                        pickerDate = momentInputDate.toDate();
                        this.flatpickr.setDate(pickerDate);
                    } else {
                        pickerDate = null;
                        this.flatpickr.clear();
                    }
                }
                this.change.emit(pickerDate);
                resolve(pickerDate);
            }, timeout);
        });
    }

    private getPickerDate(selectedDates) {
        return selectedDates[0] ? new Date(selectedDates[0].toJSON()) : null;
    }

    private getWeek(date) {
        return moment(date).isoWeek();
    }

    private parseDate(dateString) {
        return moment(
            dateString,
            this.dateFormat,
            this.getMomentLang()
        ).toDate();
    }
}
