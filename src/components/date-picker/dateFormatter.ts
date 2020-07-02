import 'moment/locale/da';
import 'moment/locale/fi';
import 'moment/locale/nb';
import 'moment/locale/sv';
import moment from 'moment/moment';
import { DateType } from './date.types';

export class DateFormatter {
    private language: string;

    public constructor(language: string = 'en') {
        this.language = language;
    }

    public formatDate(date: Date, dateFormat: string) {
        if (date) {
            return moment(date).locale(this.getLanguage()).format(dateFormat);
        }
        return '';
    }

    public parseDate(date: string, dateFormat: string) {
        if (date) {
            return moment(date, dateFormat).toDate();
        }
        return null;
    }

    public getLanguage() {
        return this.language === 'no' ? 'nb' : this.language;
    }

    public getDateFormat(type: DateType) {
        return (
            {
                date: 'L',
                time: 'LT',
                week: '[w] W GGGG',
                month: 'MM/YYYY',
                quarter: '[Q]Q YYYY',
                year: 'YYYY',
                datetime: 'L - LT',
            }[type] || 'L - LT'
        );
    }
}
