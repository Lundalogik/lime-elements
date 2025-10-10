import { MenuItem, ListSeparator } from '@limetech/lime-elements';

/**
 * A cascading set of menu items used in multiple examples.
 */
export const CascadingMenuItems: MenuItem[] = [
    {
        text: 'Responsible',
        icon: {
            name: 'user',
            color: 'rgb(var(--color-orange-light))',
        },
        items: [
            {
                text: 'Name',
            },
            {
                text: 'Email',
            },
            {
                text: 'Phone',
            },
            {
                separator: true,
                text: 'Relations',
            },
            {
                text: 'Office',
                icon: {
                    name: 'exterior',
                    color: 'rgb(var(--color-green-light))',
                },
                items: [
                    {
                        text: 'Name',
                    },
                    {
                        text: 'Phone',
                    },
                    {
                        text: 'Fax',
                    },
                    {
                        text: 'Address',
                    },
                    {
                        text: 'City',
                    },
                    {
                        text: 'Homepage',
                    },
                    {
                        separator: true,
                        text: 'Relations',
                    },
                    {
                        text: 'Manager',
                        icon: {
                            name: 'manager',
                            color: 'rgb(var(--color-purple-darker))',
                        },
                        items: [
                            {
                                text: 'Name',
                            },
                            {
                                text: 'Email',
                            },
                            {
                                text: 'Phone',
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        text: 'Deal',
        icon: {
            name: 'money',
            color: 'rgb(var(--color-green-default))',
        },
        items: [
            {
                text: 'Name',
            },
            {
                text: 'Value',
            },
            {
                text: 'Weighted value',
            },
            {
                text: 'Department',
            },
            {
                text: 'Probability',
            },
            {
                text: 'Won/Lost reason',
            },
            {
                text: 'Quote sent',
            },
            {
                text: 'Expected order',
            },
        ],
    },
    {
        text: 'Document',
        icon: {
            name: 'document',
            color: 'rgb(var(--color-gray-default))',
        },
        items: [
            {
                text: 'Name',
            },
            {
                text: 'Type',
            },
        ],
    },
];

/**
 * Basic top-level filter items used in the searchable menu example.
 */
export const BasicFilterItems: Array<MenuItem | ListSeparator> = [
    {
        text: 'Company name',
        icon: {
            name: '-lime-filter',
            color: 'rgb(var(--contrast-800))',
        },
    },
    {
        text: 'Buying status',
        icon: {
            name: '-lime-filter',
            color: 'rgb(var(--contrast-800))',
        },
    },
    {
        text: 'Telephone',
        icon: {
            name: '-lime-filter',
            color: 'rgb(var(--contrast-800))',
        },
    },
    {
        text: 'Classification',
        icon: {
            name: '-lime-filter',
            color: 'rgb(var(--contrast-800))',
        },
    },
    {
        text: 'Responsible',
        icon: {
            name: '-lime-filter',
            color: 'rgb(var(--contrast-800))',
        },
    },
    {
        text: 'Classification',
        icon: {
            name: '-lime-filter',
            color: 'rgb(var(--contrast-800))',
        },
    },
    {
        text: 'City',
        icon: {
            name: '-lime-filter',
            color: 'rgb(var(--contrast-800))',
        },
    },
    {
        separator: true,
        text: 'Relations',
    },
];

/**
 * A long sub list used to demonstrate large sub-menu searching.
 */
export const LongSubList: MenuItem = {
    text: 'Long sub list',
    icon: 'ellipsis',
    items: Array.from({ length: 50 }, (_value, index) => ({
        text: `Item ${index + 1}`,
    })),
};

/**
 * Consolidated items for the searchable example.
 */
export const SearchableMenuItems: Array<MenuItem | ListSeparator> = [
    ...BasicFilterItems,
    ...CascadingMenuItems,
    LongSubList,
];
