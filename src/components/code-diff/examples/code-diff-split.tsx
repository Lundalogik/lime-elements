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
 * Split (side-by-side) view
 *
 * Set `layout` to `split` for a side-by-side comparison.
 * The old version is shown on the left, the new version on the right.
 * Paired changes are aligned on the same row, making it easy
 * to see exactly what changed.
 */
@Component({
    tag: 'limel-example-code-diff-split',
    shadow: true,
})
export class CodeDiffSplitExample {
    public render() {
        return (
            <limel-code-diff
                oldValue={OLD_VALUE}
                newValue={NEW_VALUE}
                oldHeading="Original"
                newHeading="Modified"
                layout="split"
            />
        );
    }
}
