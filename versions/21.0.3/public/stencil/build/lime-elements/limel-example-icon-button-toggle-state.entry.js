const h = window.LimeElements.h;

class IconButtonExample {
    constructor() {
        this.isFavorite = false;
        this.disabled = false;
        this.toggleFavorite = this.toggleFavorite.bind(this);
        this.toggleEnabled = this.toggleEnabled.bind(this);
    }
    render() {
        return [
            h("limel-icon-button", { label: this.isFavorite ? 'Remove Favorite' : 'Add Favorite', icon: this.isFavorite ? 'heart_filled' : 'heart_outlined', disabled: this.disabled, onClick: this.toggleFavorite }),
            h("limel-flex-container", { justify: "end" },
                h("limel-button", { onClick: this.toggleEnabled, label: this.disabled ? 'Enable' : 'Disable' })),
        ];
    }
    toggleFavorite() {
        this.isFavorite = !this.isFavorite;
    }
    toggleEnabled() {
        this.disabled = !this.disabled;
    }
    static get is() { return "limel-example-icon-button-toggle-state"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "disabled": {
            "state": true
        },
        "isFavorite": {
            "state": true
        }
    }; }
}

export { IconButtonExample as LimelExampleIconButtonToggleState };
