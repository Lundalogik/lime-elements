import { FormSchema } from '@limetech/lime-elements';

export interface MissionPlan {
    name?: string;
    objective?: string;
    active?: boolean;
}

export interface ArrayItemControlsFormData {
    tasks?: string[];
    missions?: MissionPlan[];
}

export const baseSchema: FormSchema<ArrayItemControlsFormData> = {
    type: 'object',
    properties: {
        tasks: {
            type: 'array',
            title: 'Weekly tasks',
            items: {
                type: 'string',
                title: 'Task',
            },
            lime: {},
        },
        missions: {
            type: 'array',
            title: 'Mission plans',
            description: 'Object items render inside collapsible sections.',
            items: {
                type: 'object',
                title: 'Mission',
                properties: {
                    name: {
                        type: 'string',
                        title: 'Name',
                    },
                    objective: {
                        type: 'string',
                        title: 'Objective',
                    },
                    active: {
                        type: 'boolean',
                        title: 'Active',
                        default: true,
                    },
                },
            },
            lime: {},
        },
    },
};
