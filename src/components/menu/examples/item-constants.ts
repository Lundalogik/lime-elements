import { MenuItem } from '@limetech/lime-elements';

export const CascadingMenuItems: MenuItem[] = [
    {
        text: 'Format',
        items: [
            {
                text: 'Bold',
                icon: 'bold',
            },
            {
                text: 'Italic',
                icon: 'italic',
            },
            {
                text: 'Bullets and numbering',
                icon: 'bulleted_list',
                items: [
                    {
                        text: 'Numbered list',
                        icon: 'numbered_list',
                    },
                    {
                        text: 'Bullet list',
                        icon: 'bulleted_list',
                    },
                    {
                        text: 'Checklist',
                        icon: 'todo_list',
                    },
                ],
            },
        ],
    },
    {
        text: 'Edit',
        items: [
            {
                text: 'Copy',
                icon: 'copy',
            },
            {
                text: 'Cut',
                icon: 'cut',
            },
            { separator: true },
            {
                text: 'Paste',
                icon: 'paste',
            },
        ],
    },
];
