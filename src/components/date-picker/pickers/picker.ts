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
import { getPrimarySubtag } from '../../../util/language';

const ARIA_DATE_FORMAT = 'F j, Y';

export abstract class Picker {
    /**
     * Formats a date the way Flatpickr displays it. Not settable from
     * outside: a consumer's `formatter` is only for `limel-date-picker`'s
     * at-rest display, while this must follow `dateFormat`.
     * @param date - the date to format
     */
    private formatter = (date: Date) =>
        moment(date).locale(this.getMomentLang()).format(this.dateFormat);

    protected dateFormat: string;
    protected language: string = 'en';

    protected flatpickr: flatpickr.Instance;
    protected nativePicker: boolean;

    /**
     * The element to focus when the calendar closes. Flatpickr is bound to
     * a hidden proxy input, so its own focus restore never reaches the
     * field the user actually interacts with.
     */
    private focusTarget: HTMLElement;

    public constructor(
        language: string,
        protected change: EventEmitter<Date | null>,
        dateFormat: string
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
        this.getFlatpickrLang = this.getFlatpickrLang.bind(this);
    }

    /**
     * Keeps the format Flatpickr displays dates in up to date when the
     * `format` prop changes after the calendar has been created.
     * @param dateFormat - the moment format string to display dates in
     */
    public setDateFormat(dateFormat: string) {
        if (dateFormat) {
            this.dateFormat = dateFormat;
        }
    }

    /**
     * @param element - the input Flatpickr binds to. Typed text is parsed
     * by `limel-date-picker`, not Flatpickr, so this is a hidden proxy.
     * @param container - where the inline calendar is rendered
     * @param value - the initially selected date
     * @param focusTarget - the element to focus when the calendar closes
     */
    public init(
        element: HTMLElement,
        container: HTMLElement,
        value?: Date,
        focusTarget?: HTMLElement
    ) {
        this.focusTarget = focusTarget ?? element;

        const config: flatpickr.Options.Options = {
            clickOpens: this.nativePicker,
            disableMobile: !this.nativePicker,
            formatDate: this.nativePicker ? undefined : this.formatDate,
            appendTo: container,
            onClose: this.handleOnClose,
            defaultDate: value,
            onValueUpdate: this.handleClose,
            inline: !this.nativePicker,
            locale:
                FlatpickrLanguages[this.getFlatpickrLang()] ||
                FlatpickrLanguages.en,
            getWeek: this.getWeek,
            ...this.getConfig(this.nativePicker),
        };

        // Week numbers designate weeks as starting with Monday and
        // ending with Sunday. To make the week numbers make sense,
        // the calendar has to show weeks in the same way.
        (config.locale as flatpickr.CustomLocale).firstDayOfWeek = 1;

        this.flatpickr = flatpickr(element, config) as flatpickr.Instance;
    }

    public setValue(value: Date) {
        const currentlySelected = this.flatpickr?.selectedDates[0];
        const isUnchanged = currentlySelected
            ? value?.getTime() === currentlySelected.getTime()
            : !value;

        if (!this.flatpickr || isUnchanged) {
            // This runs on every re-render while the calendar is closed;
            // skip the redraw when the selected date already matches.
            return;
        }

        this.flatpickr.setDate(value, false);
        this.redrawSelection();
    }

    /**
     * Re-paints the selection after `setValue`. Setting the date silently
     * (without `triggerChange`, which would emit it as a `change`) redraws
     * Flatpickr's own day grid but fires none of its hooks, so a picker
     * that paints its selection from those hooks must do so here.
     */
    protected redrawSelection(): void {
        // The default day grid is redrawn by Flatpickr itself.
    }

    public redraw() {
        this.flatpickr?.redraw();
    }

    public destroy() {
        if (!this.flatpickr) {
            return;
        }

        this.flatpickr.destroy();
        this.flatpickr = null;
    }

    public abstract getConfig(
        useNativePicker: boolean
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
        const language = getPrimarySubtag(this.language);
        if (language === 'nb') {
            return 'no';
        }
        return language;
    }

    protected getMomentLang() {
        const language = getPrimarySubtag(this.language);
        if (language === 'no') {
            return 'nb';
        }

        return language;
    }

    private getPickerDate(selectedDates) {
        return selectedDates[0] ? new Date(selectedDates[0].toJSON()) : null;
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

    private getWeek(date) {
        return moment(date).isoWeek();
    }

    private handleOnClose() {
        this.focusTarget?.focus();
    }
}
