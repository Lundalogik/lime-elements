import { Component, h } from '@stencil/core';

/**
 * Adding rich content
 *
 * Sometimes, you need to display more than just a string of text.
 * You may want to display richer content with pictures, links, or
 * bullet point lists; or use a more advanced component inside
 * the callout.
 *
 * To do so, simply wrap the content you want to display in this component.
 */
@Component({
    tag: 'limel-example-callout-rich-content',
    shadow: true,
})
export class CalloutRichContentExample {
    public render() {
        return (
            <limel-callout>
                <p>It's nice to be able to show you some pictures</p>
                <img
                    src="https://octodex.github.com/images/minion.png"
                    alt="The Octocat illustrated as a Minion"
                    style={{ width: '7rem' }}
                />
                <img
                    src="https://octodex.github.com/images/stormtroopocat.png"
                    alt="The Octocat illustrated as a Stormtrooper"
                    title="The Stormtroopocat"
                    style={{ width: '7rem' }}
                />
                <img
                    src="https://octodex.github.com/images/welcometocat.png"
                    alt="A happy Octocat with a party hat"
                    style={{ width: '7rem' }}
                />
                <p>
                    And a link to where you find{' '}
                    <a href="https://octodex.github.com/" target="blank">
                        these nice pictures
                    </a>{' '}
                    😉.
                </p>
            </limel-callout>
        );
    }
}
