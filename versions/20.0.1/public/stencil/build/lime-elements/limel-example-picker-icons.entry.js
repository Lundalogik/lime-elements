const h = window.LimeElements.h;

const NETWORK_DELAY = 500;
class PickerIconsExample {
    constructor() {
        this.allItems = [
            {
                text: 'Admiral Swiggins',
                secondaryText: 'Anchor Hook, Anchor Drop, Ink Spray, Ink Propulsion',
                value: 1,
                icon: 'octopus',
                iconColor: 'var(--lime-red)',
            },
            {
                text: 'Ayla',
                secondaryText: 'Evil Eye, Rage, Chain Whack, Hop Skip',
                value: 2,
                icon: 'visible',
                iconColor: 'var(--lime-magenta)',
            },
            {
                text: 'Clunk',
                secondaryText: 'Vacuum Bite, Explode, Missiles, Jet Boost',
                value: 3,
                icon: 'robot_3',
                iconColor: 'var(--lime-dark-blue)',
            },
            {
                text: 'Coco',
                secondaryText: 'Ball Lightning, Blaze, Shock, Ollie',
                value: 4,
                icon: 'surfing',
                iconColor: 'var(--lime-blue)',
            },
            {
                text: 'Derpl',
                secondaryText: 'Grid Trap, Siege Mode, Cat Shot, Booster Rocket',
                value: 5,
                icon: 'cat',
                iconColor: 'var(--lime-green)',
            },
            {
                text: 'Froggy G',
                secondaryText: 'Splash Dash, Tornado Move, Bolt .45 Fish-gun, Frog Jump',
                value: 6,
                icon: 'frog',
                iconColor: 'var(--lime-turquoise)',
            },
            {
                text: 'Gnaw',
                secondaryText: 'Acid Spit, Grow Weedling, Bite, Skroggle Jump',
                value: 7,
                icon: 'dog',
                iconColor: 'var(--lime-orange)',
            },
            {
                text: 'Lonestar',
                secondaryText: 'Dynamite Throw, Summon Hyper Bull, Blaster, Double Jump',
                value: 8,
                icon: 'sheriff',
                iconColor: 'var(--lime-deep-red)',
            },
            {
                text: 'Leon',
                secondaryText: 'Tounge Snatch, Cloaking Skin, Slash, Reptile Jump',
                value: 9,
                icon: 'croissant',
                iconColor: 'var(--lime-yellow)',
            },
            {
                text: 'Raelynn',
                secondaryText: 'Timerift, Snipe, Protoblaster, Six Million Solar Human Jump',
                value: 10,
                icon: 'sniper_rifle',
                iconColor: 'var(--lime-dark-grey)',
            },
            {
                text: 'Skølldir',
                secondaryText: 'Mighty Throw, Earthquake, Bash, Explosive Fart',
                value: 11,
                icon: 'beer',
                iconColor: 'var(--lime-orange)',
            },
            {
                text: 'Voltar',
                secondaryText: 'Suicide Drones, Healbot, Techno Synaptic Wave, Hover',
                value: 12,
                icon: 'brain',
                iconColor: 'var(--lime-magenta)',
            },
            {
                text: 'Yuri',
                secondaryText: 'Mine Deploying, Time Warp, Laser, Jet Pack',
                value: 13,
                icon: 'year_of_monkey',
                iconColor: 'var(--lime-light-grey)',
            },
        ];
        this.selectedItems = [];
        this.search = this.search.bind(this);
        this.onChange = this.onChange.bind(this);
    }
    render() {
        return [
            h("limel-picker", { label: "Favorite awesomenaut", value: this.selectedItems, multiple: true, searcher: this.search, onChange: this.onChange, onInteract: this.onInteract }),
            h("p", null,
                "Value: ",
                h("code", null, JSON.stringify(this.selectedItems))),
        ];
    }
    search(query) {
        return new Promise(resolve => {
            if (query === '') {
                resolve([]);
            }
            // Simulate some network delay
            setTimeout(() => {
                const filteredItems = this.allItems.filter(item => {
                    const searchText = item.text.toLowerCase() +
                        ' ' +
                        item.secondaryText.toLowerCase();
                    return searchText.includes(query.toLowerCase());
                });
                resolve(filteredItems);
            }, NETWORK_DELAY);
        });
    }
    onChange(event) {
        this.selectedItems = [...event.detail];
    }
    onInteract(event) {
        console.log('Value interacted with:', event.detail);
    }
    static get is() { return "limel-example-picker-icons"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "selectedItems": {
            "state": true
        }
    }; }
    static get style() { return "p {\n  font-size: small; }"; }
}

export { PickerIconsExample as LimelExamplePickerIcons };
