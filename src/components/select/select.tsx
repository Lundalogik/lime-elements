import { Component, Event, EventEmitter, Prop } from '@stencil/core';
import { Option } from '../../interface';

@Component({
    tag: 'limel-select',
    shadow: true,
})
export class Select {
    /**
     * Set to `true` to disable the input.
     */
    @Prop({ reflectToAttr: true })
    public disabled = false;

    /**
     * The input label.
     */
    @Prop({ reflectToAttr: true })
    public label: string;

    /**
     * Set to `true` to enable selection of more than one option.
     */
    @Prop({ reflectToAttr: true })
    public multiple = false;

    /**
     * When `multiple` is disabled: the currently selected item.
     * When `multiple` is enabled: an array with the currently selected items.
     */
    @Prop()
    public value: Option | Option[];

    @Prop()
    public options: Option[] = [];

    @Event()
    private change: EventEmitter<Option | Option[]>;

    constructor() {
        this.onChange = this.onChange.bind(this);
    }

    public render() {
        if (this.multiple) {
            return (
                <limel-select-multiple
                    label={this.label}
                    value={this.value as Option[]}
                    options={this.options}
                    disabled={this.disabled}
                    onChange={this.onChange}
                />
            );
        }
        return (
            <limel-select-single
                label={this.label}
                value={this.value as Option}
                options={this.options}
                disabled={this.disabled}
                onChange={this.onChange}
            />
        );
    }

    private onChange(event) {
        event.stopPropagation();
        this.change.emit(event.detail);
    }
}
