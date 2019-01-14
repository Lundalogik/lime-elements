import { EventEmitter } from '@stencil/core';
import { BaseOptions } from 'flatpickr/dist/types/options';
import { Picker } from './Picker';

export class TimePicker extends Picker {
    public constructor(
        dateFormat: string = 'LT',
        language: string,
        change: EventEmitter
    ) {
        super(dateFormat, language, change);
    }

    public getConfig(): Partial<BaseOptions> {
        return {
            enableTime: true,
            noCalendar: true,
            time_24hr: true,
            minuteIncrement: 5,
            defaultHour: 12,
            defaultMinute: 0,
        };
    }
}
