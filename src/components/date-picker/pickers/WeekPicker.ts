import flatpickr from 'flatpickr';
import weekSelectPlugin from 'flatpickr/dist/plugins/weekSelect/weekSelect';
import { EventEmitter } from '@stencil/core';
import { Picker } from './Picker';

export class WeekPicker extends Picker {
    public constructor(
        language: string,
        change: EventEmitter,
        dateFormat: string = '[w] W GGGG',
    ) {
        super(language, change, dateFormat);
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
