import { Component, h, State } from '@stencil/core';
import { schema } from './list-schema';

/**
 * List data
 *
 * @sourceFile list-schema.ts
 */
@Component({
    tag: 'limel-example-list-form',
    shadow: true,
})
export class ListFormExample {
    @State()
    private formData: object = {
        villains: ['Joker', 'Thanos', 'Green Goblin'],
        squad: [
            {
                powers: ['flight'],
                name: 'Doctor Strange',
            },
        ],
    };

    public render() {
        return [
            <limel-form
                onChange={this.handleFormChange}
                value={this.formData}
                schema={schema}
            />,
            <limel-example-value value={this.formData} />,
        ];
    }

    private handleFormChange = (event) => {
        this.formData = event.detail;
    };
}
