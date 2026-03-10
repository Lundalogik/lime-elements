import { Component, h } from '@stencil/core';

const OLD_VALUE = `function greet(name) {
    console.log("Hello, " + name);
    return true;
}

function farewell(name) {
    console.log("Goodbye, " + name);
}`;

const NEW_VALUE = `function greet(name, greeting) {
    console.log(greeting + ", " + name);
    return true;
}

function farewell(name) {
    console.log("See you later, " + name);
    return false;
}`;

/**
 * Basic text diff
 *
 * This example shows a simple diff between two versions of a code snippet.
 * Removed lines are highlighted in red, added lines in green.
 * Word-level changes within modified lines are highlighted
 * with a darker shade.
 */
@Component({
    tag: 'limel-example-code-diff-basic',
    shadow: true,
    styleUrl: 'code-diff-basic.scss',
})
export class CodeDiffExample {
    public render() {
        return (
            <div>
                <limel-code-diff oldValue={OLD_VALUE} newValue={NEW_VALUE} />
            </div>
        );
    }
}
