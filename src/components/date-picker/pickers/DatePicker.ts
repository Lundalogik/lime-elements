import { BaseOptions } from 'flatpickr/dist/types/options';
import { Picker } from './Picker';

export class DatePicker extends Picker {
    protected dateFormat = 'L';

    public getConfig(nativePicker: boolean): Partial<BaseOptions> {
        return {
            enableTime: false,
            weekNumbers: !nativePicker,
        };
    }
}
