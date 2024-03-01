import { Component, h, State } from '@stencil/core';
import { PropsFactoryFormData, schema } from './props-factory-schema';
import { FormSchema } from '@limetech/lime-elements';

/**
 * Using `propsFactory`
 *
 * @sourceFile props-factory-schema.ts
 * @sourceFile props-factory-picker.tsx
 */
@Component({
    tag: 'limel-example-props-factory-form',
    shadow: true,
})
export class PropsFactoryFormExample {
    @State()
    private formData: PropsFactoryFormData = {
        hero: 1001,
    };

    private anObjectToInject = {
        someProp: 'The object was successfully injected!',
    };
    private aStringToInject = 'The string was successfully injected!';

    public render() {
        return [
            <limel-form
                onChange={this.handleFormChange}
                value={this.formData}
                schema={schema}
                propsFactory={this.propsFactory}
            />,
            <limel-example-value value={this.formData} />,
        ];
    }

    private propsFactory = (subSchema: FormSchema) => {
        if (
            subSchema.lime?.component?.name ===
            'limel-example-props-factory-picker'
        ) {
            return {
                injectedObject: this.anObjectToInject,
                injectedString: this.aStringToInject,
            };
        }
    };

    private handleFormChange = (event: CustomEvent<object>) => {
        this.formData = event.detail;
    };
}
