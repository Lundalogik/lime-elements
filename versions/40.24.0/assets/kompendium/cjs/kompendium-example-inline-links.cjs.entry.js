'use strict';

var index = require('./index-B_xYBJw_.js');

const inlineLinksExample = `
JSDoc/TSDoc \`{@link Target}\` references inside component descriptions are
turned into clickable links — the same syntax IDEs use for cmd-click
navigation. The plugin recognises:

- A known component tag: {@link kompendium-markdown}
- A known type: {@link MenuItem}
- A pipe-delimited display label: {@link MenuItem | the menu item interface}
- A space-delimited display label: {@link MenuItem the menu item interface}
- An absolute URL: {@link https://example.com | external resource}

Identifiers the resolver does not recognise still get rendered as inline
code, so they remain visually distinct from prose even when there is
nothing to navigate to:

- Unknown identifier: {@link DoesNotExist}
- Unknown identifier with a free-form label: {@link DoesNotExist a missing type}

References inside inline code such as \`{@link MenuItem}\` are intentionally
left untouched, so the literal syntax can be shown in documentation about
the feature itself.

\`\`\`ts
// References inside fenced code blocks are left alone too:
// {@link MenuItem} stays exactly like this.
\`\`\`
`;

const InlineLinksExample = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
    }
    render() {
        return index.h("kompendium-markdown", { key: 'c7d9c35768b82399af32d1a0f706860226697e6c', text: inlineLinksExample });
    }
};

exports.kompendium_example_inline_links = InlineLinksExample;
