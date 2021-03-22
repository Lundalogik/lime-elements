import { Component, h, State } from '@stencil/core';

/**
 * Toggle State
 *
 * This isn't really a feature of `limel-icon-button`, but since it is a common
 * use case, here is a simple way to make the icon button toggle between two
 * different "states", each with its own icon and label.
 */
@Component({
    tag: 'limel-example-icon-button-toggle-state',
    shadow: true,
})
export class IconButtonToggleStateExample {
    @State()
    private isFavorite = false;

    constructor() {
        this.toggleFavorite = this.toggleFavorite.bind(this);
    }

    public render() {
        return (
            <limel-icon-button
                label={this.isFavorite ? 'Remove Favorite' : 'Add Favorite'}
                icon={this.isFavorite ? 'heart_filled' : 'heart_outlined'}
                onClick={this.toggleFavorite}
            />
        );
    }

    private toggleFavorite() {
        this.isFavorite = !this.isFavorite;
    }
}
