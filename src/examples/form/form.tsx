import { Component, h, State } from '@stencil/core';

const schema = {
    title: 'My form',
    description: 'This is a description text for the form.',
    type: 'object',
    required: ['title'],
    properties: {
        title: {
            type: 'string',
            title: 'Title',
            default: 'A new task',
            description: 'Enter a title',
        },
        done: {
            type: 'boolean',
            title: 'Done?',
            default: false,
            required: true,
        },
        color: {
            type: 'string',
            title: 'Color',
            enum: ['red', 'green', 'blue'],
        },
        colorMask: {
            type: 'array',
            title: 'Color mask',
            description: 'Pick a color',
            uniqueItems: true,
            items: {
                title: 'Color',
                type: 'string',
                anyOf: [
                    {
                        type: 'string',
                        enum: ['#ff0000'],
                        title: 'Red',
                    },
                    {
                        type: 'string',
                        enum: ['#00ff00'],
                        title: 'Green',
                    },
                    {
                        type: 'string',
                        enum: ['#0000ff'],
                        title: 'Blue',
                    },
                ],
            },
        },
        date: {
            type: 'string',
            title: 'Date',
            format: 'date',
            description: 'Select a nice date',
        },
    },
};

@Component({
    tag: 'limel-example-form',
    shadow: true,
})
export class FormExample {
    @State()
    private formData: object = {
        title: 'Test',
        date: '2020-01-20',
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
