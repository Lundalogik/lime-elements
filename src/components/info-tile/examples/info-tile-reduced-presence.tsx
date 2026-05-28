import { Component, h, Host, State } from '@stencil/core';

/**
 * Reducing visual presence
 *
 * Info tiles can have bright colors that draw attention. When several
 * tiles sit on the same dashboard, the equally-loud visual styling can
 * overwhelm the user even though most tiles report nothing noteworthy.
 * For example: "zero customers need your attention today"
 *
 * :::tip
 * An info tile should tell the user:
 * > Hey 👋! Look at me. Here's something you should know about your
 * > business right now!
 *
 * not:
 * > Hey 👋! Look at me. I'm here to show you that nothing important is
 * > happening right now. Carry on with your work, and check on me
 * > later if you like.
 * :::
 *
 * Set `reducedPresence` to `true` on the tiles whose values are not
 * currently noteworthy. This is better than hiding the individual tiles.
 * This way, the tile keeps its position in a grid layout, and also remains
 * interactive. But is rendered with reduced saturation and opacity,
 * so the eye is drawn to the tiles that actually warrant attention.
 * The dimming clears on hover and keyboard focus, so the tile is
 * still fully readable when the user looks at it.
 *
 * The example below shows a typical operations dashboard. Four of the
 * six tiles report something unimportant; the other two report something the
 * user should look at. Toggle the switch to see how reducing the
 * presence of the four benign tiles makes the two tiles that actually
 * need attention stand out.
 */
@Component({
    tag: 'limel-example-info-tile-reduced-presence',
    shadow: true,
    styleUrl: 'info-tile-reduced-presence.scss',
})
export class InfoTileReducedPresenceExample {
    @State()
    private reducedPresence = false;

    public render() {
        return (
            <Host>
                <div class="tiles">
                    <limel-info-tile
                        class="open-bugs"
                        icon="bug"
                        label="Open bugs"
                        value="0"
                        reducedPresence={this.reducedPresence}
                    />
                    <limel-info-tile
                        class="active-tickets"
                        icon="ticket"
                        label="Active tickets"
                        value="0"
                        reducedPresence={this.reducedPresence}
                    />
                    <limel-info-tile
                        class="failed-automations"
                        icon="robot"
                        label="Failed automations"
                        value={3}
                    />
                    <limel-info-tile
                        class="overdue-todos"
                        icon="tasklist"
                        label="Overdue todos"
                        value="0"
                        reducedPresence={this.reducedPresence}
                    />
                    <limel-info-tile
                        class="critical-alerts"
                        icon="fire_alarm"
                        label="Critical alerts"
                        value={7}
                    />
                    <limel-info-tile
                        class="next-customer-meeting"
                        icon="meeting"
                        label="Next customer meeting"
                        prefix="in"
                        value="30 days"
                        reducedPresence={this.reducedPresence}
                    />
                </div>
                <limel-example-controls>
                    <limel-switch
                        label="Reduce presence on the non-noteworthy tiles"
                        value={this.reducedPresence}
                        onChange={this.handleToggle}
                    />
                </limel-example-controls>
            </Host>
        );
    }

    private readonly handleToggle = (event: CustomEvent<boolean>) => {
        this.reducedPresence = event.detail;
    };
}
