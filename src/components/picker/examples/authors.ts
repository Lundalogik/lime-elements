import { ListItem } from '../../list/list-item.types';

export const AUTHORS: Array<ListItem<{ id: string; limetype: string }>> = [
    {
        text: 'Erich Maria Remarque',
        secondaryText:
            'A time to love and a time to die, Spark of Life, The black obelisk, The shadows in paradise',
        value: {
            id: '1',
            limetype: 'German novelist',
        },
        icon: {
            name: 'bookmark',
            color: 'var(--lime-red)',
        },
    },
    {
        text: 'Ernest Hemingway',
        secondaryText: 'For whom the bell tolls, The sun also rises',
        value: {
            id: '2',
            limetype: 'American novelist',
        },
        icon: {
            name: 'books',
            color: 'var(--lime-magenta)',
        },
    },
    {
        text: 'Mark Twain',
        secondaryText:
            'The adventures of Tom Sawyer, The adventures of Huckleberry Finn',
        value: {
            id: '3',
            limetype: 'American writer',
        },
        icon: {
            name: 'book_shelf',
            color: 'var(--lime-blue)',
        },
    },
    {
        text: 'Gabriel García Márquez',
        secondaryText:
            'One Hundred Years of Solitude, Love in the Time of Cholera, Chronicle of a Death Foretold',
        value: {
            id: '4',
            limetype: 'Colombian novelist',
        },
        icon: {
            name: 'generic_book_file_type',
            color: 'var(--lime-orange)',
        },
    },
];
