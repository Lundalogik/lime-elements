import { r as registerInstance, h } from './core-804afdbc.js';

const BadgeIconsListExample = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.items = [
            {
                text: 'King of Tokyo',
                secondaryText: '2-6 players',
                value: 1,
                icon: 'gorilla',
            },
            {
                text: 'Smash Up!',
                secondaryText: '2-4 players',
                value: 2,
                icon: 'alien',
                iconColor: 'var(--lime-green)',
            },
            {
                text: 'Pandemic',
                secondaryText: '2-4 players',
                value: 3,
                icon: 'virus',
                iconColor: 'var(--lime-red)',
            },
            {
                text: 'Catan',
                secondaryText: '3-4 players',
                value: 4,
                icon: 'wheat',
                iconColor: 'var(--lime-orange)',
            },
            {
                text: 'Ticket to Ride',
                secondaryText: '2-5 players',
                value: 5,
                icon: 'steam_engine',
                iconColor: 'var(--lime-dark-blue)',
            },
        ];
    }
    render() {
        return h("limel-list", { items: this.items, badgeIcons: true });
    }
    static get style() { return "limel-list {\n  --icon-background-color: var(--lime-magenta);\n}"; }
};

export { BadgeIconsListExample as limel_example_list_badge_icons };
