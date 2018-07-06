import { Component } from '@stencil/core';

@Component({
    shadow: true,
    tag: 'limel-example-doc',
})
export class DocExample {
    public render() {
        return (
            <div>
                <h3>TODO! We should write some instructions here!</h3>
                <p>
                    To add a new example, add it to the{' '}
                    <code>src/examples</code> folder and include it in the file{' '}
                    <code>src/examples/examples.js</code>
                </p>
            </div>
        );
    }
}
