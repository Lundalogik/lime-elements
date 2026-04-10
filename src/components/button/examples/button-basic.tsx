import { Component, h } from '@stencil/core';

/**
 * Default button
 *
 * This is the default appearance of the button, without any
 * extra props like `primary` or `outlined`.
 *
 * The default variant is the workhorse of your UI.
 * It should be used for the vast majority of actions: secondary
 * actions, auxiliary commands, toolbar buttons, and any
 * action that does not need to draw extra attention to itself.
 *
 * Its subtle appearance lets it stay in the background, so that
 * the few primary actions on the screen can stand out.
 */
@Component({
    tag: 'limel-example-button-basic',
    shadow: true,
})
export class ButtonBasicExample {
    public render() {
        return <limel-button label="Click me!" onClick={this.onClick} />;
    }

    private onClick() {
        console.log('Button clicked.');
    }
}
