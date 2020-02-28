import { ValidationStatus } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

const schema = {
    title: 'Registration form',
    description: 'Please enter your personal information',
    type: 'object',
    required: ['name', 'email', 'newsletters'],
    properties: {
        name: {
            type: 'string',
            title: 'Name',
            default: 'Batman',
            description: 'Enter your heroic name',
            minLength: 5,
            maxLength: 20,
        },
        email: {
            type: 'string',
            title: 'Email',
            description: 'Enter your email address',
            format: 'email',
        },
        date: {
            type: 'string',
            title: 'Birthdate',
            format: 'date',
            description: 'Pick a nice date!',
        },
        color: {
            type: 'string',
            title: 'Favorite cape color',
            description: 'Preferably matching your boots',
            oneOf: [
                {
                    type: 'string',
                    const: 'red',
                    title: 'Red',
                },
                {
                    type: 'string',
                    const: 'yellow',
                    title: 'Yellow',
                },
                {
                    type: 'string',
                    const: 'green',
                    title: 'Green',
                },
                {
                    type: 'string',
                    const: 'blue',
                    title: 'Blue',
                },
                {
                    type: 'string',
                    const: 'black',
                    title: 'Black',
                },
            ],
        },
        sidekicks: {
            type: 'array',
            title: 'Sidekicks',
            description: 'Please select your sidekicks',
            uniqueItems: true,
            minItems: 2,
            items: {
                title: 'Friends',
                type: 'string',
                anyOf: [
                    {
                        type: 'string',
                        const: 'super',
                        title: 'Superman',
                    },
                    {
                        type: 'string',
                        const: 'widow',
                        title: 'Black Widow',
                    },
                    {
                        type: 'string',
                        const: 'america',
                        title: 'Captain America',
                    },
                    {
                        type: 'string',
                        const: 'squirrel',
                        title: 'Squirrel Girl',
                    },
                    {
                        type: 'string',
                        const: 'devil',
                        title: 'Daredevil',
                    },
                    {
                        type: 'string',
                        const: 'marvel',
                        title: 'Captain Marvel',
                    },
                    {
                        type: 'string',
                        const: 'fantastic',
                        title: 'Mr. Fantastic',
                    },
                ],
            },
        },
        newsletters: {
            type: 'boolean',
            title: 'I want to receive daily newsletters!',
            default: false,
            const: true,
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
        date: '1922-12-28',
    };

    @State()
    private valid = true;

    constructor() {
        this.handleFormChange = this.handleFormChange.bind(this);
        this.handleFormValidate = this.handleFormValidate.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    public render() {
        return [
            <limel-form
                onChange={this.handleFormChange}
                onValidate={this.handleFormValidate}
                value={this.formData}
                schema={schema}
            />,
            <br />,
            <limel-button
                label="Submit"
                primary={true}
                disabled={!this.valid}
                onClick={this.handleSubmit}
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

    private handleFormValidate(event: CustomEvent<ValidationStatus>) {
        this.valid = event.detail.valid;
        console.log(event.detail);
    }

    private handleSubmit() {
        const json = JSON.stringify(this.formData, null, '    ');
        alert(`Sending information to villains...\n\n${json}`);
    }
}
