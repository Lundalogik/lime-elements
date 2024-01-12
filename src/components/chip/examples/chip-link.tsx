import { Component, h } from '@stencil/core';
import { Link } from '@limetech/lime-elements';

/**
 * Chip as hyperlink
 * For accessibility and usability alike, if clicking on a chip should
 * result in any kind of navigation, it is preferable to use a link,
 * rather than a button.
 *
 * That way, the user can choose to, for example, open the link in a new tab.
 * For this reason, we suggest always providing a Link with
 * the URL representing the target state of the navigation.
 */
@Component({
    tag: 'limel-example-chip-link',
    shadow: true,
})
export class ChipLinkExample {
    link: Link = {
        href: 'https://github.com',
        title: 'Open Github',
        target: '_blank',
    };

    public render() {
        return (
            <limel-chip
                text="Github"
                icon="github_copyrighted"
                link={this.link}
            />
        );
    }
}
