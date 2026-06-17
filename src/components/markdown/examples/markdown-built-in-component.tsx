import { Component, h } from '@stencil/core';

const markdown = `
## Built-in whitelisted components

A set of lime-elements components is whitelisted by default, so they can be
used directly in markdown content without configuring the \`whitelist\` prop.

For example, \`limel-icon\` is whitelisted, so you can render an icon inline: <limel-icon size="small" name="globe"></limel-icon>
`;

/**
 * Built-in whitelisted component
 *
 * Some lime-elements components, such as `limel-icon`, are whitelisted by
 * default. They can be used directly in markdown content without specifying
 * them in the `whitelist` prop.
 */
@Component({
    tag: 'limel-example-markdown-built-in-component',
    shadow: true,
})
export class MarkdownBuiltInComponentExample {
    public render() {
        return <limel-markdown value={markdown} />;
    }
}
