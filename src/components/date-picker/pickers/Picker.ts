import flatpickr from 'flatpickr';
import FlatpickrLanguages from 'flatpickr/dist/l10n';
import { EventEmitter } from '@stencil/core';
import 'moment/locale/da';
import 'moment/locale/fi';
import 'moment/locale/nb';
import 'moment/locale/sv';
import moment from 'moment/moment';
import { isAndroidDevice, isIOSDevice } from '../../../util/device';
import { DateFormatter } from '../dateFormatter';

export abstract class Picker {
    private dateFormatter: DateFormatter;

    protected dateFormat: string;
    protected language: string = 'en';

    protected flatpickr: flatpickr.Instance;
    protected nativePicker: boolean;

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
        this.dateFormatter = new DateFormatter(language);

        this.getWeek = this.getWeek.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.parseDate = this.parseDate.bind(this);
        this.formatDate = this.formatDate.bind(this);
        this.getFlatpickrLang = this.getFlatpickrLang.bind(this);
    }

    public init(element: HTMLElement, container: HTMLElement, value?: Date) {
        let config: flatpickr.Options.Options = {
            clickOpens: this.nativePicker,
            disableMobile: !this.nativePicker,
            formatDate: this.nativePicker ? undefined : this.formatDate,
            parseDate: this.nativePicker ? undefined : this.parseDate,
            appendTo: container,
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

        this.flatpickr = flatpickr(element, config) as flatpickr.Instance; // tslint:disable-line:no-useless-cast
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
        useNativePicker: boolean
    ): flatpickr.Options.Options;

    public formatDate(date: Date) {
        return this.dateFormatter.formatDate(date, this.dateFormat);
    }

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
        return this.language === 'nb' ? 'no' : this.language;
    }

    protected getMomentLang() {
        return this.language === 'no' ? 'nb' : this.language;
    }

    private getPickerDate(selectedDates) {
        return selectedDates[0] ? new Date(selectedDates[0].toJSON()) : null;
    }

    private getWeek(date) {
        return moment(date).isoWeek();
    }

    private parseDate(date: string) {
        return moment(date, this.dateFormat, this.getMomentLang()).toDate();
    }
}
