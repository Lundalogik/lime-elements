import flatpickr from '@limetech/flatpickr';
import { EventEmitter } from '@stencil/core';
import { Picker } from './Picker';

export class DatePicker extends Picker {
    public constructor(
        dateFormat: string = 'L',
        language: string,
        change: EventEmitter
    ) {
        super(dateFormat, language, change);
    }

    public getConfig(nativePicker: boolean): flatpickr.Options.Options {
        return {
            enableTime: false,
            weekNumbers: !nativePicker,
        };
    }
}
