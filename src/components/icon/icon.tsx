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
 * @exampleComponent limel-example-icon-svg-class
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

    /**
     * Sets the `class` attribute on the inner `<svg>` element rendered by
     * this component, replacing whatever class the source SVG shipped with.
     *
     * This is meant for icons whose SVG file contains internal `<style>`
     * blocks with rules that respond to classes — a single file that ships
     * with multiple visual states selectable via class names. Setting
     * `svgClass` is how a consumer reaches across the shadow boundary to
     * pick which of those states is active.
     *
     * For typical stateless icons, this prop has no visible effect.
     */
    @Prop({ reflect: true })
    public svgClass?: string;

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
            // On initial render, only override the SVG's class if the
            // consumer set `svgClass`. Otherwise leave the SVG's baked-in
            // class alone — that's the default state stateless icons rely on.
            if (this.svgClass !== undefined) {
                this.applySvgClass(this.svgClass);
            }
        }
    }

    @Watch('svgClass')
    protected applySvgClass(value: string | undefined) {
        const svg = this.host.shadowRoot?.querySelector('svg');
        if (!svg) {
            return;
        }
        if (value === undefined) {
            svg.removeAttribute('class');
        } else {
            svg.setAttribute('class', value);
        }
    }
}
