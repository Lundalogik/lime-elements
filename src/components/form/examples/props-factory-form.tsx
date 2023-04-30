import { Component, h, State } from '@stencil/core';
import { schema } from './props-factory-schema';

/**
 * Not using `propsFactory`
 *
 * @link props-factory-schema.ts
 * @link props-factory-picker.tsx
 */
@Component({
    tag: 'limel-example-props-factory-form',
    shadow: true,
})
export class PropsFactoryFormExample {
    @State()
    private formData: object = {
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
