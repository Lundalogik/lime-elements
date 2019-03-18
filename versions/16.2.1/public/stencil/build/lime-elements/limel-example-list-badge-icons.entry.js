const h = window.LimeElements.h;

class BadgeIconsListExample {
    constructor() {
        this.items = [
            {
                text: 'King of Tokyo',
                secondaryText: '2-6 players',
                id: 1,
                icon: 'gorilla',
            },
            {
                text: 'Smash Up!',
                secondaryText: '2-4 players',
                id: 2,
                icon: 'alien',
                iconColor: 'var(--lime-green)',
            },
            {
                text: 'Pandemic',
                secondaryText: '2-4 players',
                id: 3,
                icon: 'virus',
                iconColor: 'var(--lime-red)',
            },
            {
                text: 'Catan',
                secondaryText: '3-4 players',
                id: 4,
                icon: 'wheat',
                iconColor: 'var(--lime-orange)',
            },
            {
                text: 'Ticket to Ride',
                secondaryText: '2-5 players',
                id: 5,
                icon: 'steam_engine',
                iconColor: 'var(--lime-dark-blue)',
            },
        ];
    }
    render() {
        return h("limel-list", { items: this.items, badgeIcons: true });
    }
    static get is() { return "limel-example-list-badge-icons"; }
    static get encapsulation() { return "shadow"; }
    static get style() { return "limel-list {\n  --icon-background-color: var(--lime-magenta); }"; }
}

export { BadgeIconsListExample as LimelExampleListBadgeIcons };
