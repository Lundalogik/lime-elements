import { EventEmitter } from '@stencil/core';
import { BaseOptions } from 'flatpickr/dist/types/options';
import { Picker } from './Picker';

export class DatetimePicker extends Picker {
    public constructor(dateFormat: string = 'L - LT', change: EventEmitter) {
        super(dateFormat, change);
    }

    public getConfig(nativePicker: boolean): Partial<BaseOptions> {
        return {
            enableTime: true,
            weekNumbers: !nativePicker,
            time_24hr: true,
            minuteIncrement: 5,
        };
    }
}
