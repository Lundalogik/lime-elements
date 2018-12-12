import weekSelectPlugin from 'flatpickr/dist/plugins/weekSelect/weekSelect';
import { BaseOptions } from 'flatpickr/dist/types/options';
import { Picker } from './Picker';

export class WeekPicker extends Picker {
    protected dateFormat = '[w] W GGGG';

    public getConfig(nativePicker: boolean): Partial<BaseOptions> {
        return {
            plugins: [weekSelectPlugin()],
            weekNumbers: !nativePicker,
        };
    }
}
