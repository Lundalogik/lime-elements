import flatpickr from '@limetech/flatpickr';
import weekSelectPlugin from '@limetech/flatpickr/dist/plugins/weekSelect/weekSelect';
import { EventEmitter } from '@stencil/core';
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
