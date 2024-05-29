import { Component, h, Prop } from '@stencil/core';
import { LimelPickerCustomEvent } from 'src/components';
import { ListItem } from 'src/components/list/list-item.types';
import { Searcher } from 'src/components/picker/searcher.types';
import { PickerValue } from 'src/components/picker/value.types';

/**
 * @private
 */
@Component({
    tag: 'limel-limeobject-selector-picker',
    shadow: true,
    styleUrl: 'limeobject-selector-picker.scss',
})
export class LimeobjectSelectorPicker {
    /**
     * Currently selected value or values. Where the value can be an object.
     */
    @Prop()
    public value: ListItem<PickerValue> | Array<ListItem<PickerValue>>;

    /**
     * A search function that takes a search-string as an argument,
     * and returns a promise that will eventually be resolved with
     * an array of `ListItem`:s.
     *
     * See the docs for the type `Searcher` for type information on
     * the searcher function itself.
     */
    @Prop()
    public searcher: Searcher;

    @Prop()
    public offset: {
        top: string;
        left: string;
    }

    @Prop()
    public onChange: (
        event: LimelPickerCustomEvent<ListItem<PickerValue>>,
    ) => void;

    public render() {
        return (
            <div class="picker" style={
                {
                    top: this.offset.top,
                    left: this.offset.left,
                }
            }>
                <limel-picker
                    searcher={this.searcher}
                    value={this.value}
                    onChange={this.onChange}
                ></limel-picker>
            </div>
        );
    }
}
