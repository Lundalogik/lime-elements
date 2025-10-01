import { Component, h, Prop } from '@stencil/core';
import { whatsNewItems, type ShowcaseItem } from './whats-new-items';

/**
 * This component is only used in our documentations
 * to provide a container for settings of examples.
 *
 * For example, it visually groups and organizes checkboxes
 * used to show different states of components,
 * such as Disabled, Required, Readonly, etc…
 *
 * @private
 */
@Component({
    tag: 'limel-example-whats-new',
    shadow: true,
    styleUrl: 'example-whats-new.scss',
})
export class ExampleWhatsNew {
    /**
     * Optional array of showcase items. If not provided, a default list is used.
     */
    @Prop() items: ShowcaseItem[] = whatsNewItems;

    public render() {
        const renderDemo = (tag: string) =>
            h(tag as any, { slot: 'demo' } as any);

        return (
            <div class="thumbnails-grid">
                {this.items.map((item) => (
                    <limel-showcase-card
                        heading={item.heading}
                        componentName={item.componentName}
                        description={item.description}
                        releaseDate={item.releaseDate}
                        version={item.version}
                        type={item.type as any}
                    >
                        {renderDemo(item.demoTag)}
                    </limel-showcase-card>
                ))}
            </div>
        );
    }
}
