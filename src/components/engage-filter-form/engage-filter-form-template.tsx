import { Component, h, Prop } from '@stencil/core';
import {
    Node,
    ExpressionType,
    BooleanExpressionNode,
    ComparisonExpressionNode,
} from './engage-filter-form.types';
import {
    ObjectFieldTemplateProps,
    ObjectFieldProperty,
} from '../form/templates/types';

const isBooleanExpressionNode = (node: Node): node is BooleanExpressionNode => {
    return node.expression_type === ExpressionType.boolean;
};

const isComparisonExpressionNode = (
    node: Node
): node is ComparisonExpressionNode => {
    return node.expression_type === ExpressionType.comparison;
};

@Component({
    tag: 'engage-filter-form-template',
    shadow: true,
    styleUrl: 'engage-filter-form.scss',
})
export class EngageFilterFormTemplate {
    @Prop()
    public templateProps: ObjectFieldTemplateProps;

    render() {
        console.log('rendering node', this.templateProps);

        if (!this.templateProps) {
            return;
        }

        const { formData } = this.templateProps;

        if (isBooleanExpressionNode(this.templateProps.formData)) {
            return (
                <limel-flex-container align="center" justify="start">
                    <limel-flex-container class="node">
                        <react-render
                            content={
                                this.getProperty('expression_type').content
                            }
                        />
                    </limel-flex-container>
                    <limel-flex-container class="child-node">
                        <react-render
                            content={this.getProperty('expression').content}
                        />
                    </limel-flex-container>
                </limel-flex-container>
            );
        } else if (isComparisonExpressionNode(formData)) {
            return (
                <limel-flex-container justify="start" align="center">
                    <limel-flex-container class="node">
                        <react-render
                            content={
                                this.getProperty('expression_type').content
                            }
                        />
                    </limel-flex-container>
                    <limel-flex-container class="child-node">
                        <react-render
                            content={this.getProperty('expression').content}
                        />
                    </limel-flex-container>
                </limel-flex-container>
            );
        } else if (!formData.expression_type) {
            return (
                <limel-flex-container class="node">
                    <react-render
                        content={this.getProperty('expression_type').content}
                    />
                </limel-flex-container>
            );
        } else {
            throw new Error(
                'Failed to render engage-filter-form with provided template props'
            );
        }
    }

    private getProperty(name: string): ObjectFieldProperty {
        for (const property of this.templateProps.properties) {
            if (property.name === name) {
                return property;
            }
        }

        throw new Error('Property not found: ' + name);
    }
}
