import flatpickr from 'flatpickr';
import weekSelectPlugin from 'flatpickr/dist/plugins/weekSelect/weekSelect';
import { EventEmitter } from '@stencil/core';
import { Picker } from './picker';

const DAYS_PER_WEEK = 7;

export class WeekPicker extends Picker {
    public constructor(
        language: string,
        change: EventEmitter,
        dateFormat: string = '[w] W GGGG'
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

    /**
     * The `weekSelect` plugin marks the selected week from Flatpickr's
     * hooks, which a silent `setDate` never fires, and the redraw it does
     * trigger rebuilds the day cells without the marking. This repeats the
     * plugin's own marking: the row of seven cells the selected day is in.
     */
    protected redrawSelection() {
        const days = this.flatpickr.days?.childNodes;
        const selectedIndex = this.flatpickr.selectedDateElem?.$i;
        if (this.nativePicker || !days || selectedIndex === undefined) {
            return;
        }

        const weekStart =
            DAYS_PER_WEEK * Math.floor(selectedIndex / DAYS_PER_WEEK);
        for (let i = weekStart; i < weekStart + DAYS_PER_WEEK; i++) {
            (days[i] as HTMLElement).classList.add('week', 'selected');
        }
    }
}
