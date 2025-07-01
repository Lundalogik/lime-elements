import flatpickr from 'flatpickr';
import { EventEmitter } from '@stencil/core';
import { Picker } from './picker';

export class DatePicker extends Picker {
    public constructor(
        language: string,
        change: EventEmitter,
        dateFormat: string = 'L'
    ) {
        super(language, change, dateFormat);
    }

    public getConfig(nativePicker: boolean): flatpickr.Options.Options {
        return {
            enableTime: false,
            weekNumbers: !nativePicker,
        };
    }
}
