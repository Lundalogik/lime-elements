import { EventEmitter } from '@stencil/core';
import flatpickr from 'flatpickr';
import { Instance } from 'flatpickr/dist/types/instance';
import { BaseOptions } from 'flatpickr/dist/types/options';
import moment from 'moment/moment';
import { isAndroidDevice, isIOSDevice } from '../../../util/device';

export abstract class Picker {
    protected dateFormat: string;

    protected flatpickr: Instance;

    private nativePicker;

    public constructor(dateFormat: string, protected change: EventEmitter) {
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
        let config: Partial<BaseOptions> = {
            allowInput: true,
            disableMobile: !this.nativePicker,
            formatDate: this.nativePicker ? undefined : this.formatDate,
            onClose: this.handleClose,
            parseDate: this.nativePicker ? undefined : this.parseDate,
            appendTo: container,
            defaultDate: value,
        };

        config = { ...config, ...this.getConfig(this.nativePicker) };
        this.flatpickr = flatpickr(element, config) as Instance;
    }

    public destroy() {
        if (!this.flatpickr) {
            return;
        }

        this.flatpickr.destroy();
    }

    public abstract getConfig(useNativePicker: boolean): Partial<BaseOptions>;

    public formatDate(date: Date) {
        if (date) {
            return moment(date).format(this.dateFormat);
        }
        return '';
    }

    protected handleClose(selectedDates) {
        const date = selectedDates[0]
            ? new Date(selectedDates[0].toJSON())
            : null;
        this.change.emit(date);
    }

    private getWeek(date) {
        return moment(date).isoWeek();
    }

    private parseDate(dateString) {
        return moment(dateString, this.dateFormat).toDate();
    }
}
