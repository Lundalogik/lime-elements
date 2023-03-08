import { Component, h } from '@stencil/core';

/**
 * Type: `question`
 *
 * This type is useful for displaying a question.
 */
@Component({
    tag: 'limel-example-callout-question',
    shadow: true,
})
export class CalloutQuestionExample {
    public render() {
        return (
            <limel-callout type="question">
                <span slot="content">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Nulla et euismod nulla. Curabitur feugiat, tortor non
                    consequat finibus, justo purus auctor massa, nec semper
                    lorem quam in massa.
                </span>
            </limel-callout>
        );
    }
}
