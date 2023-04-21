import { Component, h } from '@stencil/core';

/**
 * With a long helper text, but no counter
 */
@Component({
    tag: 'limel-example-helper-line-long-text-no-counter',
    shadow: true,
})
export class HelperLineLongTextNoCounterExample {
    public render() {
        const longHelperText =
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

        return (
            <limel-helper-line
                helperText={longHelperText}
                helperTextId="tf-helper-text"
            />
        );
    }
}
