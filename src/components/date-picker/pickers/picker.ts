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
    public formatter = (date: Date) =>
        moment(date).locale(this.getMomentLang()).format(this.dateFormat);

    protected dateFormat: string;
    protected language: string = 'en';

    protected flatpickr: flatpickr.Instance;
    protected nativePicker: boolean;

    public constructor(
        language: string,
        protected change: EventEmitter<Date>,
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
     * `dateFormat` is otherwise only set once, from the constructor. Without
     * this, changing the `format` prop on `limel-date-picker` after the
     * calendar has already been created updates what's displayed and what
     * `DateFormatter.parseDate` validates typed text against, but not what
     * this Flatpickr instance itself parses typed text against on blur or
     * `Enter` — so it would keep accepting (and silently reformatting) text
     * in the old format.
     * @param dateFormat - the new moment format string to parse and
     * display against
     */
    public setDateFormat(dateFormat: string) {
        if (dateFormat) {
            this.dateFormat = dateFormat;
        }
    }

    public init(element: HTMLElement, container: HTMLElement, value?: Date) {
        const config: flatpickr.Options.Options = {
            // Flatpickr defaults to `false`, which forces the bound input
            // to `readonly` — silently blocking all keyboard character
            // entry, so a value can only ever come from picking a date in
            // the calendar. Typing a date directly requires this to be on.
            allowInput: true,
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
            ...this.getConfig(this.nativePicker),
        };

        // Week numbers designate weeks as starting with Monday and
        // ending with Sunday. To make the week numbers make sense,
        // the calendar has to show weeks in the same way.
        (config.locale as flatpickr.CustomLocale).firstDayOfWeek = 1;

        this.flatpickr = flatpickr(element, config) as flatpickr.Instance;

        // Whenever typed text fails to parse, Flatpickr's own onBlur/Enter
        // handling calls `setDate(rawText, ...)` on its own — which, once
        // it finds nothing parseable, still unconditionally overwrites the
        // input's DOM value directly (to an empty string) and fires
        // `onValueUpdate`, bypassing Stencil and racing the typed-input
        // handling above, which has already decided to keep the raw
        // invalid text visible with an error message instead. Flatpickr
        // exposes no option to opt out of just that reaction, so only let
        // its own `setDate` through for input it can actually parse;
        // programmatic calls (e.g. `Picker.setValue`, an actual calendar
        // pick) always pass a real `Date`, never a raw string, so they are
        // untouched by this guard.
        const setDate = this.flatpickr.setDate.bind(this.flatpickr);
        this.flatpickr.setDate = (date, triggerChange, format) => {
            if (typeof date === 'string' && !this.parseDate(date)) {
                return;
            }

            setDate(date, triggerChange, format);
        };
    }

    public setValue(value: Date) {
        const currentlySelected = this.flatpickr?.selectedDates[0];
        const isUnchanged = currentlySelected
            ? value?.getTime() === currentlySelected.getTime()
            : !value;

        if (isUnchanged) {
            // Nothing to sync: Flatpickr's own selected date already
            // matches (or both are empty). This runs on every re-render
            // while the calendar is closed, including ones that have
            // nothing to do with `value` at all — e.g. the typed-input
            // handling flagging invalid text as an error. Calling
            // `setDate` anyway would still force-sync the input's raw DOM
            // value unconditionally, wiping out that preserved invalid
            // text even though nothing about the *value* actually changed.
            return;
        }

        this.flatpickr?.setDate(value, false);
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

    /**
     * Without this, Flatpickr falls back to its own default date-format
     * tokens (`Y-m-d`) to parse whatever the user types on blur or `Enter` —
     * a different, mismatched format from `dateFormat` (the one actually
     * displayed, and the one `DateFormatter.parseDate` uses elsewhere for
     * the exact same text). That mismatch let Flatpickr silently commit a
     * misparsed date out from under the typed-input handling. Routing it
     * through the same moment format keeps both in agreement.
     *
     * The locale must be passed into the parse call itself (not chained on
     * afterwards) for the same reason `DateFormatter.parseDate` does: this
     * module's `import 'moment/locale/*'` side effects switch moment's
     * global default locale, so a localized token like `L` would otherwise
     * get parsed against the wrong locale's pattern. Strict mode avoids
     * moment's lenient partial-match parsing treating a not-yet-finished
     * typed string as already a complete, committable date.
     * @param dateStr - the raw text Flatpickr wants parsed as a date
     */
    private parseDate = (dateStr: string): Date | undefined => {
        const parsed = moment(
            dateStr,
            this.dateFormat,
            this.getMomentLang(),
            true
        );

        return parsed.isValid() ? parsed.toDate() : undefined;
    };

    private handleOnClose() {
        this.flatpickr?.element.focus();
    }
}
