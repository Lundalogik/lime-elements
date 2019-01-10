import { EventEmitter } from '@stencil/core';
import weekSelectPlugin from 'flatpickr/dist/plugins/weekSelect/weekSelect';
import { BaseOptions } from 'flatpickr/dist/types/options';
import { Picker } from './Picker';

export class WeekPicker extends Picker {
    public constructor(
        dateFormat: string = '[w] W GGGG',
        change: EventEmitter
    ) {
        super(dateFormat, change);
    }

    public getConfig(nativePicker: boolean): Partial<BaseOptions> {
        return {
            plugins: [weekSelectPlugin()],
            weekNumbers: !nativePicker,
        };
    }
}
