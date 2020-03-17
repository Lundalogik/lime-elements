import { Component, h, Prop, Event, EventEmitter } from '@stencil/core';
import { Option } from '../select/option.types';
import {
    Node,
    ExpressionPosition,
    ExpressionType,
    Operator,
    Comparer,
    NodeType,
} from './node';

const valueForPosition = (node: Node, position: ExpressionPosition): string => {
    if (position === ExpressionPosition.left) {
        return node.leftValue;
    }

    if (position === ExpressionPosition.right) {
        return node.rightValue;
    }
};

const setValueForPosition = (
    node: Node,
    position: ExpressionPosition,
    value: string
): Node => {
    if (position === ExpressionPosition.left) {
        return { ...node, leftValue: value };
    }

    if (position === ExpressionPosition.right) {
        return { ...node, rightValue: value };
    }
};

const typeForPosition = (node: Node, position: ExpressionPosition): string => {
    if (position === ExpressionPosition.left) {
        return node.leftType;
    }

    if (position === ExpressionPosition.right) {
        return node.rightType;
    }
};

const setTypeForPosition = (
    node: Node,
    position: ExpressionPosition,
    value: ExpressionType
): Node => {
    if (position === ExpressionPosition.left) {
        return { ...node, leftType: value };
    }

    if (position === ExpressionPosition.right) {
        return { ...node, rightType: value };
    }
};

@Component({
    tag: 'limel-filter-node',
    shadow: true,
    styleUrl: 'filter-node.scss',
})
export class FilterRuleNode {
    @Prop()
    public node: Node;

    /**
     * Emitted when the node has changed.
     */
    @Event()
    private change: EventEmitter<Node>;

    constructor() {
        this.handleNodeTypeChange = this.handleNodeTypeChange.bind(this);
        this.handleNodeOperatorChange = this.handleNodeOperatorChange.bind(
            this
        );
        this.handleExpressionTypeChange = this.handleExpressionTypeChange.bind(
            this
        );
        this.handleComparerChange = this.handleComparerChange.bind(this);
        this.handleUpdateLeftNode = this.handleUpdateLeftNode.bind(this);
        this.handleUpdateRightNode = this.handleUpdateRightNode.bind(this);

        this.handleExpressionLeftValueChange = this.handleExpressionLeftValueChange.bind(
            this
        );
        this.handleExpressionRightValueChange = this.handleExpressionRightValueChange.bind(
            this
        );
    }

    render() {
        console.log('rendering node', this.node);
        if (this.node.type === NodeType.operator) {
            return (
                <limel-flex-container direction="vertical">
                    <limel-filter-node
                        node={this.node.left}
                        onChange={this.handleUpdateLeftNode}
                    />

                    <limel-flex-container class="node">
                        {this.newNodeForm()}
                        {this.operatorForm()}
                    </limel-flex-container>
                    <limel-filter-node
                        node={this.node.right}
                        onChange={this.handleUpdateRightNode}
                    />
                </limel-flex-container>
            );
        } else if (this.node.type === NodeType.twoSidedExpression) {
            return (
                <limel-flex-container class="node">
                    {this.newNodeForm()}
                    <span class="vertical-divider" />
                    <limel-flex-container
                        direction="vertical"
                        align="stretch"
                        class="node-item"
                    >
                        {this.expressionValueForm(ExpressionPosition.left)}
                        {this.expressionComparerForm()}
                        {this.expressionValueForm(ExpressionPosition.right)}
                    </limel-flex-container>
                </limel-flex-container>
            );
        } else if (!this.node.type) {
            return (
                <limel-flex-container class="node">
                    {this.newNodeForm()}
                </limel-flex-container>
            );
        }

        throw new Error(
            `Invalid Node Type of ${this.node.type} when rendering`
        );
    }

    private expressionValueForm(position: ExpressionPosition) {
        const options = [
            {
                text: 'Value',
                value: ExpressionType.value,
                position: position,
            },
        ];

        const value = options.filter(
            option => option.value === typeForPosition(this.node, position)
        )[0];

        let expressionValueField = null;
        if (typeForPosition(this.node, position) === ExpressionType.value) {
            let onChange = null;
            if (position === ExpressionPosition.left) {
                onChange = this.handleExpressionLeftValueChange;
            } else {
                onChange = this.handleExpressionRightValueChange;
            }
            expressionValueField = (
                <limel-input-field
                    class="node-item"
                    value={valueForPosition(this.node, position)}
                    onChange={onChange}
                />
            );
        }

        return (
            <limel-flex-container>
                <limel-select
                    class="node-item"
                    options={options}
                    value={value}
                    onChange={this.handleExpressionTypeChange as any}
                />
                {expressionValueField}
            </limel-flex-container>
        );
    }

    private expressionComparerForm() {
        const options = [
            {
                text: 'Equals',
                value: Comparer.equals,
            },
            {
                text: 'Not Equals',
                value: Comparer.notEquals,
            },
        ];

        const value = options.filter(
            option => option.value === this.node.comparer
        )[0];

        return (
            <limel-select
                options={options}
                value={value}
                onChange={this.handleComparerChange}
            />
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
            option => option.value === this.node.operator
        )[0];

        return (
            <limel-select
                class="node-item"
                options={options}
                value={value}
                onChange={this.handleNodeOperatorChange}
            />
        );
    }

    private newNodeForm() {
        const options = [
            {
                text: 'Two Sided Filter',
                value: NodeType.twoSidedExpression,
            },
            {
                text: 'Boolean Operator',
                value: NodeType.operator,
            },
        ];

        const value = options.filter(
            option => option.value === this.node.type
        )[0];

        return (
            <limel-select
                class="node-item"
                value={value}
                options={options}
                onChange={this.handleNodeTypeChange}
            />
        );
    }

    private handleNodeTypeChange(event: CustomEvent<Option<NodeType>>) {
        const { value } = event.detail;
        event.stopPropagation();
        if (value === NodeType.operator) {
            this.change.emit({
                ...this.node,
                type: value,
                left: {},
                right: {},
            });
        } else {
            this.change.emit({ ...this.node, type: value });
        }
    }

    private handleNodeOperatorChange(event: CustomEvent<Option<Operator>>) {
        const { value } = event.detail;
        event.stopPropagation();
        this.change.emit({ ...this.node, operator: value });
    }

    private handleComparerChange(event: CustomEvent<Option<Comparer>>) {
        const { value } = event.detail;
        event.stopPropagation();
        this.change.emit({ ...this.node, comparer: value });
    }

    private handleExpressionTypeChange(
        event: CustomEvent<{
            text: string;
            value: ExpressionType;
            position: ExpressionPosition;
        }>
    ) {
        const { value, position } = event.detail;
        event.stopPropagation();
        this.change.emit(setTypeForPosition(this.node, position, value));
    }

    private handleExpressionLeftValueChange(event: CustomEvent<string>) {
        event.stopPropagation();
        this.change.emit(
            setValueForPosition(
                this.node,
                ExpressionPosition.left,
                event.detail
            )
        );
    }

    private handleExpressionRightValueChange(event: CustomEvent<string>) {
        event.stopPropagation();
        this.change.emit(
            setValueForPosition(
                this.node,
                ExpressionPosition.right,
                event.detail
            )
        );
    }

    private handleUpdateLeftNode(event: CustomEvent<Node>) {
        event.stopPropagation();
        this.change.emit({ ...this.node, left: event.detail });
    }

    private handleUpdateRightNode(event: CustomEvent<Node>) {
        event.stopPropagation();
        this.change.emit({ ...this.node, right: event.detail });
    }
}
