import { BaseOptions } from 'flatpickr/dist/types/options';
import { Picker } from './Picker';

export class DatetimePicker extends Picker {
    protected dateFormat = 'L - LT';

    public getConfig(nativePicker: boolean): Partial<BaseOptions> {
        return {
            enableTime: true,
            weekNumbers: !nativePicker,
            time_24hr: true,
            minuteIncrement: 5,
        };
    }
}
