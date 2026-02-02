import { Component, h, State } from '@stencil/core';
import { ActionBarItem, ListSeparator } from '@limetech/lime-elements';

/**
 * Scrollable content with shadow indicators
 * When a card contains long content that exceeds the container height,
 * shadow fade effects automatically appear to indicate scrollable areas.
 *
 * The shadows dynamically show/hide based on scroll position:
 * - **Top shadow** appears when you can scroll up
 * - **Bottom shadow** appears when you can scroll down
 *
 * This provides a visual cue to users that there is more content available,
 * improving the overall user experience and discoverability of information.
 *
 * :::tip
 * Try scrolling the content to see how the shadows adapt to your scroll position!
 * :::
 */
@Component({
    shadow: true,
    tag: 'limel-example-card-scrollable-shadow',
    styleUrl: 'card-scrollable-shadow.scss',
})
export class CardScrollableShadowExample {
    @State()
    private actions: Array<ActionBarItem | ListSeparator> = [
        {
            text: 'Read more',
        },
        {
            text: 'Copy',
            icon: {
                name: 'copy',
                color: 'rgb(var(--color-blue-default))',
            },
        },
    ];
    public render() {
        const icon = {
            name: 'scroll',
            title: 'Scroll indicator',
        };

        const longMarkdownContent = `
## Interactive Scroll Shadows

This card demonstrates **automatic scroll shadow indicators** that help users understand when content extends beyond the visible area.

### How it works

The shadows appear dynamically based on your scroll position:

1. **Bottom Shadow**: Visible when there's content below
2. **Top Shadow**: Appears when you scroll down and can scroll back up
3. **No Shadow**: When you've reached the end in either direction

### Benefits

- ✨ Provides visual feedback about scrollable content
- 🎯 Improves content discoverability
- 🚀 Enhances user experience with subtle cues
- ♿ Better accessibility through clear affordances

### Technical Details

The implementation uses:
- \`scrollHeight\` vs \`clientHeight\` detection
- Dynamic CSS classes based on scroll position
- ResizeObserver for responsive updates
- Smooth opacity transitions

### Try it yourself

Scroll up and down to see the shadows appear and disappear at the top and bottom edges of the content area.

---

*This is the end of the content. Notice how the bottom shadow disappears!*
`;

        return (
            <limel-card
                icon={icon}
                heading="Scrollable Content"
                subheading="With dynamic shadow indicators"
                value={longMarkdownContent}
                actions={this.actions}
            />
        );
    }
}
