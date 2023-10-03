import { Component, h } from '@stencil/core';
import { ValidationError } from '@limetech/lime-elements';
import { schema } from './list-schema';

/**
 * Form with server validation
 * @link list-schema.ts
 */
@Component({
    tag: 'limel-example-server-errors',
    shadow: true,
})
export class FormErrorExample {
    private formData: object = {
        villains: ['Joker', 'Doctor Strange', 'Green Goblin'],
        squad: [
            {
                powers: ['eating'],
                name: 'Thanos',
            },
        ],
    };

    private errors: ValidationError = {
        villains: {
            1: ['This is not a valid villain!'],
        },
        squad: {
            0: {
                name: ['This is not a valid hero!'],
            },
        },
    };

    public render() {
        return (
            <limel-form
                schema={schema}
                value={this.formData}
                errors={this.errors}
            />
        );
    }
}
