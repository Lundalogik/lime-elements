import { Component, h, Host, Prop } from '@stencil/core';
import type { Link } from '../../global/shared-types/link.types';
// Internal helper for the "What's New" example; NOT part of the public API.
/** @private */
export interface WhatsNewChip {
    text: string;
    link?: Link;
    readonly?: boolean;
}

@Component({
    tag: 'limel-whats-new-card',
    shadow: true,
    styleUrl: 'whats-new-card.scss',
})
export class WhatsNewCard {
    @Prop()
    public heading: string;

    @Prop()
    public description: string;

    @Prop()
    public chips: WhatsNewChip[] = [];

    public render() {
        return (
            <Host>
                <div class="news-chip-wrapper">
                    {this.chips.map((c) => (
                        <limel-chip
                            key={c.link?.href ?? c.text}
                            text={c.text}
                            link={c.link}
                            readonly={c.readonly}
                        />
                    ))}
                </div>
                <div class="news-card-content">
                    <slot name="demo" />
                </div>
                <h2>{this.heading}</h2>
                <p>{this.description}</p>
            </Host>
        );
    }
}
