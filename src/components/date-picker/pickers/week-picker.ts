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
     * Marks the selected week the way the `weekSelect` plugin does.
     */
    protected redrawSelection() {
        const days = this.flatpickr.days?.childNodes;
        const selectedIndex = this.flatpickr.selectedDateElem?.$i;
        // `clear()` leaves `selectedDateElem` on the old cell.
        const hasSelection = this.flatpickr.selectedDates.length > 0;
        if (
            this.nativePicker ||
            !days ||
            !hasSelection ||
            selectedIndex === undefined
        ) {
            return;
        }

        const weekStart =
            DAYS_PER_WEEK * Math.floor(selectedIndex / DAYS_PER_WEEK);
        for (let i = weekStart; i < weekStart + DAYS_PER_WEEK; i++) {
            (days[i] as HTMLElement).classList.add('week', 'selected');
        }
    }
}
