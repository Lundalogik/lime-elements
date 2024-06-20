import flatpickr from 'flatpickr';
import FlatpickrLanguages from 'flatpickr/dist/l10n';
import { EventEmitter } from '@stencil/core';
import 'moment/locale/da';
import 'moment/locale/de';
import 'moment/locale/fi';
import 'moment/locale/fr';
import 'moment/locale/nb';
import 'moment/locale/nl';
import 'moment/locale/sv';
import moment from 'moment/moment';
import { isAndroidDevice, isIOSDevice } from '../../../util/device';

const ARIA_DATE_FORMAT = 'F j, Y';

export abstract class Picker {
    public formatter: (date: Date) => string;

    protected dateFormat: string;
    protected language: string = 'en';

    protected flatpickr: flatpickr.Instance;
    protected nativePicker: boolean;

    public constructor(
        dateFormat: string,
        language: string,
        protected change: EventEmitter<Date>,
    ) {
        this.language = language;
        const isMobile = isIOSDevice() || isAndroidDevice();
        this.nativePicker = isMobile;
        if (dateFormat) {
            this.dateFormat = dateFormat;
        }

        this.getWeek = this.getWeek.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleOnClose = this.handleOnClose.bind(this);
        this.parseDate = this.parseDate.bind(this);
        this.getFlatpickrLang = this.getFlatpickrLang.bind(this);
    }

    public init(element: HTMLElement, container: HTMLElement, value?: Date) {
        let config: flatpickr.Options.Options = {
            clickOpens: this.nativePicker,
            disableMobile: !this.nativePicker,
            formatDate: this.nativePicker ? undefined : this.formatDate,
            parseDate: this.nativePicker ? undefined : this.parseDate,
            appendTo: container,
            onClose: this.handleOnClose,
            defaultDate: value,
            onValueUpdate: this.handleClose,
            inline: !this.nativePicker,
            locale:
                FlatpickrLanguages[this.getFlatpickrLang()] ||
                FlatpickrLanguages.en,
            getWeek: this.getWeek,
        };
        config = { ...config, ...this.getConfig(this.nativePicker) };

        // Week numbers designate weeks as starting with Monday and
        // ending with Sunday. To make the week numbers make sense,
        // the calendar has to show weeks in the same way.
        (config.locale as flatpickr.CustomLocale).firstDayOfWeek = 1;

        this.flatpickr = flatpickr(element, config) as flatpickr.Instance;
    }

    public redraw() {
        this.flatpickr.redraw();
    }

    public destroy() {
        if (!this.flatpickr) {
            return;
        }

        this.flatpickr.destroy();
    }

    public abstract getConfig(
        useNativePicker: boolean,
    ): flatpickr.Options.Options;

    protected handleClose(selectedDates): Promise<any> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const pickerDate = this.getPickerDate(selectedDates);
                this.change.emit(pickerDate);
                resolve(pickerDate);
            }, 0);
        });
    }

    protected getFlatpickrLang() {
        if (this.language === 'nb') {
            return 'no';
        }

        return this.language;
    }

    protected getMomentLang() {
        if (this.language === 'no') {
            return 'nb';
        }

        return this.language;
    }

    private getPickerDate(selectedDates) {
        return selectedDates[0] ? new Date(selectedDates[0].toJSON()) : null;
    }

    private getWeek(date) {
        return moment(date).isoWeek();
    }

    private get formatDate() {
        const longDateFormat = new Intl.DateTimeFormat(this.language, {
            dateStyle: 'long',
        });

        return (date: Date | null, format: string): string => {
            if (!date) {
                return '';
            }

            if (format === ARIA_DATE_FORMAT) {
                return longDateFormat.format(date);
            }

            return this.formatter(date);
        };
    }

    private parseDate(date: string) {
        return moment(date, this.dateFormat, this.getMomentLang()).toDate();
    }

    private handleOnClose() {
        this.flatpickr.element.focus();
    }
}
