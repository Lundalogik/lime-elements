import { LimelPickerCustomEvent, ListItem } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

/**
 * With icons
 */
@Component({
    tag: 'limel-example-picker-icons',
    shadow: true,
})
export class PickerIconsExample {
    @State()
    private selectedItems: Array<ListItem<number>> = [];

    private allItems: Array<ListItem<number>> = [
        {
            text: 'Admiral Swiggins',
            secondaryText:
                'Anchor Hook, Anchor Drop, Ink Spray, Ink Propulsion',
            value: 1,
            icon: {
                name: 'octopus',
                color: 'var(--lime-red)',
            },
        },
        {
            text: 'Ayla',
            secondaryText: 'Evil Eye, Rage, Chain Whack, Hop Skip',
            value: 2,
            icon: {
                name: 'visible',
                color: 'var(--lime-magenta)',
            },
        },
        {
            text: 'Clunk',
            secondaryText: 'Vacuum Bite, Explode, Missiles, Jet Boost',
            value: 3,
            icon: {
                name: 'robot_3',
                color: 'var(--lime-dark-blue)',
            },
        },
        {
            text: 'Coco',
            secondaryText: 'Ball Lightning, Blaze, Shock, Ollie',
            value: 4,
            icon: {
                name: 'surfing',
                color: 'var(--lime-blue)',
            },
        },
        {
            text: 'Derpl',
            secondaryText: 'Grid Trap, Siege Mode, Cat Shot, Booster Rocket',
            value: 5,
            icon: {
                name: 'cat',
                color: 'var(--lime-green)',
            },
        },
        {
            text: 'Froggy G',
            secondaryText:
                'Splash Dash, Tornado Move, Bolt .45 Fish-gun, Frog Jump',
            value: 6,
            icon: {
                name: 'frog',
                color: 'var(--lime-turquoise)',
            },
        },
        {
            text: 'Gnaw',
            secondaryText: 'Acid Spit, Grow Weedling, Bite, Skroggle Jump',
            value: 7,
            icon: {
                name: 'dog',
                color: 'var(--lime-orange)',
            },
        },
        {
            text: 'Lonestar',
            secondaryText:
                'Dynamite Throw, Summon Hyper Bull, Blaster, Double Jump',
            value: 8,
            icon: {
                name: 'sheriff',
                color: 'var(--lime-deep-red)',
            },
        },
        {
            text: 'Leon',
            secondaryText: 'Tounge Snatch, Cloaking Skin, Slash, Reptile Jump',
            value: 9,
            icon: {
                name: 'croissant',
                color: 'var(--lime-yellow)',
            },
        },
        {
            text: 'Raelynn',
            secondaryText:
                'Timerift, Snipe, Protoblaster, Six Million Solar Human Jump',
            value: 10,
            icon: {
                name: 'sniper_rifle',
                color: 'var(--lime-dark-grey)',
            },
        },
        {
            text: 'Skølldir',
            secondaryText: 'Mighty Throw, Earthquake, Bash, Explosive Fart',
            value: 11,
            icon: {
                name: 'beer',
                color: 'var(--lime-orange)',
            },
        },
        {
            text: 'Voltar',
            secondaryText:
                'Suicide Drones, Healbot, Techno Synaptic Wave, Hover',
            value: 12,
            icon: {
                name: 'brain',
                color: 'var(--lime-magenta)',
            },
        },
        {
            text: 'Yuri',
            secondaryText: 'Mine Deploying, Time Warp, Laser, Jet Pack',
            value: 13,
            icon: {
                name: 'year_of_monkey',
                color: 'var(--lime-light-grey)',
            },
        },
    ];

    public render() {
        return [
            <limel-picker
                label="Favorite awesomenaut"
                value={this.selectedItems}
                searchLabel={'Search your awesomenaut'}
                multiple={true}
                searcher={this.search}
                onChange={this.onChange}
                onInteract={this.onInteract}
            />,
            <limel-example-value value={this.selectedItems} />,
        ];
    }

    private search = (query: string): Promise<ListItem[]> => {
        return new Promise((resolve) => {
            if (query === '') {
                resolve([]);
            }

            const filteredItems = this.allItems.filter((item) => {
                const searchText =
                    item.text.toLowerCase() +
                    ' ' +
                    item.secondaryText.toLowerCase();

                return searchText.includes(query.toLowerCase());
            });
            resolve(filteredItems);
        });
    };

    private onChange = (
        event: LimelPickerCustomEvent<Array<ListItem<number>>>,
    ) => {
        this.selectedItems = [...event.detail];
    };

    private onInteract = (event: LimelPickerCustomEvent<ListItem<number>>) => {
        console.log('Value interacted with:', event.detail);
    };
}
