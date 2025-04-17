import { Component, h } from '@stencil/core';

/**
 * Basic Example
 *
 */
@Component({
    tag: 'limel-example-lime-ai-avatar-basic',
    shadow: true,
    styleUrl: 'lime-ai-avatar-basic.scss',
})
export class LimeAiAvatarBasicExample {
    public render() {
        return <limel-lime-ai-avatar />;
    }
}
