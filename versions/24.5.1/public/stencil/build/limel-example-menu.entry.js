import { r as registerInstance, h } from './core-804afdbc.js';

const icons = ['copy', 'cut', 'paste', '', 'add', 'delete'];
const iconColors = [
    'var(--lime-green)',
    'var(--lime-red)',
    'var(--lime-orange)',
    '',
    'var(--lime-dark-blue)',
    'var(--lime-magenta)',
];
const MenuExample = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.items = [
            { text: 'Copy' },
            { text: 'Cut' },
            { text: 'Paste', disabled: true },
            { separator: true },
            { text: 'Add that new thing' },
            { text: 'Delete that old thing' },
        ];
        this.menuOpen = false;
        this.onCancel = () => {
            this.menuOpen = false;
        };
        this.onTrigger = () => {
            this.menuOpen = !this.menuOpen;
        };
        this.onSelect = event => {
            console.log('item selected', event.detail);
            this.items = this.items.map(item => {
                if (!('separator' in item)) {
                    item.disabled = item.text === event.detail.text;
                }
                return item;
            });
        };
    }
    render() {
        return [
            h("section", null, h("h3", null, "With default trigger"), h("p", null, h("limel-menu", { label: "Menu", items: this.items, onSelect: this.onSelect }))),
            h("section", null, h("h3", null, "Disabled with default trigger"), h("p", null, h("limel-menu", { disabled: true, label: "Menu", items: this.items, onSelect: this.onSelect }))),
            h("section", null, h("h3", null, "With custom trigger"), h("p", null, h("limel-menu", { items: this.items, onCancel: this.onCancel, onSelect: this.onSelect, open: this.menuOpen }, h("div", { slot: "trigger" }, h("limel-button", { label: "Menu", primary: true, onClick: this.onTrigger }))))),
            h("section", null, h("h3", null, "With icons"), h("p", null, h("limel-menu", { label: "Menu", items: this.items.map((item, index) => {
                    return Object.assign(Object.assign({}, item), { icon: icons[index] });
                }), onSelect: this.onSelect }))),
            h("section", null, h("h3", null, "With badge icons"), h("p", null, h("limel-menu", { label: "Menu", items: this.items.map((item, index) => {
                    return Object.assign(Object.assign({}, item), { icon: icons[index], iconColor: iconColors[index] });
                }), onSelect: this.onSelect, badgeIcons: true }))),
        ];
    }
};

export { MenuExample as limel_example_menu };
