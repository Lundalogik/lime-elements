import { Component } from '@stencil/core';

@Component({
    tag: 'docs-limel-spinner',
    shadow: true,
})
export class SpinnerExample {
    public render() {
        return [
            <limel-spinner />,
            <limel-spinner size="mini" />,
            <limel-spinner size="x-small" />,
            <limel-spinner size="small" />,
            <limel-spinner size="medium" />,
            <limel-spinner size="large" />,
        ];
    }
}
