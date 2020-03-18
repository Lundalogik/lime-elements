import { Component, h, Prop, Event, EventEmitter } from '@stencil/core';
import {
    ComparisonExpression,
    Comparator,
    Comparate,
} from './engage-filter-form.types';
import { Option } from 'src/components/select/option.types';

@Component({
    tag: 'limel-comparison-expression',
    shadow: true,
    styleUrl: 'engage-filter-form.scss',
})
export class ComparisionExpressionComponent {
    @Prop({ attribute: 'value' })
    public expression: ComparisonExpression;

    @Prop()
    public limetype: string;

    @Prop()
    public widgetProps: any;

    /**
     * Emitted when the node has changed.
     */
    @Event()
    private change: EventEmitter<ComparisonExpression>;

    constructor() {
        this.handleComparatorChange = this.handleComparatorChange.bind(this);
        this.handleUpdateLeftComparate = this.handleUpdateLeftComparate.bind(
            this
        );
        this.handleUpdateRightComparate = this.handleUpdateRightComparate.bind(
            this
        );
    }

    render() {
        return (
            <limel-flex-container
                direction="vertical"
                class="flex-1 no-wrap node"
                align="stretch"
            >
                <limel-comparate
                    limetype={this.limetype}
                    comparate={this.expression.left}
                    onChange={this.handleUpdateLeftComparate}
                />
                {this.expressionComparatorForm()}
                <limel-comparate
                    limetype={this.limetype}
                    comparate={this.expression.right}
                    onChange={this.handleUpdateRightComparate}
                />
            </limel-flex-container>
        );
    }

    private expressionComparatorForm() {
        const options = [
            {
                text: 'Equals',
                value: Comparator.equals,
            },
            {
                text: 'Not Equals',
                value: Comparator.notEquals,
            },
        ];

        const value = options.filter(
            option => option.value === this.expression.comparator
        )[0];

        return (
            <limel-select
                class="field"
                options={options}
                value={value}
                onChange={this.handleComparatorChange}
            />
        );
    }

    private handleComparatorChange(event: CustomEvent<Option<Comparator>>) {
        const { value } = event.detail;
        event.stopPropagation();
        this.change.emit({ ...this.expression, comparator: value });
    }

    private handleUpdateLeftComparate(event: CustomEvent<Comparate>) {
        event.stopPropagation();
        this.change.emit({ ...this.expression, left: event.detail });
    }

    private handleUpdateRightComparate(event: CustomEvent<Comparate>) {
        event.stopPropagation();
        this.change.emit({ ...this.expression, right: event.detail });
    }
}
