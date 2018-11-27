import { Component } from '@stencil/core';

@Component({
    tag: 'limel-example-color-table',
    shadow: true,
    styleUrl: 'color-table.scss',
})
export class ColorTableExample {
    private colors = [
        'lime-deep-red',
        'lime-red',
        'lime-orange',
        'lime-yellow',
        'lime-green',
        'lime-turquoise',
        'lime-blue',
        'lime-dark-blue',
        'lime-magenta',
        'lime-light-grey',
        'lime-dark-grey',
    ];

    public render() {
        return <div class="grid">{this.colors.map(this.renderColorTile)}</div>;
    }

    private renderColorTile(color: string) {
        return (
            <div
                class="tile"
                style={{
                    backgroundColor: `var(--${color})`,
                }}
            >
                <pre>
                    --
                    {color}
                </pre>
            </div>
        );
    }
}
