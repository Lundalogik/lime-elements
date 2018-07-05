import { Component } from '@stencil/core';

@Component({
    tag: 'limel-example-doc',
    shadow: true
})
export class DocExample {

    render() {
        return (
            <div>
                <h3>TODO! We should write some instructions here!</h3>
                <p>To add a new example, add it to the <code>src/examples</code> folder and include it in the file <code>src/examples/examples.js</code></p>
            </div>
        );
    }
}

