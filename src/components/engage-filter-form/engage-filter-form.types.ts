export enum ExpressionType {
    boolean = 'boolean-expression',
    comparison = 'comparison-expression',
}

export enum ComparateType {
    value = 'value',
    property = 'property',
}

export enum ExpressionPosition {
    left = 'left',
    right = 'right',
}

export enum Operator {
    and = 'and',
    or = 'or',
}

export enum Comparator {
    equals = 'equals',
    notEquals = 'does_not_equal',
}

export interface Node {
    expression_type?: ExpressionType;
    expression?: BooleanExpression | ComparisonExpression;
}

export interface BooleanExpressionNode {
    expression_type?: ExpressionType.boolean;
    expression?: BooleanExpression;
}

export interface ComparisonExpressionNode {
    expression_type?: ExpressionType.comparison;
    expression?: ComparisonExpression;
}

export interface BooleanExpression {
    operator?: Operator;
    left?: Node;
    right?: Node;
}

export interface Comparate {
    type?: ComparateType;
    value?: string;
}

export interface ComparisonExpression {
    comparator?: Comparator;
    left?: Comparate;
    right?: Comparate;
}
