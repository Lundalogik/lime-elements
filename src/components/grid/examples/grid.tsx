import { Component, h } from '@stencil/core';

@Component({
    tag: 'limel-example-grid',
    shadow: true,
    styleUrl: 'grid.scss',
})
export class GridExample {
    public render() {
        return (
            <limel-grid>
                <my-deep-red-component />
                <my-red-component />
                <my-orange-component />
                <my-yellow-component />
                <my-green-component />
                <my-turquoise-component />
                <my-blue-component />
                <my-dark-blue-component />
                <my-magenta-component />
                <my-light-grey-component />
                <my-dark-grey-component />
            </limel-grid>
        );
    }
}
