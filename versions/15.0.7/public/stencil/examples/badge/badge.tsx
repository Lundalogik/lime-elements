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
                icon="teams"
                style={{
                    '--background-color': 'var(--lime-orange)',
                }}
            />,
            <br />,
            <limel-badge
                size="small"
                icon="money"
                style={{
                    '--background-color': 'var(--lime-green)',
                }}
            />,
            <br />,
            <limel-badge
                size="medium"
                icon="organization"
                style={{
                    '--background-color': 'var(--lime-blue)',
                }}
            />,
            <br />,
            <limel-badge
                size="large"
                icon="decision"
                style={{
                    '--background-color': 'var(--lime-red)',
                }}
            />,
        ];
    }
}
