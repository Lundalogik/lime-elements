import { Component, h, State } from '@stencil/core';

@Component({
    tag: 'limel-example-icon-button-toggle-state',
    shadow: true,
})
export class IconButtonExample {
    @State()
    private isFavorite = false;

    @State()
    private disabled = false;

    constructor() {
        this.toggleFavorite = this.toggleFavorite.bind(this);
        this.toggleEnabled = this.toggleEnabled.bind(this);
    }

    public render() {
        return [
            <limel-icon-button
                label={this.isFavorite ? 'Remove Favorite' : 'Add Favorite'}
                icon={this.isFavorite ? 'heart_filled' : 'heart_outlined'}
                disabled={this.disabled}
                onClick={this.toggleFavorite}
            />,
            <limel-flex-container justify="end">
                <limel-button
                    onClick={this.toggleEnabled}
                    label={this.disabled ? 'Enable' : 'Disable'}
                />
            </limel-flex-container>,
        ];
    }

    private toggleFavorite() {
        this.isFavorite = !this.isFavorite;
    }

    private toggleEnabled() {
        this.disabled = !this.disabled;
    }
}
