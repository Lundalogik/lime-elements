import { EventEmitter } from '@stencil/core';
import flatpickr from 'flatpickr';
import FlatpickrLanguages from 'flatpickr/dist/l10n';
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
    private nativePicker;

    public constructor(
        dateFormat: string,
        language: string,
        protected change: EventEmitter
    ) {
        this.language = language;
        moment.locale(this.getMomentLang());
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
            locale: FlatpickrLanguages[this.language] || 'en',
        };
        config = { ...config, ...this.getConfig(this.nativePicker) };
        this.flatpickr = flatpickr(element, config) as Instance; // tslint:disable-line:no-useless-cast
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
        if (date) {
            return moment(date)
                .locale(this.getMomentLang())
                .format(this.dateFormat);
        }
        return '';
    }

    protected handleClose(selectedDates) {
        let pickerDate = selectedDates[0]
            ? new Date(selectedDates[0].toJSON())
            : null;
        if (this.nativePicker) {
            this.change.emit(pickerDate);
        } else {
            // With the changes in flatpickr between v4.5.2 and the state of
            // the master branch when we created v4.5.3-lime1, this timeout
            // had to be added to let `flatpickr.input.value` update before
            // reading the value. /Ads
            setTimeout(() => {
                // We need to set the locale before parsing, in case the
                // locale for this picker differs from the locale of the
                // app as a whole. For some reason, the fact that we already
                // set the locale in the Picker constructor doesn't affect
                // the instance used here. /Ads
                moment.locale(this.getMomentLang());
                const momentInputDate = moment(
                    this.flatpickr.input.value,
                    this.dateFormat
                );
                const isSameInput = momentInputDate.isSame(moment(pickerDate));
                if (!isSameInput) {
                    if (momentInputDate.isValid()) {
                        pickerDate = momentInputDate.toDate();
                        this.flatpickr.setDate(pickerDate);
                    } else {
                        this.flatpickr.clear();
                    }
                }
                this.change.emit(pickerDate);
            }, 0);
        }
    }

    private getMomentLang() {
        return this.language === 'no' ? 'nb' : this.language;
    }

    private getWeek(date) {
        return moment(date).isoWeek();
    }

    private parseDate(dateString) {
        return moment(dateString, this.dateFormat).toDate();
    }
}
