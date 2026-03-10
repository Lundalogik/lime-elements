import { Component, h } from '@stencil/core';

const OLD_VALUE = `const port = 3000;`;

const NEW_VALUE = `const port = 8080;`;

/**
 * Custom headings
 *
 * Use `oldHeading` and `newHeading` to replace the default
 * "Original" / "Modified" labels with names that fit your context,
 * such as "Before" and "After", or specific version identifiers.
 */
@Component({
    tag: 'limel-example-code-diff-headings',
    shadow: true,
})
export class CodeDiffHeadingsExample {
    public render() {
        return (
            <limel-code-diff
                oldValue={OLD_VALUE}
                newValue={NEW_VALUE}
                oldHeading="Before"
                newHeading="After"
            />
        );
    }
}
