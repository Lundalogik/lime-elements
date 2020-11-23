import { Component, h, State } from '@stencil/core';

@Component({
    tag: 'limel-example-button',
    shadow: true,
    styleUrl: 'button.scss',
})
export class ButtonExample {
    @State()
    private props = {
        label: 'My button',
        primary: true,
        outlined: false,
        icon: null,
        disabled: false,
        loading: false,
    };

    public render() {
        return [
            <limel-button {...this.props} />,
            <limel-flex-container justify="end">
                {this.renderControls()}
            </limel-flex-container>,
        ];
    }

    private renderControls() {
        const controls = [
            {
                property: 'label',
                label: 'Label',
                value: 'My button',
            },
            {
                property: 'primary',
                label: 'Primary',
                value: true,
            },
            {
                property: 'outlined',
                label: 'Outlined',
                value: true,
            },
            {
                property: 'icon',
                label: 'Icon',
                value: 'filled_message',
            },
            {
                property: 'disabled',
                label: 'Disabled',
                value: true,
            },
            {
                property: 'loading',
                label: 'Loading',
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
            ...{
                [control.property]: (event.detail && control.value) || null,
            },
        };
    };
}
