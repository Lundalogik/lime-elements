import { Component, Element, h, Prop, Watch } from '@stencil/core';
import { IconSize } from './icon.types';
import { loadSvg } from './loadSvg';

/**
 * Search for an icon and **click on it to copy its name to clipboard**.
 * <limel-example-icon-finder />
 *
 * *******
 *
 * :::important
 * To install your icon set correctly, please read the [documentation here](#/).
 * :::
 *
 * The size and color of the icon is normally set in CSS, however there are a few
 * standard sizes defined that can be used with the `size` property.
 *
 * :::note
 * There are icons included in the `@lundalogik/lime-icons8` package which are
 * designed by our designers at Lime.
 * The names of these icons start with `-lime-`, which makes them easy to
 * find using the Icon Finder tool below.
 *
 * Some of the multi-colored `-lime-` icons use our own CSS variables
 * (instead of HEX or RGB) values to visualize their colors. Thus, you must import
 * our color palette css files into your project to render the icons properly.
 * Read more about our [Color System](#/DesignGuidelines/color-system.md/)
 * and how to do this.
 * :::
 *
 * @exampleComponent limel-example-icon-name
 * @exampleComponent limel-example-icon-size
 * @exampleComponent limel-example-icon-color
 * @exampleComponent limel-example-icon-image
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
     * URL of image to display
     *
     * If given, this takes precedence over the `name` attribute.
     * Note that the image will be rendered as an `<img>` tag, and not as an
     * inline SVG. This means that, while you can render an external SVG file,
     * you will not be able to change its color using CSS.
     */
    @Prop({ reflect: true })
    public src?: string = null;

    /**
     * Set to `true` to give the icon a round background with some padding.
     * Only works when the `size` attribute is also set.
     */
    @Prop({ reflect: true })
    public badge: boolean;

    @Element()
    private host: HTMLLimelIconElement;

    public componentDidLoad() {
        this.renderContent();
    }

    public render() {
        return <div class="container" />;
    }

    @Watch('name')
    protected nameWatcher() {
        this.renderContent();
    }

    @Watch('src')
    protected srcWatcher() {
        this.renderContent();
    }

    private async renderContent() {
        if (this.src) {
            this.renderImg(this.src);

            return;
        }

        if (this.name === undefined || this.name === '') {
            return;
        }

        const svgData = await loadSvg(this.name);
        this.renderSvg(svgData);
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

    private renderImg(src: string) {
        const container = this.host.shadowRoot.querySelector('div.container');
        if (container) {
container.innerHTML = `<img loading="lazy" src="${src}" />`;
        }
    }
}
