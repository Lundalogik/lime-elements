import { Component, h, Host, Prop } from '@stencil/core';

const COMPONENT_BASE_URL = '#/component/';
const VERSION_BASE_URL =
    'https://github.com/lundalogik/lime-elements/releases/tag/';

/**
 * This component is used in our library documentation to showcase single component examples.
 * @private
 */

@Component({
    tag: 'limel-showcase-card',
    shadow: true,
    styleUrl: 'showcase-card.scss',
})
export class WhatsNewCard {
    /**
     * The main heading of the card
     */
    @Prop()
    public heading: string;

    /**
     * The name of the component being showcased.
     * The card will generate a link to the component documentation based on this name.
     */
    @Prop()
    public componentName: string;

    /**
     * The type of update being showcased
     */
    @Prop({ reflect: true })
    public type: 'feature' | 'bugfix' | 'component' = 'feature';

    /**
     * The date of the version release
     */
    @Prop()
    public releaseDate?: string;

    /**
     * The version number for the release (e.g. "38.28.0").
     * The card will prefix it with a leading 'v' and link to the GitHub release.
     */
    @Prop()
    public version?: string;

    /**
     * A short description of the showcased feature
     */
    @Prop()
    public description: string;

    public render() {
        return (
            <Host>
                <div>
                    <h3>{this.componentName}</h3>
                    <h2>{this.heading}</h2>
                </div>
                <div class="component">
                    <slot name="demo" />
                </div>
                <div class="badges">
                    {this.renderTypeBadge()}
                    <limel-badge class="date-badge" label={this.releaseDate} />
                    {this.renderVersionLink()}
                </div>
                <limel-markdown value={this.description} />
                {this.renderComponentLink()}
            </Host>
        );
    }

    private renderTypeBadge() {
        if (this.type === 'feature') {
            return <limel-badge label="Feature" />;
        }

        if (this.type === 'bugfix') {
            return <limel-badge label="Bugfix" />;
        }

        return <limel-badge label="Component" />;
    }

    private renderVersionLink() {
        if (!this.version) {
            return;
        }

        const tag = `v${this.version}`;
        const href = `${VERSION_BASE_URL}${tag}`;
        return (
            <a href={href} target="_blank" rel="noopener noreferrer">
                {tag}
            </a>
        );
    }

    private renderComponentLink() {
        const href = this.getComponentHref();
        const text = `Go to ${this.componentName}`;
        return <limel-chip text={text} link={{ href }} />;
    }

    private getComponentHref() {
        const slug = this.kebabCase(this.componentName);
        return `${COMPONENT_BASE_URL}limel-${slug}/`;
    }

    private kebabCase(value: string) {
        if (!value) {
            return '';
        }
        return value
            .trim()
            .toLowerCase()
            .replaceAll(/[^a-z0-9]+/g, ' ')
            .trim()
            .replaceAll(/\s+/g, '-');
    }
}
