import { Component, h, Prop, Event, EventEmitter } from '@stencil/core';
import { Option } from '../select/option.types';
import {
    Node,
    BooleanExpression,
    ComparisonExpression,
    ExpressionType,
    BooleanExpressionNode,
    ComparisonExpressionNode,
} from './engage-filter-form.types';

const isBooleanExpressionNode = (node: Node): node is BooleanExpressionNode => {
    return node.expression_type === ExpressionType.boolean;
};

const isComparisonExpressionNode = (
    node: Node
): node is ComparisonExpressionNode => {
    return node.expression_type === ExpressionType.comparison;
};

@Component({
    tag: 'engage-filter-form',
    shadow: true,
    styleUrl: 'engage-filter-form.scss',
})
export class FilterRuleNode {
    @Prop()
    public value: Node = {};

    @Prop()
    public limetype: string;

    @Prop()
    public widgetProps: any;

    /**
     * Emitted when the node has changed.
     */
    @Event()
    private change: EventEmitter<Node>;

    constructor() {
        this.handleExpressionTypeChange = this.handleExpressionTypeChange.bind(
            this
        );
        this.handleExpressionChange = this.handleExpressionChange.bind(this);
    }

    render() {
        console.log(
            'rendering node',
            this.value,
            this.widgetProps,
            isBooleanExpressionNode(this.value),
            isComparisonExpressionNode(this.value)
        );
        if (isBooleanExpressionNode(this.value)) {
            return (
                <limel-flex-container align="center" justify="start">
                    <limel-flex-container class="node">
                        {this.expressionTypeForm()}
                    </limel-flex-container>
                    <limel-flex-container class="child-node">
                        <limel-boolean-expression
                            limetype={this.limetype}
                            value={this.value.expression}
                            onChange={this.handleExpressionChange}
                        />
                    </limel-flex-container>
                </limel-flex-container>
            );
        } else if (isComparisonExpressionNode(this.value)) {
            return (
                <limel-flex-container justify="start" align="center">
                    <limel-flex-container class="node">
                        {this.expressionTypeForm()}
                    </limel-flex-container>
                    <limel-flex-container class="child-node">
                        <limel-comparison-expression
                            limetype={this.limetype}
                            expression={this.value.expression}
                            onChange={this.handleExpressionChange}
                        />
                    </limel-flex-container>
                </limel-flex-container>
            );
        } else if (!this.value.expression_type) {
            return (
                <limel-flex-container class="node">
                    {this.expressionTypeForm()}
                </limel-flex-container>
            );
        }
    }

    private expressionTypeForm() {
        const options = [
            {
                text: 'Comparison Expression',
                value: ExpressionType.comparison,
            },
            {
                text: 'Boolean Expression',
                value: ExpressionType.boolean,
            },
        ];

        const value = options.filter(
            option => option.value === this.value.expression_type
        )[0];

        return (
            <limel-select
                class="flex-1 field"
                value={value}
                options={options}
                onChange={this.handleExpressionTypeChange}
            />
        );
    }

    private handleExpressionChange(
        event: CustomEvent<BooleanExpression | ComparisonExpression>
    ) {
        event.stopPropagation();
        this.change.emit({
            ...this.value,
            expression: event.detail,
        });
    }

    private handleExpressionTypeChange(
        event: CustomEvent<Option<ExpressionType>>
    ) {
        const { value } = event.detail;
        event.stopPropagation();
        this.change.emit({
            ...this.value,
            expression_type: value,
            expression: { left: {}, right: {} },
        });
    }
}
