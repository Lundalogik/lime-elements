import { EventEmitter } from '@stencil/core';
import flatpickr from 'flatpickr';
import weekSelectPlugin from 'flatpickr/dist/plugins/weekSelect/weekSelect';
import { Picker } from './Picker';

export class WeekPicker extends Picker {
    public constructor(
        dateFormat: string = '[w] W GGGG',
        language: string,
        change: EventEmitter
    ) {
        super(dateFormat, language, change);
    }

    public getConfig(nativePicker: boolean): flatpickr.Options.Options {
        const config: any = {};

        if (!nativePicker) {
            config.plugins = [weekSelectPlugin()];
            config.weekNumbers = true;
        }
        return config;
    }
}
