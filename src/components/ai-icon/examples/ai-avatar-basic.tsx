import { Component, h } from '@stencil/core';

/**
 * Basic Example
 *
 */
@Component({
    tag: 'limel-example-ai-avatar-basic',
    shadow: true,
    styleUrl: 'ai-avatar-basic.scss',
})
export class AIAvatarBasicExample {
    public render() {
        return <limel-ai-avatar />;
    }
}
