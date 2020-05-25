import { Component, h, State } from '@stencil/core';

const schema = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
            title: 'Name',
            description: 'Name of the superhero deal',
        },
        value: {
            type: 'integer',
            title: 'Value',
            description: 'Amount to pay to hero',
        },
        hero: {
            type: 'integer',
            title: 'Hero',
            lime: {
                component: {
                    name: 'limel-example-custom-picker',
                },
            },
        },
    },
};

@Component({
    tag: 'limel-example-custom-component-form',
    shadow: true,
})
export class CustomComponentFormExample {
    @State()
    private formData: object = {
        name: 'My superhero deal',
        value: 1000000,
        hero: 1001,
    };

    constructor() {
        this.handleFormChange = this.handleFormChange.bind(this);
    }

    public render() {
        return [
            <limel-form
                onChange={this.handleFormChange}
                value={this.formData}
                schema={schema}
            />,
            <br />,
            <br />,
            'Value: ',
            <pre>{JSON.stringify(this.formData, null, '    ')}</pre>,
        ];
    }

    private handleFormChange(event) {
        this.formData = event.detail;
    }
}
