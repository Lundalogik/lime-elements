import { Component, h, State } from '@stencil/core';

const schema = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
            title: 'Name',
        },
        age: {
            type: 'integer',
            title: 'Age',
        },
        address: {
            type: 'object',
            title: 'Location',
            description: 'Please enter your location',
            properties: {
                city: {
                    type: 'string',
                    title: 'City',
                },
                country: {
                    type: 'string',
                    title: 'Country',
                    description: 'It might also be a planet',
                },
            },
        },
        data: {
            type: 'object',
            title: 'Data',
            description: 'Some additional data we would like you to submit',
            properties: {
                eyeColor: {
                    type: 'string',
                    title: 'Eye color',
                },
                shoeSize: {
                    type: 'integer',
                    title: 'Shoe size',
                },
            },
            lime: {
                collapsible: true,
            },
        },
    },
};

@Component({
    tag: 'limel-example-nested-form',
    shadow: true,
})
export class NestedFormExample {
    @State()
    private formData: object = {};

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
