import { Component, h, State } from '@stencil/core';

/**
 * Composite
 *
 * A place to try different combinations of states.
 */
@Component({
    tag: 'limel-example-icon-button-composite',
    shadow: true,
    styleUrl: 'icon-button-composite.scss',
})
export class IconButtonCompositeExample {
    @State()
    private isFavorite = false;

    @State()
    private props = {
        disabled: false,
        elevated: false,
    };

    public render() {
        return [
            <limel-icon-button
                label={this.isFavorite ? 'Remove Favorite' : 'Add Favorite'}
                icon={this.isFavorite ? 'heart_filled' : 'heart_outlined'}
                onClick={this.toggleFavorite}
                {...this.props}
            />,
            <limel-example-controls>
                {this.renderControls()}
            </limel-example-controls>,
        ];
    }

    private renderControls() {
        const controls = [
            {
                property: 'disabled',
                label: 'Disabled',
                value: true,
            },
            {
                property: 'elevated',
                label: 'Elevated',
                value: true,
            },
        ];

        return controls.map((control) => {
            return (
                <limel-switch
                    label={control.label}
                    value={!!this.props[control.property]}
                    onChange={this.handleChange(control)}
                />
            );
        });
    }

    private handleChange = (control) => (event: CustomEvent) => {
        this.props = {
            ...this.props,
            [control.property]: (event.detail && control.value) || null,
        };
    };

    private toggleFavorite = () => {
        this.isFavorite = !this.isFavorite;
    };
}
