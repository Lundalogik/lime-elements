import { Component, h, Prop, Event, EventEmitter } from '@stencil/core';
import { Comparate, ComparateType } from './engage-filter-form.types';
import { Option } from 'src/components/select/option.types';

@Component({
    tag: 'limel-comparate',
    shadow: true,
    styleUrl: 'engage-filter-form.scss',
})
export class ComparateComponent {
    @Prop({ attribute: 'value' })
    public comparate: Comparate;

    @Prop()
    public limetype: string;

    @Prop()
    public widgetProps: any;

    /**
     * Emitted when the node has changed.
     */
    @Event()
    private change: EventEmitter<Comparate>;

    constructor() {
        this.handleComparatorTypeChange = this.handleComparatorTypeChange.bind(
            this
        );
        this.handleComparatorValueChange = this.handleComparatorValueChange.bind(
            this
        );
    }

    render() {
        const options = [
            {
                text: 'Value',
                value: ComparateType.value,
            },
            {
                text: 'Property',
                value: ComparateType.property,
            },
        ];

        const type = options.filter(
            option => option.value === this.comparate.type
        )[0];

        let expressionValueField = null;
        if (this.comparate.type === ComparateType.value) {
            expressionValueField = (
                <limel-input-field
                    completions={['null']}
                    class="flex-1 field"
                    value={this.comparate.value}
                    onChange={this.handleComparatorValueChange}
                />
            );
        } else if (this.comparate.type === ComparateType.property) {
            expressionValueField = (
                <limel-property-path
                    limetype={this.limetype}
                    class="flex-1 field"
                    value={this.comparate.value}
                    onChange={this.handleComparatorValueChange}
                />
            );
        }

        return (
            <limel-flex-container>
                <limel-select
                    class="flex-1 field"
                    options={options}
                    value={type}
                    onChange={this.handleComparatorTypeChange}
                />
                {expressionValueField}
            </limel-flex-container>
        );
    }

    private handleComparatorTypeChange(
        event: CustomEvent<Option<ComparateType>>
    ) {
        const { value } = event.detail;
        event.stopPropagation();
        this.change.emit({ ...this.comparate, type: value });
    }

    private handleComparatorValueChange(event: CustomEvent<string>) {
        event.stopPropagation();
        this.change.emit({ ...this.comparate, value: event.detail });
    }
}
