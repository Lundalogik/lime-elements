import { Component, Element, h, Prop, Watch } from '@stencil/core';
import { globalConfig } from '../../global/config';
import iconCache from '../../global/icon-cache/factory';
import { IconSize } from './icon.types';

/**
 * :::important
 * To install your icon set correctly, please read the [documentation here](#/).
 * :::
 *
 * The size and color of the icon is normally set in CSS, however there are a few
 * standard sizes defined that can be used with the `size` property.
 *
 * @exampleComponent limel-example-icon-name
 * @exampleComponent limel-example-icon-size
 * @exampleComponent limel-example-icon-color
 */
@Component({
    tag: 'limel-icon',
    shadow: true,
    styleUrl: 'icon.scss',
})
export class Icon {
    /**
     * Size of the icon
     */
    @Prop({ reflect: true })
    public size: IconSize;

    /**
     * Name of the icon
     */
    @Prop({ reflect: true })
    public name: string;

    /**
     * Set to `true` to give the icon a round background with some padding.
     * Only works when the `size` attribute is also set.
     */
    @Prop({ reflect: true })
    public badge: boolean;

    @Element()
    private host: HTMLLimelIconElement;

    public componentDidLoad() {
        this.loadIcon(this.name);
    }

    public render() {
        return <div class="container" />;
    }

    @Watch('name')
    protected async loadIcon(name: string) {
        if (name === undefined || name === '') {
            return;
        }

        const svgData = await this.loadSvg(name);
        this.renderSvg(svgData);
    }

    /**
     * Load the SVG data for the icon from the icon cache
     *
     * @param name - name of the icon
     * @returns the icon SVG data
     */
    private loadSvg(name: string) {
        return iconCache.get(name, globalConfig.iconPath);
    }

    /*
     * There is no way to style external SVG files with CSS, i.e. SVGs loaded
     * with <img src="file.svg" /> or <object data="file.svg" type="image/svg+xml" />
     * will remain the way they look in the file.
     * Therefore we inject the svg as inline markup instead.
     */
    private renderSvg(svgData: string) {
        const container = this.host.shadowRoot.querySelector('div.container');
        if (container) {
            container.innerHTML = svgData;
        }
    }
}
