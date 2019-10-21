import { r as registerInstance, h } from './core-804afdbc.js';

const IconButtonExample = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.isFavorite = false;
        this.disabled = false;
        this.toggleFavorite = this.toggleFavorite.bind(this);
        this.toggleEnabled = this.toggleEnabled.bind(this);
    }
    render() {
        return [
            h("limel-icon-button", { label: this.isFavorite ? 'Remove Favorite' : 'Add Favorite', icon: this.isFavorite ? 'heart_filled' : 'heart_outlined', disabled: this.disabled, onClick: this.toggleFavorite }),
            h("limel-flex-container", { justify: "end" }, h("limel-button", { onClick: this.toggleEnabled, label: this.disabled ? 'Enable' : 'Disable' })),
        ];
    }
    toggleFavorite() {
        this.isFavorite = !this.isFavorite;
    }
    toggleEnabled() {
        this.disabled = !this.disabled;
    }
};

export { IconButtonExample as limel_example_icon_button_toggle_state };
