import { Component, State } from '@stencil/core';
import { ListItem } from '../../interface';

const NETWORK_DELAY = 500;

@Component({
    tag: 'limel-example-picker-icons',
    shadow: true,
})
export class PickerIconsExample {
    private allItems: ListItem[] = [
        {
            text: 'Admiral Swiggins',
            secondaryText:
                'Anchor Hook, Anchor Drop, Ink Spray, Ink Propulsion',
            id: 1,
            icon: 'octopus',
            iconColor: '#ff7043',
        },
        {
            text: 'Ayla',
            secondaryText: 'Evil Eye, Rage, Chain Whack, Hop Skip',
            id: 2,
            icon: 'visible',
            iconColor: '#ff3195',
        },
        {
            text: 'Clunk',
            secondaryText: 'Vacuum Bite, Explode, Missiles, Jet Boost',
            id: 3,
            icon: 'robot_3',
            iconColor: '#57879f',
        },
        {
            text: 'Coco',
            secondaryText: 'Ball Lightning, Blaze, Shock, Ollie',
            id: 4,
            icon: 'surfing',
            iconColor: '#29b6f6',
        },
        {
            text: 'Derpl',
            secondaryText: 'Grid Trap, Siege Mode, Cat Shot, Booster Rocket',
            id: 5,
            icon: 'cat',
            iconColor: '#66bb6a',
        },
        {
            text: 'Froggy G',
            secondaryText:
                'Splash Dash, Tornado Move, Bolt .45 Fish-gun, Frog Jump',
            id: 6,
            icon: 'frog',
            iconColor: '#26a69a',
        },
        {
            text: 'Gnaw',
            secondaryText: 'Acid Spit, Grow Weedling, Bite, Skroggle Jump',
            id: 7,
            icon: 'dog',
            iconColor: '#ffb03b',
        },
        {
            text: 'Lonestar',
            secondaryText:
                'Dynamite Throw, Summon Hyper Bull, Blaster, Double Jump',
            id: 8,
            icon: 'sheriff',
            iconColor: '#f05750',
        },
        {
            text: 'Leon',
            secondaryText: 'Tounge Snatch, Cloaking Skin, Slash, Reptile Jump',
            id: 9,
            icon: 'croissant',
            iconColor: '#ffcf3d',
        },
        {
            text: 'Raelynn',
            secondaryText:
                'Timerift, Snipe, Protoblaster, Six Million Solar Human Jump',
            id: 10,
            icon: 'sniper_rifle',
            iconColor: '#575756',
        },
        {
            text: 'Skølldir',
            secondaryText: 'Mighty Throw, Earthquake, Bash, Explosive Fart',
            id: 11,
            icon: 'beer',
            iconColor: '#ffb03b',
        },
        {
            text: 'Voltar',
            secondaryText:
                'Suicide Drones, Healbot, Techno Synaptic Wave, Hover',
            id: 12,
            icon: 'brain',
            iconColor: '#ff3195',
        },
        {
            text: 'Yuri',
            secondaryText: 'Mine Deploying, Time Warp, Laser, Jet Pack',
            id: 13,
            icon: 'year_of_monkey',
            iconColor: '#adadad',
        },
    ];

    @State()
    private selectedItems: ListItem[] = [];

    public render() {
        return [
            <limel-picker
                multiple={true}
                onChange={event => {
                    this.selectedItems = [...event.detail];
                }}
                label="Favorite awesomenaut"
                searcher={this.search.bind(this)}
                value={this.selectedItems}
            />,
            <br />,
            <br />,
            <div>
                Value: <code>{JSON.stringify(this.selectedItems)}</code>
            </div>,
            <hr />,
            <p>
                When importing ListItem or PickerSearchResult, see{' '}
                <a href="/usage#import-statements">Usage</a>
            </p>,
        ];
    }

    private search(query: string) {
        return new Promise(resolve => {
            if (query === '') {
                resolve([]);
            }
            // Simulate some network delay
            setTimeout(() => {
                const filteredItems = this.allItems.filter(item => {
                    const searchText =
                        item.text.toLowerCase() +
                        ' ' +
                        item.secondaryText.toLowerCase();

                    return searchText.includes(query.toLowerCase());
                });
                resolve(filteredItems);
            }, NETWORK_DELAY);
        });
    }
}
