import 'moment/locale/da';
import 'moment/locale/fi';
import 'moment/locale/nb';
import 'moment/locale/sv';
import moment from 'moment/moment';
import { isAndroidDevice, isIOSDevice } from '../../util/device';
import { DateType } from './date.types';

export class DateFormatter {
    private isMobile: boolean;
    private language: string;

    public constructor(language: string = 'en') {
        this.language = language;
        this.isMobile = isIOSDevice() || isAndroidDevice();
    }

    public formatDate(date: Date, dateFormat) {
        if (this.isMobile) {
            return date ? JSON.stringify(date) : '';
        }
        if (date) {
            return moment(date).locale(this.getLanguage()).format(dateFormat);
        }
        return '';
    }

    public formatDateByType(date: Date, type: DateType) {
        const dateFormat = this.getDateFormat(type);
        if (this.isMobile) {
            return date ? JSON.stringify(date) : '';
        }
        if (date) {
            return moment(date).locale(this.getLanguage()).format(dateFormat);
        }
        return '';
    }

    public getLanguage() {
        return this.language === 'no' ? 'nb' : this.language;
    }

    private getDateFormat(type: DateType) {
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
