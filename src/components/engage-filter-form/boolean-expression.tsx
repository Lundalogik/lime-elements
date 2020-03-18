import { Component, h, Prop, Event, EventEmitter } from '@stencil/core';
import { BooleanExpression, Operator, Node } from './engage-filter-form.types';
import { Option } from 'src/components/select/option.types';

@Component({
    tag: 'limel-boolean-expression',
    shadow: true,
    styleUrl: 'engage-filter-form.scss',
})
export class BooleanExpressionComponent {
    @Prop()
    public value: BooleanExpression;

    @Prop()
    public limetype: string;

    @Prop()
    public widgetProps: any;

    /**
     * Emitted when the node has changed.
     */
    @Event()
    private change: EventEmitter<BooleanExpression>;

    constructor() {
        this.handleOperatorChange = this.handleOperatorChange.bind(this);
        this.handleUpdateLeftNode = this.handleUpdateLeftNode.bind(this);
        this.handleUpdateRightNode = this.handleUpdateRightNode.bind(this);
    }

    render() {
        return (
            <limel-flex-container justify="start">
                <limel-flex-container class="node">
                    {this.operatorForm()}
                </limel-flex-container>

                {this.value.operator && (
                    <limel-flex-container
                        direction="vertical"
                        align="start"
                        class="nested-nodes"
                    >
                        <engage-filter-form
                            limetype={this.limetype}
                            class="first-node"
                            value={this.value.left}
                            onChange={this.handleUpdateLeftNode}
                        />
                        <engage-filter-form
                            limetype={this.limetype}
                            class="second-node"
                            value={this.value.right}
                            onChange={this.handleUpdateRightNode}
                        />
                    </limel-flex-container>
                )}
            </limel-flex-container>
        );
    }

    private operatorForm() {
        const options = [
            {
                text: 'And',
                value: Operator.and,
            },
            {
                text: 'Or',
                value: Operator.or,
            },
        ];

        const value = options.filter(
            option => option.value === this.value.operator
        )[0];

        return (
            <limel-select
                class="flex-1"
                options={options}
                value={value}
                onChange={this.handleOperatorChange}
            />
        );
    }

    private handleOperatorChange(event: CustomEvent<Option<Operator>>) {
        const { value } = event.detail;
        event.stopPropagation();
        this.change.emit({ ...this.value, operator: value });
    }

    private handleUpdateLeftNode(event: CustomEvent<Node>) {
        event.stopPropagation();
        this.change.emit({ ...this.value, left: event.detail });
    }

    private handleUpdateRightNode(event: CustomEvent<Node>) {
        event.stopPropagation();
        this.change.emit({ ...this.value, right: event.detail });
    }
}
