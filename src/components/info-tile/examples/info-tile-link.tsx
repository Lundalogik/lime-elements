import { Component, h, Host } from '@stencil/core';
import { Link } from '@limetech/lime-elements';

/**
 * Turning the tile into a link
 *
 * An info tile usually summarizes something the user will want to look
 * into. Supply a `link` and the tile's anchor gets an `href`: it can then
 * be opened in a new tab from the context menu, and assistive technologies
 * announce it as a link rather than as a piece of text.
 *
 * Supplying a `link` is also what gives the tile its interactive styling:
 * a resting shadow, `cursor: pointer`, and — on hover — the elevation,
 * the tilt that follows the cursor, and the glow. Hover the first two
 * tiles below, then the third, which has no `link` and so stays flat and
 * completely still.
 *
 * The three tiles cover the cases you are likely to run into.
 *
 * **Navigating to another page.** The forecast tile points at an external
 * page and sets `target="_blank"`, so it opens in a new tab. Its `title`
 * becomes the tooltip, and `rel="noopener noreferrer"` is added
 * automatically.
 *
 * **Navigating inside your own app.** The deals tile is a link too, but its
 * click is intercepted so that a single page application can route without
 * reloading itself. Point the `link` at the real destination anyway, so that
 * modifier-clicking it still opens that destination in a new tab. Try
 * clicking it, and then shift-clicking it.
 *
 * **Not navigating at all.** The office tile has no `link`. It reports a
 * number and nothing more, so it gets none of the interactive styling, it
 * is not reachable with the keyboard, and it does not track the cursor. A
 * tile that cannot be activated should not look or behave as if it can.
 *
 * :::tip
 * If the tile must act on a click but has no URL to point at — a dialog
 * opens, for instance — supply `{ href: '#' }`. Without it the tile gets
 * no interactive styling and cannot be reached with the keyboard, so a
 * click handler on its own leaves the interaction invisible. Prefer a real
 * URL whenever one exists.
 * :::
 */
@Component({
    tag: 'limel-example-info-tile-link',
    shadow: true,
    styleUrl: 'info-tile-link.scss',
})
export class InfoTileLinkExample {
    private readonly forecastLink: Link = {
        href: 'https://duckduckgo.com/?q=weather+Stockholm',
        title: 'See the full forecast for Stockholm',
        target: '_blank',
    };

    private readonly dealsLink: Link = {
        href: '#/component/limel-table',
        title: 'Open the list of won deals',
    };

    public render() {
        return (
            <Host>
                <limel-info-tile
                    class="forecast"
                    icon="partly_cloudy_day"
                    label="Partly cloudy"
                    prefix="Stockholm"
                    value="7"
                    suffix="°C"
                    link={this.forecastLink}
                />
                <limel-info-tile
                    class="deals"
                    icon="money"
                    label="Won deals this month"
                    value="24"
                    link={this.dealsLink}
                    onClick={this.handleDealsClick}
                />
                <limel-info-tile
                    class="office"
                    icon="meeting"
                    label="Colleagues in the office today"
                    value="14"
                />
            </Host>
        );
    }

    private readonly handleDealsClick = (event: PointerEvent) => {
        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
            return;
        }

        event.preventDefault();
        alert(
            'No modifier key was pressed, so the application would normally hand this over to its own router instead of reloading the whole page.\n\nTry holding down a modifier key, such as Shift, while clicking.'
        );
    };
}
