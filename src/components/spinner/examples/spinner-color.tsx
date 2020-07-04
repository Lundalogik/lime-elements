import { Component, h } from '@stencil/core';

@Component({
    tag: 'limel-example-spinner-color',
    shadow: true,
})
export class SpinnerColorExample {
    public render() {
        return [
            <limel-spinner style={{ color: 'orange' }} />,
            <div style={{ color: 'blue' }}>
                <limel-spinner />
            </div>,
        ];
    }
}
