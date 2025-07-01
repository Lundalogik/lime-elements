import { ListSeparator } from '../../list/list-item.types';
import { MenuItem } from '../menu.types';

const NETWORK_DELAY = 1000;

/**
 * This is a fake server that simulates a network delay.
 * It should NOT be copied and used in your package or solution.
 */
export const fakeServer = {
    loadItems: (item: MenuItem): Promise<Array<MenuItem | ListSeparator>> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                switch (item.value) {
                    case 'format_menu': {
                        resolve(formatItems);
                        break;
                    }
                    case 'edit_menu': {
                        resolve(editItems);
                        break;
                    }
                    case 'bullets_menu': {
                        resolve(bulletsAndNumberingItems);
                        break;
                    }
                    default: {
                        resolve([]);
                        break;
                    }
                }
            }, NETWORK_DELAY);
        });
    },
};

const formatItems: MenuItem[] = [
    {
        text: 'Bold',
        icon: 'bold',
        value: 'bold',
    },
    {
        text: 'Italic',
        icon: 'italic',
        value: 'italic',
    },
    {
        text: 'Bullets and numbering',
        icon: 'bulleted_list',
        items: null,
        value: 'bullets_menu',
    },
];

const bulletsAndNumberingItems: MenuItem[] = [
    {
        text: 'Numbered list',
        icon: 'numbered_list',
        value: 'numbered_list',
    },
    {
        text: 'Bullet list',
        icon: 'bulleted_list',
        value: 'bullet_list',
    },
    {
        text: 'Checklist',
        icon: 'todo_list',
        value: 'checklist',
    },
    {
        text: 'Pets',
        icon: 'octopus',
        items: [
            {
                text: 'Cat',
                icon: 'cat',
                value: 'cat',
            },
            {
                text: 'Dog',
                icon: 'dog',
                value: 'dog',
            },
        ],
        value: 'pet_menu',
    },
];

const editItems: Array<MenuItem | ListSeparator> = [
    {
        text: 'Copy',
        icon: 'copy',
        value: 'copy',
    },
    {
        text: 'Cut',
        icon: 'cut',
        value: 'cut',
    },
    { separator: true },
    {
        text: 'Paste',
        icon: 'paste',
        value: 'paste',
    },
];
