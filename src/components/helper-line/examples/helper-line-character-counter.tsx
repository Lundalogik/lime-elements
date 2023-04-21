import { Component, h } from '@stencil/core';

/**
 * Only with a character counter
 */
@Component({
    tag: 'limel-example-helper-line-character-counter',
    shadow: true,
})
export class HelperLineCharacterCounterExample {
    public render() {
        return (
            <limel-helper-line
                length={10}
                maxLength={20}
                helperTextId="tf-helper-text"
            />
        );
    }
}
