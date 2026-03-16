import { Component, h, Host, State } from '@stencil/core';
import {
    ArrayItemControlsFormData,
    baseSchema,
} from './array-item-controls-schema';
import { FormSchema } from '@limetech/lime-elements';

/**
 * Allowing users to reorder and remove form items
 * By default, users are allowed to manipulate the array of items in by reordering them,
 * or removing them.
 *
 * However, using `allowItemReorder` and `allowItemRemoval`
 * props, you can control whether these actions are allowed.
 *
 * @sourceFile array-item-controls-schema.ts
 */
@Component({
    tag: 'limel-example-form-array-item-controls',
    shadow: true,
})
export class FormArrayItemControlsExample {
    @State()
    private formData: ArrayItemControlsFormData = {
        tasks: ['Collect intel', 'Recruit allies', 'Refuel jet'],
        missions: [
            {
                name: 'Secure HQ',
                objective: 'Fortify base defenses',
                active: true,
            },
            {
                name: 'Scout sector 9',
                objective: 'Gather intelligence on rivals',
                active: false,
            },
        ],
    };

    @State()
    private allowItemReorder = true;

    @State()
    private allowItemRemoval = true;

    @State()
    private schema = this.createSchema();

    public render() {
        return (
            <Host>
                <limel-example-controls
                    style={{ '--example-controls-column-layout': 'auto-fit' }}
                >
                    <limel-checkbox
                        label="allowItemReorder"
                        checked={this.allowItemReorder}
                        onChange={this.toggleAllowReorder}
                    />
                    <limel-checkbox
                        label="allowItemRemoval"
                        checked={this.allowItemRemoval}
                        onChange={this.toggleAllowRemoval}
                    />
                </limel-example-controls>
                <limel-form
                    onChange={this.handleFormChange}
                    value={this.formData}
                    schema={this.schema}
                />
                <limel-example-value value={this.formData} />
            </Host>
        );
    }

    private handleFormChange = (event) => {
        this.formData = event.detail;
    };

    private toggleAllowReorder = () => {
        this.allowItemReorder = !this.allowItemReorder;
        this.schema = this.createSchema();
    };

    private toggleAllowRemoval = () => {
        this.allowItemRemoval = !this.allowItemRemoval;
        this.schema = this.createSchema();
    };

    private createSchema(): FormSchema<ArrayItemControlsFormData> {
        const properties = baseSchema.properties ?? {};
        const tasks = properties.tasks!;
        const missions = properties.missions!;
        const taskOptions = tasks.lime ?? {};
        const missionOptions = missions.lime ?? {};

        return {
            ...baseSchema,
            properties: {
                ...properties,
                tasks: {
                    ...tasks,
                    lime: {
                        ...taskOptions,
                        allowItemReorder: this.allowItemReorder,
                        allowItemRemoval: this.allowItemRemoval,
                    },
                },
                missions: {
                    ...missions,
                    lime: {
                        ...missionOptions,
                        allowItemReorder: this.allowItemReorder,
                        allowItemRemoval: this.allowItemRemoval,
                    },
                },
            },
        };
    }
}
