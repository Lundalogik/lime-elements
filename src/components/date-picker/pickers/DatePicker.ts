import { EventEmitter } from '@stencil/core';
import { BaseOptions } from 'flatpickr/dist/types/options';
import { Picker } from './Picker';

export class DatePicker extends Picker {
    public constructor(dateFormat: string = 'L', change: EventEmitter) {
        super(dateFormat, change);
    }

    public getConfig(nativePicker: boolean): Partial<BaseOptions> {
        return {
            enableTime: false,
            weekNumbers: !nativePicker,
        };
    }
}
