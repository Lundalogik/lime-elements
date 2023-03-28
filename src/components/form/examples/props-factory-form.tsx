import { Component, h, State } from '@stencil/core';
import { PropsFactoryFormData, schema } from './props-factory-schema';
import { FormSchema } from '@limetech/lime-elements';

/**
 * Not using `propsFactory`
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
            >
                <limel-example-props-factory-picker
                    slot="hero"
                    injectedObject={this.anObjectToInject}
                    injectedString={this.aStringToInject}
                />
            </limel-form>,
            <limel-example-value value={this.formData} />,
        ];
    }

    private handleFormChange = (event: CustomEvent<object>) => {
        this.formData = event.detail;
    };
}
