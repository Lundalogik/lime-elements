import { Component, h, Host, Prop } from '@stencil/core';
import { Link } from '@limetech/lime-elements';

/**
 * @private
 * Internal helper for the "What's New" example; NOT part of the public API.
 */
export interface WhatsNewChip {
    text: string;
    link?: Link;
    readonly?: boolean;
    outlined?: boolean;
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
