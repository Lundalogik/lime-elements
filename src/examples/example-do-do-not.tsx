import { Component, h, Host, Prop } from '@stencil/core';

/**
 * This component is only used in our documentations
 * to provide a container for enriching the guidelines with
 * good and bad examples.
 *
 * @private
 */
@Component({
    tag: 'limel-example-do-do-not',
    shadow: true,
    styleUrl: 'example-do-do-not.scss',
})
export class ExampleDoDoNot {
    /**
     * Supports markdown and can be used to add a description
     * to the "Do" section.
     */
    @Prop()
    public doDescription?: string;

    /**
     * Supports markdown and can be used to add a description
     * to the "Don't" section.
     */
    @Prop()
    public doNotDescription?: string;

    public render() {
        return (
            <Host>
                {this.renderSection(
                    'do',
                    'checkmark',
                    'Do',
                    this.doDescription,
                )}
                {this.renderSection(
                    'do-not',
                    'multiply',
                    "Don't",
                    this.doNotDescription,
                )}
            </Host>
        );
    }

    private renderSection(
        type: string,
        iconName: string,
        title: string,
        description?: string,
    ) {
        const titleId = `${type}-title`;
        const descriptionId = description ? `${type}-description` : undefined;

        return (
            <section
                class={type}
                aria-labelledby={titleId}
                aria-describedby={descriptionId}
            >
                <div>
                    <slot name={type} />
                    <footer>
                        <limel-icon name={iconName} aria-hidden="true" />
                        <h1 id={titleId}>{title}</h1>
                    </footer>
                </div>
                {this.renderDescription(description, descriptionId)}
            </section>
        );
    }

    private renderDescription(description?: string, id?: string) {
        if (!description) {
            return;
        }

        return <limel-markdown id={id} value={description} />;
    }
}
