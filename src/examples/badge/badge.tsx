import { Component } from '@stencil/core';

@Component({
    tag: 'limel-example-badge',
    shadow: true,
})
export class BadgeExample {
    public render() {
        return [
            <limel-badge
                size="x-small"
                icon="Sports/teams"
                style={{
                    '--background-color': 'rgb(255, 176, 59)',
                }}
            />,
            <br />,
            <limel-badge
                size="small"
                icon="Objects/money"
                style={{
                    '--background-color': 'rgb(102, 187, 106)',
                }}
            />,
            <br />,
            <limel-badge
                size="medium"
                icon="business/organization"
                style={{
                    '--background-color': 'rgb(41, 182, 246)',
                }}
            />,
            <br />,
            <limel-badge
                size="large"
                icon="business/decision"
                style={{
                    '--background-color': '#ff7043',
                }}
            />,
        ];
    }
}
