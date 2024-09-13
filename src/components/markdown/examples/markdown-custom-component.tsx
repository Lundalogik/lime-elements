import { Component, h } from '@stencil/core';

const markdown =
    'This is 20% <meter value="0.2"></meter> and this is 100% <meter value="1" />';

/**
 * Custom Element
 *
 * You can allow custom elements by adding them to a whitelist. You need to specify both
 * the `tagName` of the element as well as the allowed `attributes`.
 */
@Component({
    tag: 'limel-example-markdown-custom-component',
    shadow: true,
})
export class MarkdownCustomComponentExample {
    public render() {
        return (
            <limel-markdown
                value={markdown}
                whitelist={[
                    {
                        tagName: 'meter',
                        attributes: ['value'],
                    },
                ]}
            />
        );
    }
}
