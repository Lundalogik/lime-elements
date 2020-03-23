import { Component, h, Prop } from '@stencil/core';
import {
    ObjectFieldTemplateProps,
    ObjectFieldProperty,
} from '../form/templates/types';

@Component({
    tag: 'limel-boolean-expression',
    shadow: true,
    styleUrl: 'engage-filter-form.scss',
})
export class BooleanExpressionComponent {
    @Prop()
    public templateProps: ObjectFieldTemplateProps;

    render() {
        console.log('rendering boolean expression', this.templateProps);
        const { formData } = this.templateProps;

        return (
            <limel-flex-container justify="start">
                <limel-flex-container class="node">
                    {/* <div class="operator-form" /> */}
                    <react-render
                        content={this.getProperty('operator').content}
                    />
                </limel-flex-container>

                {formData.operator && (
                    <limel-flex-container
                        direction="vertical"
                        align="start"
                        class="nested-nodes"
                    >
                        <div class="first-node">
                            <react-render
                                content={this.getProperty('left').content}
                            />
                        </div>
                        <div class="second-node">
                            <react-render
                                content={this.getProperty('right').content}
                            />
                        </div>
                    </limel-flex-container>
                )}
            </limel-flex-container>
        );
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
