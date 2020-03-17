export enum ExpressionType {
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

export enum Comparer {
    equals = 'equals',
    notEquals = 'not-equals',
}

export enum NodeType {
    operator = 'operator',
    // oneSidedExpression = 'one-sided-expression',
    twoSidedExpression = 'two-sided-expression',
}

export interface Node {
    type?: NodeType;
    left?: Node;
    right?: Node;
    operator?: Operator;
    comparer?: Comparer;
    leftValue?: string;
    rightValue?: string;
    leftType?: ExpressionType;
    rightType?: ExpressionType;
}
