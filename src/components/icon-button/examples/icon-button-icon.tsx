import { Component, h, State } from '@stencil/core';

/**
 * Styling
 * Using the `Icon` interface, you can easily customize the
 * appearance of icons within the button, tweaking its `color`,
 * `backgroundColor`, or adding an accessible `title` to it.
 */
@Component({
    tag: 'limel-example-icon-button-icon',
    shadow: true,
})
export class IconButtonIconExample {
    @State()
    private isFavorite = false;

    public render() {
        return (
            <limel-icon-button
                elevated={true}
                label={this.getLabel()}
                icon={this.getIcon()}
                onClick={this.toggleFavorite}
            />
        );
    }

    private getLabel() {
        return this.isFavorite ? 'Remove Favorite' : 'Add Favorite';
    }

    private getIcon() {
        const defaultIcon = 'heart_outlined';
        const toggledIcon = {
            name: 'heart_filled',
            color: 'rgb(var(--color-red-default))',
        };
        return this.isFavorite ? toggledIcon : defaultIcon;
    }

    private toggleFavorite = () => {
        this.isFavorite = !this.isFavorite;
    };
}
