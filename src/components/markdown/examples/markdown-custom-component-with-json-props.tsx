import { Component, h } from '@stencil/core';

const markdown = [
    'Check out this repo: ',
    '<limel-chip text="GitHub" icon="github_copyrighted" ',
    'link=\'{"href":"https://github.com/Lundalogik/lime-elements","title":"Open GitHub repo","target":"_blank"}\'',
    '></limel-chip>',
    ' ',
    'Or visit the docs: ',
    '<limel-chip text="Lime Elements" ',
    'icon=\'{"name":"book","color":"rgb(var(--color-green-default))"}\'',
    ' link=\'{"href":"https://lundalogik.github.io/lime-elements/","target":"_blank"}\'',
    '></limel-chip>',
].join('');

/**
 * Custom elements with complex props
 *
 * When custom elements are whitelisted, any attribute values that look
 * like JSON objects or arrays are automatically parsed and set as
 * JavaScript properties on the element.
 *
 * This makes it possible to use components that require complex data
 * types (like objects and arrays) directly in markdown content.
 *
 * :::tip
 * This is particularly useful when rendering AI chat responses that
 * include interactive components like chips, where the AI can output
 * HTML with JSON attribute values.
 * :::
 *
 * :::note
 * The custom element HTML must be on a single line in the markdown
 * source. Multiline HTML tags may be misinterpreted by the markdown
 * parser.
 * :::
 */
@Component({
    tag: 'limel-example-markdown-custom-component-with-json-props',
    shadow: true,
})
export class MarkdownCustomComponentWithJsonPropsExample {
    public render() {
        return (
            <limel-markdown
                value={markdown}
                whitelist={[
                    {
                        tagName: 'limel-chip',
                        attributes: ['text', 'icon', 'link'],
                    },
                ]}
            />
        );
    }
}
