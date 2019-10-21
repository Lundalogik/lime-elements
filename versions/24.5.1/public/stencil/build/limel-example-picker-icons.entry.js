import { r as registerInstance, h } from './core-804afdbc.js';

const NETWORK_DELAY = 500;
const PickerIconsExample = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
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
        this.required = false;
        this.readonly = false;
        this.disabled = false;
        this.search = this.search.bind(this);
        this.onChange = this.onChange.bind(this);
        this.setDisabled = this.setDisabled.bind(this);
        this.setReadonly = this.setReadonly.bind(this);
        this.setRequired = this.setRequired.bind(this);
    }
    render() {
        return [
            h("limel-picker", { label: "Favorite awesomenaut", value: this.selectedItems, searchLabel: 'Search your awesomenaut', multiple: true, displayFullList: true, searcher: this.search, onChange: this.onChange, onInteract: this.onInteract, required: this.required, readonly: this.readonly, disabled: this.disabled }),
            h("p", null, h("limel-flex-container", { justify: "end" }, h("limel-checkbox", { label: "Disabled", onChange: this.setDisabled, checked: this.disabled }), h("limel-checkbox", { label: "Readonly", onChange: this.setReadonly, checked: this.readonly }), h("limel-checkbox", { label: "Required", onChange: this.setRequired, checked: this.required }))),
            h("p", null, "Value: ", h("code", null, JSON.stringify(this.selectedItems))),
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
    setDisabled(event) {
        this.disabled = event.detail;
    }
    setReadonly(event) {
        this.readonly = event.detail;
    }
    setRequired(event) {
        this.required = event.detail;
    }
    static get style() { return "p {\n  font-size: small;\n}"; }
};

export { PickerIconsExample as limel_example_picker_icons };
