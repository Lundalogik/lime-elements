import { Component, h, Prop } from '@stencil/core';
import {
    ObjectFieldTemplateProps,
    ObjectFieldProperty,
} from '../form/templates/types';

@Component({
    tag: 'limel-comparate-template',
    shadow: true,
    styleUrl: 'engage-filter-form.scss',
})
export class ComparateComponent {
    @Prop()
    public templateProps: ObjectFieldTemplateProps;

    render() {
        return (
            <limel-flex-container>
                <react-render content={this.getProperty('type').content} />
                <react-render content={this.getProperty('value').content} />
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
