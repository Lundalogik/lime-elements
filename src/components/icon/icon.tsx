import { Component, Element, h, Prop, Watch } from '@stencil/core';
import config from '../../global/config';
import iconCache from '../../global/icon-cache/factory';
import { IconSize } from '../../interface';

/**
 * The recommended icon library for use with Lime Elements is the Windows 10 set
 * from Icons8 (https://icons8.com/icons/windows). This set is included in the
 * relevant Lime products. If you are using Lime Elements in a non-Lime product,
 * you will have to supply your own icons.
 *
 * The size and color of the icon is set in CSS, however there are a few
 * standard sizes defined that can be used with the `size` property.
 *
 * ### Setup
 * To use **@lundalogik/lime-icons8**, the `/assets` folder from
 * __@lundalogik/lime-icons8__ must be made available on the webserver.
 * To use a different icon set, the icons must be placed in a folder structure
 * that looks like this: `assets/icons/<name-of-icon>.svg`
 *
 * If `assets` is placed in the root, no other setup is needed. The icons will
 * be fetched with a relative URL from `/assets/icons/<name-of-icon>.svg`.
 *
 * If `assets` is placed in a sub-folder somewhere, the easiest way to make the
 * icons available is to use the HTML `base` element:
 *
 * ```
 * <base href="/my/parent/path/">
 * ```
 *
 * If this is not enough, or if the `base` element is already in use for
 * something else, a global icon path can be configured with the `limel-config`
 * element:
 * ```
 * <limel-config config={{iconPath: '/my/parent/path/'}} />
 * ```
 *
 * ### Lime icons
 * There are icons included in the **@lundalogik/lime-icons8** package which are
 * designed by our designers at Lime.
 * The names of these icons start with `-lime-`, which makes them easy to
 * find using the Icon Finder tool below.
 * :::note
 * Some of the `-lime-` icons have multiple colors and use our own CSS variables
 * instead of HEX or RGB values to visualize their colors. Thus, you must import
 * our color palette css files into your project to render the icons properly.
 * Read more about our [Color System](#/DesignGuidelines/color-system.md/)
 * and how to do this.
 * :::
 *
 * ### Icon Finder
 *
 * Search for an icon and **click on it to copy its name to clipboard**.
 *
 * <limel-example-icon-finder />
 * @exampleComponent limel-example-icon
 * @exampleComponent limel-example-icon-background
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
     * @param {string} name name of the icon
     * @returns {string} the icon SVG data
     */
    private loadSvg(name: string) {
        return iconCache.get(name, config.iconPath);
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
