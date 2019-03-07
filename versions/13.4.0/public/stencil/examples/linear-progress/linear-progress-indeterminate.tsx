import { Component } from '@stencil/core';

@Component({
    shadow: true,
    tag: 'limel-example-linear-progress-indeterminate',
})
export class LinearProgressExampleIndeterminate {
    public render() {
        return <limel-linear-progress indeterminate={true} />;
    }
}
